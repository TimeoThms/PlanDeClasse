const addCircleBtn = document.getElementById("add-circle-btn");
const circleColorInput = document.getElementById("circle-color");
const circleColorLabel = document.getElementById("circle-color-label");
const circleLabelInput = document.getElementById("circle-label-input");

circleColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    circleColorLabel.style.backgroundColor = selectedColor;
});

// Returns the list of shapes used to make the circle
function createCircle({
    color = "#000",
    label = "empty",
    width = 100,
    height = 100,
}) {
    let ellipse = new Konva.Ellipse({
        x: width / 2,
        y: height / 2,
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

    return [ellipse, text];
}

addCircleBtn.addEventListener("click", () => {
    addElement({
        type: "circle",
        id: generateId(),
        x: 100,
        y: 100,
        rotation: 0,
        config: {
            color: circleColorInput.value,
            label: circleLabelInput.value,
        },
    });
    pushStateSnapshot();
});

// EDITOR
const editorCircleColorInput = document.getElementById("editor-circle-color");
const editorCircleColorLabel = document.getElementById(
    "editor-circle-color-label"
);
const editorCircleLabelInput = document.getElementById(
    "editor-circle-label-input"
);

editorCircleColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    editorCircleColorLabel.style.backgroundColor = selectedColor;
    updateCircle();
});
editorCircleLabelInput.addEventListener("input", () => {
    updateCircle();
});

function updateCircle() {
    const group = transformer.nodes()[0]; // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer
    const box = group.getClientRect({ skipTransform: true });
    updateElement({
        type: "circle",
        id: group.id(),
        config: {
            color: editorCircleColorInput.value,
            label: editorCircleLabelInput.value,
            width: box.width,
            height: box.height,
        },
    });
}

function syncCircleEditor({ color = "#000", label = "" }) {
    editorCircleColorInput.value = color;
    editorCircleColorLabel.style.backgroundColor = color;
    editorCircleLabelInput.value = label;
}
