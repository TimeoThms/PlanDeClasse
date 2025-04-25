const doorColorInput = document.getElementById("door-color");
const doorColorLabel = document.getElementById("door-color-label");

const addDoorBtn = document.getElementById("add-door-btn");
const doorLabelInput = document.getElementById("door-label-input");

doorColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    doorColorLabel.style.backgroundColor = selectedColor;
});

// Returns the list of shapes used to make the door
function createDoor({ color = "#415A77", label = "", width = 100 }) {
    let door = new Konva.Rect({
        x: 0,
        y: 0,
        width: width,
        height: 10,
        fill: color,
        cornerRadius: 100,
    });

    let text = new Konva.Text({
        x: 0,
        y: 0,
        text: label,
        fontSize: 10,
        fontFamily: "Arial",
        fill: "#fff",
        width: width,
        height: 10,
        padding: 2,
        align: "center",
        verticalAlign: "middle",
    });

    return [door, text];
}

addDoorBtn.addEventListener("click", () => {
    addElement({
        type: "door",
        id: generateId(),
        rotation: 0,
        config: {
            color: doorColorInput.value,
            label: doorLabelInput.value.replace(/%/g, "\n"),
            width: 100,
        },
    });

    pushStateSnapshot();
});

// EDITOR

const editorDoorLabelInput = document.getElementById("editor-door-label-input");

const editorDoorColorInput = document.getElementById("editor-door-color");
const editorDoorColorLabel = document.getElementById("editor-door-color-label");

editorDoorLabelInput.addEventListener("input", () => {
    updateDoor();
});

editorDoorColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    editorDoorColorLabel.style.backgroundColor = selectedColor;
    updateDoor();
});

function updateDoor() {
    const group = transformer.nodes()[0]; // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer
    if (!group) return;
    const box = group.getClientRect({ skipTransform: true });

    updateElement({
        type: "door",
        id: group.id(),
        config: {
            color: editorDoorColorInput.value,
            label: editorDoorLabelInput.value.replace(/%/g, "\n"),
            width: box.width,
        },
    });
}

function syncDoorEditor({ color = "#415A77", label = "" }) {
    editorDoorColorInput.value = color;
    editorDoorColorLabel.style.backgroundColor = color;
    editorDoorLabelInput.value = label.replace(/\n/g, "%");
}
