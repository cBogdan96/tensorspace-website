let model;
let imagenetResult;
let predictDataKey = "panda";
let selectedDiv = undefined;

let dataLookup = {

    panda: {

        relativeDiv: "data1",
        dataUrl: "../../assets/data/panda.json",
        imageUrl: "../../assets/img/playground/panda.jpg"

    },

    tigerCat: {

        relativeDiv: "data2",
        dataUrl: "../../assets/data/tigerCat.json",
        imageUrl: "../../assets/img/playground/tigerCat.jpg"

    },

    hummingbird: {

        relativeDiv: "data3",
        dataUrl: "../../assets/data/hummingbird.json",
        imageUrl: "../../assets/img/playground/hummingbird.jpg"

    },

    peacock: {

        relativeDiv: "data4",
        dataUrl: "../../assets/data/peacock.json",
        imageUrl: "../../assets/img/playground/peacock.jpg"

    },

    squirrel: {

        relativeDiv: "data5",
        dataUrl: "../../assets/data/squirrel.json",
        imageUrl: "../../assets/img/playground/squirrel.jpg"

    },

    snail: {

        relativeDiv: "data6",
        dataUrl: "../../assets/data/snail.json",
        imageUrl: "../../assets/img/playground/snail.jpg"

    }

};

$(function () {

    $.ajax({
        url: '../../assets/data/imagenet_result.json',
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function (data) {

            imagenetResult = data;
            createModel();

        }
    });

    $("#selector > main > div > img").click(function () {
        $(this).css("border", "1px solid #6597AF");
        if (selectedDiv !== undefined) {
            $("#" + selectedDiv).css("border", "0");
        }
        selectedDiv = $(this).attr('id');
    });

    $("#cancelPredict").click(function () {
        hideSelector()
    });

    $("#selectorCurtain").click(function () {
        hideSelector();
    });

    $("#selectorTrigger").click(function () {
        showSelector();
    });

    $("#snapShot").click(function () {
        take_snapshot();
    });

    $("#startCamera").click(function(){
        attach_camera();     
    });

    $("#executePredict").click(function () {

        updatePredictDataKey();
        hideSelector();
        getDataAndPredict(function (finalResult) {
            $("#labelImage").attr("src", dataLookup[predictDataKey].imageUrl);
            generateInference(finalResult);
        });

    });

    $("#executePredictCamera").click(function () {

        //updatePredictDataKeyCamera();
        // getDataAndPredictCamera(function (finalResult) {
        //     //$("#results").attr("src", dataLookup[predictDataKey].imageUrl);
        predictCamera(); 
        // generateInference(finalResult);
        // });

    });

});

function createModel() {

    let container = document.getElementById("modelArea");

    model = new TSP.models.Sequential(container, {

        stats: true

    });

    model.add(new TSP.layers.RGBInput());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.DepthwiseConv2d());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.DepthwiseConv2d());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.DepthwiseConv2d());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.DepthwiseConv2d());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.DepthwiseConv2d());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.DepthwiseConv2d());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.DepthwiseConv2d());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.DepthwiseConv2d());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.DepthwiseConv2d());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.DepthwiseConv2d());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.DepthwiseConv2d());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.DepthwiseConv2d());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.DepthwiseConv2d());

    model.add(new TSP.layers.Conv2d());

    model.add(new TSP.layers.GlobalPooling2d());

    model.add(new TSP.layers.Output1d({

        paging: true,
        segmentLength: 200,
        outputs: imagenetResult

    }));

    model.load({

        type: "tfjs",
        url: '../../assets/model/mobilenetv1/model.json',

        onProgress: function (fraction) {

            $("#downloadProgress").html((100 * fraction).toFixed(2) + "%");

        },

        onComplete: function () {

            $("#downloadNotice").hide();
            $("#creationNotice").show();

        }

    });

    model.init(function () {

        getDataAndPredict(function (finalResult) {
            $("#loadingPad").hide();

            generateInference(finalResult);

        });

    });

}

function getDataAndPredict(callback) {

    $.ajax({
        url: dataLookup[predictDataKey].dataUrl,
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function (data) {

            model.predict(data, function (finalResult) {

                if (callback !== undefined) {
                    callback(finalResult);
                }

            });

        }
    });

}




function showSelector() {
    $("#selector").show();
    $("#selectorCurtain").show();
}

function hideSelector() {
    $("#selector").hide();
    $("#selectorCurtain").hide();
    if (selectedDiv !== undefined) {
        $("#" + selectedDiv).css("border", "0");
    }
    selectedDiv = undefined;
}

function updatePredictDataKey() {




    for (let key in dataLookup) {

        if (dataLookup[key].relativeDiv === selectedDiv) {

            predictDataKey = key;
            break;

        }

    }

}

function predictCamera() {
    
    let canvas = document.getElementById('canvas');
    let imageSnap = document.getElementById('results');
    let context = canvas.getContext( '2d' );
    context.drawImage(imageSnap,0,0, canvas.width, canvas.height);
    let imgData = context.getImageData( 0, 0, canvas.width, canvas.height );
    context.putImageData(imgData,0,0);

    let cameraImage = [];
    let size = imgData.width * imgData.height *4;

    let maxR = 0;
    let minR = 255;

    let maxG = 0;
    let minG = 255;

    let maxB = 0;
    let minB = 255;

    for (let i = 0, dx = 0; dx < size; i++, dx = i << 2) {
        cameraImage.push( imgData.data[dx]);
        if(imgData.data[dx] > maxR){
            maxR= imgData.data[dx];
        }
        if(imgData.data[dx] < minR){
            minR= imgData.data[dx];
        }
        cameraImage.push( imgData.data[dx+1]);
        if(imgData.data[dx] > maxG){
            maxG= imgData.data[dx];
        }
        if(imgData.data[dx] < minG){
            minG= imgData.data[dx];
        }
        cameraImage.push( imgData.data[dx+2]);
        if(imgData.data[dx] > maxB){
            maxB= imgData.data[dx];
        }
        if(imgData.data[dx] < minB){
            minB= imgData.data[dx];
        }

    }

    for(let j =0 ; j< cameraImage.length;j+=3){
        cameraImage[j] = 2*(cameraImage[j] - minR) / (maxR - minR)
        cameraImage[j+1] = 2*(cameraImage[j+1] - minG) / (maxG - minG)
        cameraImage[j+2] = 2*(cameraImage[j+2] - minB) / (maxB - minB)
    }
   



	// for ( let i = 0; i < 224; i += 8 ) {

	// 	for ( let j = 3; j < 172032; j += 32 ) {

        //  for( let j = 0; j < 150528; j += 1 ) {

        //     var b =  imgData.data[j] * 1.0/255;
               
		// 	cameraImage.push( b );

        //  }


	// 	}

    // }
    
    model.predict(cameraImage, function (finalResult) {

        generateInference(finalResult)

    });

}





function generateInference(finalResult) {

    let maxIndex = 0;

    for (let i = 1; i < finalResult.length; i++) {

        maxIndex = finalResult[i] > finalResult[maxIndex] ? i : maxIndex;

    }

    console.log(imagenetResult[maxIndex]);

    $("#PredictResult").text(imagenetResult[maxIndex]);

}

function attach_camera(){
    Webcam.set({
        width: 320,
        height: 240,
        image_format: 'jpeg',
        jpeg_quality: 90
       });
       Webcam.attach( '#my_camera' );
}


function take_snapshot() {

    // take snapshot and get image data
    Webcam.snap(function (data_uri) {
        // display results in page
        $("#results").attr('src',data_uri)
        selectedDivSnap = data_uri;

    });
}