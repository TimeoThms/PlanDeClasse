const addCircleBtn = document.getElementById("add-circle-btn");
const circleColorInput = document.getElementById("circle-color");
const circleColorLabel = document.getElementById("circle-color-label");

circleColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    circleColorLabel.style.backgroundColor = selectedColor;
});

// Returns the list of shapes used to make the circle
function createCircle({ color = "#000"}) {
    let rect = new Konva.Circle({
        x: 50,
        y: 50,
        radius: 50,
        fill: color
    });

    return [rect];
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
        },
    });
});

// EDITOR
const editorCircleColorInput = document.getElementById("editor-circle-color");
const editorCircleColorLabel = document.getElementById(
    "editor-circle-color-label"
);

editorCircleColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    editorCircleColorLabel.style.backgroundColor = selectedColor;
    updateCircle();
});

function updateCircle() {
    updateElement({
        type: "circle",
        id: transformer.nodes()[0].id(), // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer nodes
        config: {
            color: editorCircleColorInput.value,
        },
    });
}

function syncCircleEditor({ color = "#000"}) {
    editorCircleColorInput.value = color;
    editorCircleColorLabel.style.backgroundColor = color;
}
