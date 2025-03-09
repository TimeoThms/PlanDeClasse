// Stage init

const container = document.getElementById("container");

const stage = new Konva.Stage({
    container: "container",
    width: 1485,
    height: 1050,
});

widthInput.value = stage.width() / 100;
heightInput.value = stage.height() / 100;

const layer = new Konva.Layer();
stage.add(layer);

const canvas = new Konva.Rect({
    x: 0,
    y: 0,
    width: stage.width(),
    height: stage.height(),
    fill: "white",
});
layer.add(canvas);
canvas.moveToBottom();

updateGrid();
