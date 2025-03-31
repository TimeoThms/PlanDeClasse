const addRectangleBtn = document.getElementById("add-rectangle-btn");
const rectangleColorInput = document.getElementById("rectangle-color");
const rectangleColorLabel = document.getElementById("rectangle-color-label");

rectangleColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    rectangleColorLabel.style.backgroundColor = selectedColor;
});

// Returns the list of shapes used to make the rectangle
function createRectangle({ color = "#000"}) {
    let rect = new Konva.Rect({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        fill: color
    });

    let text = new Konva.Text({
        x: 0,
        y: 0,
        text: "test",
        fontSize: 10,
        fontFamily: "Arial",
        fill: "#000",
        padding: 4,
        align: "center",
        verticalAlign: "middle",
    });

    return [rect, text  ];
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
        },
    });
});

// EDITOR
const editorRectangleColorInput = document.getElementById("editor-rectangle-color");
const editorRectangleColorLabel = document.getElementById(
    "editor-rectangle-color-label"
);

editorRectangleColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    editorRectangleColorLabel.style.backgroundColor = selectedColor;
    updateRectangle();
});

function updateRectangle() {
    updateElement({
        type: "rectangle",
        id: transformer.nodes()[0].id(), // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer nodes
        config: {
            color: editorRectangleColorInput.value,
        },
    });
}

function syncRectangleEditor({ color = "#000"}) {
    editorRectangleColorInput.value = color;
    editorRectangleColorLabel.style.backgroundColor = color;
}
