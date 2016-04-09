/*!
 * Tech Integrity Services
 * v0.1.0 Alpha
 * Copyright 2016 Tech Integrity Services http://www.techintegrity.in
 */
var async = require('async');
var urlmethod = require('url');
var fs = require('fs');
var http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var express = require('express');
var w = require('lwip');
var app = express();
app.use(express.static('cache'));
var DOWNLOAD_DIR = 'download/';
var CACHE_DIR = 'cache/';
var re = /(?:\.([^.]+))?$/; // Regular expression to get extension 
var sizeOf = require('image-size');



var q = async.queue( function (data, callback) 
{
   if (data.flag == 1 )  // This is 1st call where we check if image exist
    {
        var file_url =data.fileUrl;
        var file_name = urlmethod.parse(file_url).pathname.split('/').pop();
        var ext = re.exec(file_name)[1]; 
        if (ext == "" || ext == null || ext == "undefined" )  
        {
            
        }
        else{
             var _width = parseInt (data.width);
             var _height =parseInt ( data.height) ;
             var lastIndex = file_name.lastIndexOf(".");
             var onlyFileName =  file_name.substr(0,lastIndex);
             var appendedFilename = onlyFileName + data.width + data.height + "." +ext;
            fs.exists(CACHE_DIR +appendedFilename, function(exists)
            {
                if(exists == true)
                {
                    callback(exists,data.flag,data.width, data.height,appendedFilename);
                }
                else{
                 callback(exists,data.flag,data.width, data.height,file_url);
                }
            });
        }
    }
    if ( data.flag == 2)
    {
        var file_url =data.fileUrl;
        var file_name = urlmethod.parse(file_url).pathname.split('/').pop();
        var options = {
                host: urlmethod.parse(file_url).host,
                path: urlmethod.parse(file_url).pathname
                };
        var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);
        http.get(options, function(res) 
        {
            res.on('data', function(data)
            {
                  file.write(data) 
             }).on('end', function() {
                   file.end();
                   w.open( DOWNLOAD_DIR + file_name, function(err, image)
                   {
                      if (image== null) {
                          
                         var width = data.width;
                          var height = data.height ;
                          callback(true,data.flag,width, height, null);
                          fs.unlink ("download/"+ file_name); 
                        
                      } 
                       else{
                          
                           
                           // after resize store that in cache with filename_width_height.extn
                            var ext = re.exec(file_name)[1]; 
                            if (ext == "" || ext == null || ext == "undefined" )  
                            {
                                 
                            }
                           else{
                            
                               /*
                                  If there is a valid extension exist for the file.
                                  split the file name with extension
                               */
                               var _width = parseInt (data.width);
                               var _height =parseInt ( data.height) ;
                               var lastIndex = file_name.lastIndexOf(".");
                               var onlyFileName =  file_name.substr(0,lastIndex);
                               var appendedFilename = onlyFileName + data.width + data.height + "." +ext;
                               
                               
                               sizeOf(DOWNLOAD_DIR + file_name, function (err, dimensions) {
                                        console.log(dimensions.width, dimensions.height);
                                   
                                   
                                   // _width has percentage 
                                   
                                   var newWidth = (dimensions.width * _width) / 100 ;
                                   var newHeight =  (dimensions.height * _height) / 100 ;
                                   image.batch().resize(parseInt(newWidth),parseInt(newHeight)).writeFile( CACHE_DIR + appendedFilename, function(err)
                               {
                                      
                                    callback(true,data.flag,data.width,data.height,appendedFilename);
                                    fs.unlink ("download/"+ file_name); 
                                });
                                   
                                   
                                   
                                });

                               
                               
                           }

                           
                            
                       }
                   });
             });
        });

    }
    

}, 2);

var total_task = 0;
var max_task = 100;
function addWork( _flag,fileUrl,_width,_height, myCallback ) {
   total_task++;
    q.push({flag:_flag,fileUrl:fileUrl,width:_width,height:_height},function (status,currentFlag,_width,_height,file_name) {
        total_task--;
        if ( currentFlag == 1)
        {
            if (status) 
            {
                myCallback( file_name );
            }
            else
            {
                addWork(2,file_name,_width,_height,function ( responseFilePath) 
                           {
                    myCallback(responseFilePath);
                            } );
            }
        }
        else if  ( currentFlag == 2)
        {
            myCallback( file_name );
        }
    });
    q.resume();
 } 
 
// Constants
var DEFAULT_PORT = 8080;
var PORT =  DEFAULT_PORT;

// App

app.get('/', function (req, res) {
    res.render('index', {});
});

app.get('/fetch', function (req, res) {
 var fileUrl = req.query.imageurl;
var width = req.query.w;
var height = req.query.h;
var file_name = urlmethod.parse(fileUrl).pathname.split('/').pop();
var ext = re.exec(file_name)[1]; 
    
    
       
if (ext == "" || ext == null || ext == "undefined" )  
{
           res.writeHead(404, {'Content-Type': 'image/jpg' });
             res.end(null, 'binary');
}
    else{
   
    var response = addWork(1,fileUrl,width,height,function ( responseFilePath) 
    {
        if(responseFilePath == null)
        {
            res.writeHead(404, {'Content-Type': 'image/jpg' });
             res.end(null, 'binary');
        }
        else{
            
              var img = fs.readFileSync('cache/'+responseFilePath);
              res.writeHead(200, {'Content-Type': 'image/jpg' });
              res.end(img, 'binary');
        }
        } );
    }    
     });
app.listen(PORT)
console.log('Running on http://localhost:' + PORT);