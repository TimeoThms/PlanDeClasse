const addTableBtn = document.getElementById("add-table-btn");
const tableColorInput = document.getElementById("table-color");
const tableColorLabel = document.getElementById("table-color-label");
const tableLabelInput = document.getElementById("table-label-input");

tableColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    tableColorLabel.style.backgroundColor = selectedColor;
});

// Returns the list of shapes used to make the table
function createTable({ color = "#000", label = "" }) {
    let chair = new Konva.Rect({
        x: 12,
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
        width: 65 - strokeWidth,
        height: 45 - strokeWidth,
        fill: "#b6c4d6",
        cornerRadius: 4,
        stroke: color,
        strokeWidth: strokeWidth,
    });

    let text = new Konva.Text({
        x: 0,
        y: 0,
        text: label,
        fontSize: 10,
        fontFamily: "Arial",
        fill: "#000",
        width: 65,
        height: 45,
        align: "center",
        verticalAlign: "middle",
    });

    return [chair, plank, text];
}

addTableBtn.addEventListener("click", () => {
    addElement({
        type: "table",
        id: generateId(),
        x: 100,
        y: 100,
        rotation: 0,
        config: {
            color: tableColorInput.value,
            label: tableLabelInput.value,
        },
    });
    pushStateSnapshot();
});

// EDITOR

const editorTableColorInput = document.getElementById("editor-table-color");
const editorTableColorLabel = document.getElementById(
    "editor-table-color-label"
);
const editorTableLabelInput = document.getElementById(
    "editor-table-label-input"
);

editorTableColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    editorTableColorLabel.style.backgroundColor = selectedColor;
    updateTable();
});

editorTableLabelInput.addEventListener("input", () => {
    updateTable();
});

function updateTable() {
    const group = transformer.nodes()[0]; // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer nodes
    if (!group) return;
    updateElement({
        type: "table",
        id: group.id(),
        config: {
            color: editorTableColorInput.value,
            label: editorTableLabelInput.value,
        },
    });
}

function syncTableEditor({ color = "#000", label = "" }) {
    editorTableColorInput.value = color;
    editorTableColorLabel.style.backgroundColor = color;
    editorTableLabelInput.value = label;
}
