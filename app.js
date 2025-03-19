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

layer.on("click", () => {
    transformerNoResize.nodes().forEach((node) => {
        node.draggable(false);
    });
    transformerNoResize.nodes([]);
    elementsLayer.batchDraw();
})

let elements = [];

const elementsLayer = new Konva.Layer();
stage.add(elementsLayer);

const transformerNoResize = new Konva.Transformer({
    nodes: [],
    rotateEnabled: true,
    resizeEnabled: false,
    enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
    rotateAnchorOffset: 20,
    anchorCornerRadius: 100,
    rotationSnaps: Array.from({ length: 73 }, (_, i) => i * 5), // [0, 5, 10, 15, ..., 355]
    draggable: true,
    shouldOverdrawWholeArea: true,
    ignoreStroke: true,
});

transformerNoResize.on("dragmove", (e) => {
    const transformer = e.target;
    const stage = transformer.getStage();
    let { width, height } = stage.size();
    height += transformerNoResize.rotateAnchorOffset() + 5;

    const box = transformer.getClientRect();

    let minX = Infinity,
        minY = Infinity;

    transformerNoResize.nodes().forEach((node) => {
        minX = Math.min(minX, node.x());
        minY = Math.min(minY, node.y());
    });


    let newX = minX;
    let newY = minY;

    if (minX < 0) {
        newX = 0;
    }
    if (minY < 0) {
        newY = 0;
    }
    if (minX + box.width > width) {
        newX = width - box.width;
    }
    if (minY + box.height > height) {
        newY = height - box.height;
    }

    if (gridToggled) {
        // Snap to the grid
        [newX, newY] = getNearestGridPoint(newX, newY);
    }

    transformerNoResize.nodes().forEach((element) => {
        element.position({
            x: newX + (element.x() - minX),
            y: newY + (element.y() - minY),
        });
    });

    elementsLayer.batchDraw();
});

elementsLayer.add(transformerNoResize);

updateGrid();

function generateId() {
    // Uses timestamp as unique identifier
    return `id_${Date.now()}`;
}
