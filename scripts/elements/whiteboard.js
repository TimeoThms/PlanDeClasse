const addWhiteboardBtn = document.getElementById("add-whiteboard-btn");
const whiteboardLabelInput = document.getElementById("whiteboard-label-input");

// Returns the list of shapes used to make the whiteboard
function createWhiteboard({ label = "" }) {
    let board = new Konva.Rect({
        x: 0,
        y: 0,
        width: 220,
        height: 10,
        fill: "#fff",
        cornerRadius: 100,
        stroke: "#1B263B",
        strokeWidth: 2,
    });

    let text = new Konva.Text({
        x: 0,
        y: 0,
        text: label,
        fontSize: 10,
        fontFamily: "Arial",
        fill: "#000",
        width: 220,
        height: 10,
        padding: 2,
        align: "center",
        verticalAlign: "middle",
    });

    return [board, text];
}

addWhiteboardBtn.addEventListener("click", () => {
    addElement({
        type: "whiteboard",
        id: generateId(),
        x: 100,
        y: 100,
        rotation: 0,
        config: {
            label: whiteboardLabelInput.value,
        },
    });
});

// EDITOR

const editorWhiteboardLabelInput = document.getElementById(
    "editor-whiteboard-label-input"
);

editorWhiteboardLabelInput.addEventListener("input", () => {
    updateWhiteboard();
});

function updateWhiteboard() {
    updateElement({
        type: "whiteboard",
        id: transformer.nodes()[0].id(), // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer nodes
        config: {
            label: editorWhiteboardLabelInput.value,
        },
    });
}

function syncWhiteboardEditor({ label = "" }) {
    editorWhiteboardLabelInput.value = label;
}
