const addWhiteboardBtn = document.getElementById("add-whiteboard-btn");
const whiteboardLabelInput = document.getElementById("whiteboard-label-input");

// Returns the list of shapes used to make the whiteboard
function createWhiteboard({ label = "", width = 100 }) {
    let board = new Konva.Rect({
        x: 0,
        y: 0,
        width: width,
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
        width: width,
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
            width: 220,
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
    const group = transformer.nodes()[0]; // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer
    const box = group.getClientRect({
        skipTransform: true,
        skipStroke: true,
    });
    console.log(box.width);
    updateElement({
        type: "whiteboard",
        id: group.id(), // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer nodes
        config: {
            label: editorWhiteboardLabelInput.value,
            width: box.width,
        },
    });
}

function syncWhiteboardEditor({ label = "" }) {
    editorWhiteboardLabelInput.value = label;
}
