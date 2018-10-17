const cv = require('opencv');

var fileName = "./images/bitmap_3cars";
var fileExt = ".png";

cv.readImage(fileName + fileExt, function(err, im){
    
    if (err) throw err;

    var width = im.width();
    var height = im.height();
    
    if (width < 1 || height < 1) throw new Error('Image has no size');

    var im_canny = im.copy();

    var lowThresh = 0;
    var highThresh = 100;
    var nIters = 2;

    im_canny.canny(lowThresh, highThresh);
    im_canny.dilate(nIters);
  
    var contours = im_canny.findContours();

    var size = contours.size();
    var cars = Math.round(size / 4);
    
    console.log("Cars : ", cars);
    //console.log("Contours : ", contours);
});