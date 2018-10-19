const cv = require('opencv');
const randomInt = require('random-int');

var fileName = "./images/cars";
var fileExt = ".jpg";

cv.readImage(fileName + fileExt, function(err, im){

    if (err) throw err;

    var width = im.width();
    var height = im.height();
    
    if (width < 1 || height < 1) throw new Error('Image has no size');

    var limit = getAverageThreshold(im, 100);
    var bwImg = getBlackAndWhiteMask(im, limit);
    //bwImg.save('./images/bwtest.jpg');

    var minCarArea =  50 * 40; // min car size
    var maxCarArea = width * height / 4; // max car size 1/16 of picture

    var contours = bwImg.findContours();

    var cars = 0;

    for (i = 0; i < contours.size(); i++) {

        var area = contours.area(i);
        //console.log(area);

        if (area < minCarArea || area > maxCarArea) continue;

        cars += 1;
    }
    
    console.log("Cars : ", cars);
    //console.log("Contours : ", contours);
});

function getAverageThreshold(cvImg, noPoints){

    var threshold = 0;

    var data = cvImg.getData();
    var height = cvImg.height();
    var width = cvImg.width();

    var sum = 0;
    var cnt = 0;

    for(var i = 0; i < noPoints; i++){
        
        var x = randomInt(width);
        var y = randomInt(height);

        var pos = 3 * (width * x + y);
        var val = data[pos] + data[pos + 1] + data[pos + 2];
        //console.log(val);

        if(!isNaN(val)){
            sum += val;
            cnt += 1;
        }
    }

    threshold = Math.round(sum / cnt);

    return threshold;
}

function getBlackAndWhiteMask(cvImg, limit){
    
    // B, G, R
    var WHITE = [255, 255, 255];

    var width = cvImg.width();
    var height = cvImg.height();

    var bwImg = new cv.Matrix(height, width, cv.Constants.CV_8UC1, WHITE);
    
    var oldData = cvImg.getData();
    var data = bwImg.getData();

    for(var x = 0; x < 3 * width; x++){
        for(var y = 0; y < 3 * height; y++){
            
            var pos = 3 * (width * x + y);
            var val = oldData[pos] + oldData[pos + 1] + oldData[pos + 2];
            
            var newPos = width * x + y;

            if(val < limit){
                data[newPos] = 0;
                data[newPos + 1] = 0;
                data[newPos + 2] = 0;
            }
            else{
                data[newPos] = 255;
                data[newPos + 1] = 255;
                data[newPos + 2] = 255;
            }
        }
    }

    bwImg.put(data);

    return bwImg;
}