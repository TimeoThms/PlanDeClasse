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


let elements = [];

const elementsLayer = new Konva.Layer();
stage.add(elementsLayer);

const transformerNoResize = new Konva.Transformer({
    nodes: [],
    rotateEnabled: true,
    resizeEnabled: false,
    enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
    rotateAnchorOffset: 20,
    rotationSnaps: Array.from({ length: 73 }, (_, i) => i * 5), // [0, 5, 10, 15, ..., 355]
});

elementsLayer.add(transformerNoResize);

updateGrid();

function generateId() { // Uses timestamp as unique identifier
    return `id_${Date.now()}`;
}
