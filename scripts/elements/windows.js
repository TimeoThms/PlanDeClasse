const addWindowsBtn = document.getElementById("add-windows-btn");
const windowsLabelInput = document.getElementById("windows-label-input");

// Returns the list of shapes used to make the windows
function createWindows({ label = "", width = 120 }) {
    let windows = new Konva.Rect({
        x: 0,
        y: 0,
        width: width,
        height: 6,
        fill: "#bbdee5",
        cornerRadius: 100,
    });

    let text = new Konva.Text({
        x: 0,
        y: 0,
        text: label,
        fontSize: 6,
        fontFamily: "Arial",
        fill: "black",
        width: width,
        height: 6,
        padding: 0,
        align: "center",
        verticalAlign: "middle",
    });

    return [windows, text];
}

addWindowsBtn.addEventListener("click", () => {
    addElement({
        type: "windows",
        id: generateId(),
        rotation: 0,
        config: {
            label: windowsLabelInput.value.replace(/%/g, "\n"),
            width: 120,
        },
    });
    pushStateSnapshot();
});

// EDITOR

const editorWindowsLabelInput = document.getElementById(
    "editor-windows-label-input"
);

editorWindowsLabelInput.addEventListener("input", () => {
    updateWindows();
});

function updateWindows() {
    const group = transformer.nodes()[0]; // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer
    if (!group) return;
    const box = group.getClientRect({ skipTransform: true });
    updateElement({
        type: "windows",
        id: group.id(),
        config: {
            label: editorWindowsLabelInput.value.replace(/%/g, "\n"),
            width: box.width,
        },
    });
}

function syncWindowsEditor({ label = "" }) {
    editorWindowsLabelInput.value = label.replace(/\n/g, "%");
}
