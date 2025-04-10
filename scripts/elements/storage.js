const addStorageBtn = document.getElementById("add-storage-btn");
const storageLabelInput = document.getElementById("storage-label-input");

// Returns the list of shapes used to make the storage
function createStorage({ label = "", width = 100, height = 100 }) {
    let rect = new Konva.Rect({
        x: 0,
        y: 0,
        width: width,
        height: height,
        fill: "#64a8c4",
        cornerRadius: 4,
    });

    const imageObj = new Image();
    imageObj.src =
        "ressources/images/storage_icon.png";
    let freeSpace = Math.min(width, height);
    const icon = new Konva.Image({
        x: freeSpace * 0.2,
        y: freeSpace * 0.2,
        image: imageObj,
        width: freeSpace * 0.6,
        height: freeSpace * 0.6,
    });

    let text = new Konva.Text({
        x: 0,
        y: 0,
        width: width,
        height: height,
        text: label,
        fontSize: 10,
        fontFamily: "Arial",
        fill: "#000",
        align: "center",
        verticalAlign: "middle",
    });

    return [rect, icon, text];
}

addStorageBtn.addEventListener("click", () => {
    addElement({
        type: "storage",
        id: generateId(),
        x: 100,
        y: 100,
        rotation: 0,
        config: {
            label: storageLabelInput.value,
            width: 120,
            height: 50,
        },
    });
});

// EDITOR
const editorStorageLabelInput = document.getElementById(
    "editor-storage-label-input"
);

editorStorageLabelInput.addEventListener("input", () => {
    updateStorage();
});

function updateStorage() {
    const group = transformer.nodes()[0]; // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer
    const box = group.getClientRect({ skipTransform: true });
    updateElement({
        type: "storage",
        id: group.id(),
        config: {
            label: editorStorageLabelInput.value,
            width: box.width,
            height: box.height,
        },
    });
}

function syncStorageEditor({ label = "" }) {
    editorStorageLabelInput.value = label;
}
