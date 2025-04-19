const addDeskBtn = document.getElementById("add-desk-btn");
const deskLabelInput = document.getElementById("desk-label-input");

// Returns the list of shapes used to make the desk
function createDesk({ label = "" }) {
    let chair = new Konva.Rect({
        x: 45,
        y: 0,
        width: 40,
        height: 10,
        fill: "#5e3b24",
        cornerRadius: 100,
    });

    const strokeWidth = 2;

    let plank = new Konva.Rect({
        x: 0,
        y: 5,
        width: 130 - strokeWidth,
        height: 70 - strokeWidth,
        fill: "#b6c4d6",
        cornerRadius: 4,
        stroke: "#5e3b24",
        strokeWidth: strokeWidth,
    });

    let text = new Konva.Text({
        x: 0,
        y: 5,
        text: label,
        fontSize: 10,
        fontFamily: "Arial",
        fill: "#000",
        width: 130,
        height: 70,
        padding: 4,
        align: "center",
        verticalAlign: "middle",
    });

    return [chair, plank, text];
}

addDeskBtn.addEventListener("click", () => {
    addElement({
        type: "desk",
        id: generateId(),
        x: 100,
        y: 100,
        rotation: 0,
        config: {
            label: deskLabelInput.value.replace(/%/g, "\n"),
        },
    });
    pushStateSnapshot();
});

// EDITOR

const editorDeskLabelInput = document.getElementById("editor-desk-label-input");

editorDeskLabelInput.addEventListener("input", () => {
    updateDesk();
});

function updateDesk() {
    const group = transformer.nodes()[0]; // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer nodes
    if (!group) return;
    updateElement({
        type: "desk",
        id: group.id(),
        config: {
            label: editorDeskLabelInput.value.replace(/%/g, "\n"),
        },
    });
}

function syncDeskEditor({ label = "" }) {
    editorDeskLabelInput.value = label.replace(/\n/g, "%");
}
