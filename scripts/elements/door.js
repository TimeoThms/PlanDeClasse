const normalDoorInput = document.getElementById('normal-door');
const safetyDoorInput = document.getElementById('safety-door');

const addDoorBtn = document.getElementById("add-door-btn");
const doorLabelInput = document.getElementById("door-label-input");

// Returns the list of shapes used to make the door
function createDoor({ doortype = "normal", label = "" }) {
    let color;
    if (doortype == "normal") {
        color = "#1B263B";
    } else if (doortype == "safety") {
        color = "#29912e";
    }
    
    let door = new Konva.Rect({
        x: 0,
        y: 0,
        width: 100,
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
        width: 100,
        height: 10,
        padding: 2,
        align: "center",
        verticalAlign: "middle",
    });

    return [door, text];
}

addDoorBtn.addEventListener("click", () => {
    let doortype;
    if (normalDoorInput.checked) {
        doortype = "normal";
    } else if (safetyDoorInput.checked) {
        doortype = "safety";
    }
    addElement({
        type: "door",
        id: generateId(),
        x: 100,
        y: 100,
        rotation: 0,
        config: {
            doortype: doortype,
            label: doorLabelInput.value,
        },
    });
});

// EDITOR


const editorDoorLabelInput = document.getElementById(
    "editor-door-label-input"
);

const editorNormalDoorInput = document.getElementById('editor-normal-door');
const editorSafetyDoorInput = document.getElementById('editor-safety-door');

editorNormalDoorInput.addEventListener("change", (event) => {
    updateDoor();
})

editorSafetyDoorInput.addEventListener("change", (event) => {
    updateDoor();
})

editorDoorLabelInput.addEventListener("input", () => {
    updateDoor();
});

function updateDoor() {
    let doortype;
    if (editorNormalDoorInput.checked) {
        doortype = "normal";
    } else if (editorSafetyDoorInput.checked) {
        doortype = "safety";
    }
    updateElement({
        type: "door",
        id: transformer.nodes()[0].id(), // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer nodes
        config: {
            doortype: doortype,
            label: editorDoorLabelInput.value,
        },
    });
}

function syncDoorEditor({ doortype = "normal", label = "" }) {
    if (doortype == "normal") {
        editorNormalDoorInput.checked = true;
        editorSafetyDoorInput.checked = false;
    } else if (doortype == "safety") {
        editorNormalDoorInput.checked = false;
        editorSafetyDoorInput.checked = true;
    }
    editorDoorLabelInput.value = label;
}
