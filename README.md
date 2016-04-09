# Node-Image-Reszier

Recently we came across a requirement where we have to resize remote image's to specific percentage with no compromises in image quality. After googling for 2 days we found nothing which sort of matches with our requirement. Hence we decided to code up this project where image's are resized on the fly and cached in directory for fast retrival next time.

Image Resizer is build with Node.js and lwip liberary engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient .This module provides comprehensive, fast, and simple image processing and manipulation capabilities.


Installation :  
Entire installation procress is extremelty simple and can be done in few easy steps
a. Installation of lWip which is prerequesties , just run 
       npm install lwip
   Or 
clone this repo and cd lwip && npm install.   https://github.com/EyalAr/lwip#installation

b. Before you start remove your old installation 
      sudo rm -r ~/.npm
c.Now install nvm
      curl https://raw.githubusercontent.com/creationix/nvm/v0.16.1/install.sh | bash
d. To activate nvm
      source ~/.nvm/nvm.sh

e. Then install node

nvm install 0.10
nvm use 0.10

f. Then install express
    npm install -g express  
    
    
How to Run this :  Running this project is extemely easy  just type 
node imageResizer.js  at your terminal and it will start the port 8080

Usage :
http://localhost:8080/fetch?imageurl=http://images.fonearena.com/blog/wp-content/uploads/2013/11/Lenovo-p780-camera-sample-10.jpg&w=50&h=100

imageurl  is  remote url of the image to resize.
w= 50 & h = 50 ( which reduce the image to 50% of original width and height ) .


Credit :
https://github.com/EyalAr/lwip#installation

Thank you 
Tech Integrity Services Team
www.techintegrity.in


 















Nailer is a system for generating thumbnail images from web resources. Nailer can be setup to use anyone of the existing thumbnail generation systems like Webthumb, uses RMagic to thumbnail documents such as PDF and Word. It also provides workers for various background systems like resque, DelayedJob and BackgrounDRb.

https://github.com/EyalAr/lwip