const addDoubletableBtn = document.getElementById("add-doubletable-btn");
const doubletableColorInput = document.getElementById("doubletable-color");
const doubletableColorLabel = document.getElementById(
    "doubletable-color-label"
);
const doubletableLabel1Input = document.getElementById(
    "doubletable-label1-input"
);
const doubletableLabel2Input = document.getElementById(
    "doubletable-label2-input"
);

doubletableColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    doubletableColorLabel.style.backgroundColor = selectedColor;
});

// Returns the list of shapes used to make the doubletable
function createDoubletable({ color = "#000", label1 = "", label2 = "" }) {
    let chair1 = new Konva.Rect({
        x: 12,
        y: 40,
        width: 41,
        height: 10,
        fill: color,
        cornerRadius: 100,
    });

    let chair2 = new Konva.Rect({
        x: 77,
        y: 40,
        width: 41,
        height: 10,
        fill: color,
        cornerRadius: 100,
    });

    const strokeWidth = 2;

    let plank = new Konva.Rect({
        x: 0,
        y: 0,
        width: 130 - strokeWidth,
        height: 45 - strokeWidth,
        fill: "#b6c4d6",
        cornerRadius: 4,
        stroke: color,
        strokeWidth: strokeWidth,
    });

    let text1 = new Konva.Text({
        x: 0,
        y: 0,
        text: label1,
        fontSize: 10,
        fontFamily: "Arial",
        fill: "#000",
        width: 65,
        height: 45,
        align: "center",
        verticalAlign: "middle",
    });

    let text2 = new Konva.Text({
        x: 65,
        y: 0,
        text: label2,
        fontSize: 10,
        fontFamily: "Arial",
        fill: "#000",
        width: 65,
        height: 45,
        align: "center",
        verticalAlign: "middle",
    });

    return [chair1, chair2, plank, text1, text2];
}

addDoubletableBtn.addEventListener("click", () => {
    addElement({
        type: "doubletable",
        id: generateId(),
        x: 100,
        y: 100,
        rotation: 0,
        config: {
            color: doubletableColorInput.value,
            label1: doubletableLabel1Input.value,
            label2: doubletableLabel2Input.value,
        },
    });
    pushStateSnapshot();
});

// EDITOR

const editorDoubletableColorInput = document.getElementById(
    "editor-doubletable-color"
);
const editorDoubletableColorLabel = document.getElementById(
    "editor-doubletable-color-label"
);
const editorDoubletableLabel1Input = document.getElementById(
    "editor-doubletable-label1-input"
);
const editorDoubletableLabel2Input = document.getElementById(
    "editor-doubletable-label2-input"
);

editorDoubletableColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    editorDoubletableColorLabel.style.backgroundColor = selectedColor;
    updateDoubletable();
});

editorDoubletableLabel1Input.addEventListener("input", () => {
    updateDoubletable();
});
editorDoubletableLabel2Input.addEventListener("input", () => {
    updateDoubletable();
});

function updateDoubletable() {
    const group = transformer.nodes()[0]; // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer nodes
    if (!group) return;
    updateElement({
        type: "doubletable",
        id: group.id(),
        config: {
            color: editorDoubletableColorInput.value,
            label1: editorDoubletableLabel1Input.value,
            label2: editorDoubletableLabel2Input.value,
        },
    });
}

function syncDoubletableEditor({ color = "#000", label1 = "", label2 = "" }) {
    editorDoubletableColorInput.value = color;
    editorDoubletableColorLabel.style.backgroundColor = color;
    editorDoubletableLabel1Input.value = label1;
    editorDoubletableLabel2Input.value = label2;
}
