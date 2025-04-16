const addRectangleBtn = document.getElementById("add-rectangle-btn");
const rectangleColorInput = document.getElementById("rectangle-color");
const rectangleColorLabel = document.getElementById("rectangle-color-label");
const rectangleLabelInput = document.getElementById("rectangle-label-input");

rectangleColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    rectangleColorLabel.style.backgroundColor = selectedColor;
});

// Returns the list of shapes used to make the rectangle
function createRectangle({
    color = "#000",
    label = "",
    width = 100,
    height = 100,
}) {
    let rect = new Konva.Rect({
        x: 0,
        y: 0,
        width: width,
        height: height,
        fill: color,
    });

    let text = new Konva.Text({
        x: 0,
        y: 0,
        width: width,
        height: height,
        text: label,
        fontSize: 10,
        fontFamily: "Arial",
        fill: "#000",
        align: "center",
        verticalAlign: "middle",
    });

    return [rect, text];
}

addRectangleBtn.addEventListener("click", () => {
    addElement({
        type: "rectangle",
        id: generateId(),
        x: 100,
        y: 100,
        rotation: 0,
        config: {
            color: rectangleColorInput.value,
            label: rectangleLabelInput.value,
            width: 100,
            height: 100,
        },
    });
    pushStateSnapshot();
});

// EDITOR
const editorRectangleColorInput = document.getElementById(
    "editor-rectangle-color"
);
const editorRectangleColorLabel = document.getElementById(
    "editor-rectangle-color-label"
);
const editorRectangleLabelInput = document.getElementById(
    "editor-rectangle-label-input"
);

editorRectangleColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    editorRectangleColorLabel.style.backgroundColor = selectedColor;
    updateRectangle();
});

editorRectangleLabelInput.addEventListener("input", () => {
    updateRectangle();
});

function updateRectangle() {
    const group = transformer.nodes()[0]; // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer
    if (!group) return;
    const box = group.getClientRect({ skipTransform: true });
    updateElement({
        type: "rectangle",
        id: group.id(),
        config: {
            color: editorRectangleColorInput.value,
            label: editorRectangleLabelInput.value,
            width: box.width,
            height: box.height,
        },
    });
}

function syncRectangleEditor({ color = "#000", label = "" }) {
    editorRectangleColorInput.value = color;
    editorRectangleColorLabel.style.backgroundColor = color;
    editorRectangleLabelInput.value = label;
}
