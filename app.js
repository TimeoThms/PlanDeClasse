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


// Init the transformer for elements that dont need to have a resize function
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

    // Find the minimum X and Y of the selection
    transformerNoResize.nodes().forEach((node) => {
        minX = Math.min(minX, node.x());
        minY = Math.min(minY, node.y());
    });

    let newX = minX;
    let newY = minY;

    // Correct coords if selection is dragged out of the stage
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

    // Elements potions relatively to their position with the selection
    transformerNoResize.nodes().forEach((element) => {
        element.position({
            x: newX + (element.x() - minX),
            y: newY + (element.y() - minY),
        });
    });

    elementsLayer.batchDraw();
});

// Unselect all elements if layer is clicked (aka background rect and grid lines)
layer.on("click", () => {
    transformerNoResize.nodes().forEach((node) => {
        node.draggable(false);
    });
    transformerNoResize.nodes([]);
    elementsLayer.batchDraw();

    elementEditor.style.top = "-100px"
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Delete") {
        const selectedNodes = transformerNoResize.nodes();
        selectedNodes.forEach((node) => {
            node.destroy();
            projectData.elements = projectData.elements.filter(
                (obj) => obj.id !== node.id()
            );
        });
        transformerNoResize.nodes([]);
        elementsLayer.batchDraw();
        elementEditor.style.top = "-100px"
    }
});

elementsLayer.add(transformerNoResize);

updateGrid();

function generateId() {
    // Uses timestamp as unique identifier
    return `id_${Date.now()}`;
}
