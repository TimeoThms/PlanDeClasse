var width = window.innerWidth;
var height = window.innerHeight - 25;

// Init stage
var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
});

var layer = new Konva.Layer();
stage.add(layer);

var testRect = new Konva.Rect({
    x: 300,
    y: 0,
    width: width-300,
    height: height,
    fill: 'green',  
    shadowBlur: 10,
    cornerRadius: 10,
});
layer.add(testRect);
