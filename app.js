// Stage init
const container = document.getElementById("container");

const stage = new Konva.Stage({
    container: "container",
    width: 1485,
    height: 1050,
});

// Fill size inputs, in meters, 1px = 1cm
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

updateGrid();

let last_id = null;
function generateId() {
    // Uses timestamp as unique identifier
    id = `id_${Date.now()}`;
    while (id == last_id) {
        id = `id_${Date.now()}`;
    }
    last_id = id;
    return id;
}
