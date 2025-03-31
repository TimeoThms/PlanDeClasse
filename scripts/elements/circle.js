const addCircleBtn = document.getElementById("add-circle-btn");
const circleColorInput = document.getElementById("circle-color");
const circleColorLabel = document.getElementById("circle-color-label");
const circleLabelInput = document.getElementById("circle-label-input");

circleColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    circleColorLabel.style.backgroundColor = selectedColor;
});

// Returns the list of shapes used to make the circle
function createCircle({ color = "#000", label = "empty", width = 100, height = 100}) {
    let ellipse = new Konva.Ellipse({
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        fill: color
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
    updateElement({
        type: "circle",
        id: transformer.nodes()[0].id(), // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer nodes
        config: {
            color: editorCircleColorInput.value,
            label: editorCircleLabelInput.value,
            width: transformer.nodes()[0].width(),
            height: transformer.nodes()[0].height(),
        },
    });
}

function syncCircleEditor({ color = "#000", label = ""}) {
    editorCircleColorInput.value = color;
    editorCircleColorLabel.style.backgroundColor = color;
    editorCircleLabelInput.value = label;
}
