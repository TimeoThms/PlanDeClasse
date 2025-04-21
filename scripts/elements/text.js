const addTextBtn = document.getElementById("add-text-btn");
const textColorInput = document.getElementById("text-color");
const textColorLabel = document.getElementById("text-color-label");
const textLabelInput = document.getElementById("text-label-input");

textColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    textColorLabel.style.backgroundColor = selectedColor;
});

// Returns the list of shapes used to make the text
function createText({ color = "#000", label = "", fontSize = 16 }) {
    let text = new Konva.Text({
        x: 0,
        y: 0,
        text: label,
        fontSize: fontSize,
        fontFamily: "Arial",
        fill: color,
        verticalAlign: "middle",
    });

    text.width(text.width() + 20);

    return [text];
}

addTextBtn.addEventListener("click", () => {
    addElement({
        type: "text",
        id: generateId(),
        x: 100,
        y: 100,
        rotation: 0,
        config: {
            color: textColorInput.value,
            label: textLabelInput.value.replace(/%/g, "\n"),
            fontSize: 64,
        },
    });
    pushStateSnapshot();
});

// EDITOR
const editorTextColorInput = document.getElementById("editor-text-color");
const editorTextColorLabel = document.getElementById("editor-text-color-label");
const editorTextLabelInput = document.getElementById("editor-text-label-input");

editorTextColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    editorTextColorLabel.style.backgroundColor = selectedColor;
    updateText();
});

editorTextLabelInput.addEventListener("input", () => {
    updateText();
});

function updateText() {
    const group = transformer.nodes()[0]; // Considering that since editor is displayed only when one element is selected, it is necessary the first one of the transformer
    if (!group) return;
    const box = group.getClientRect({ skipTransform: true });
    const lines = group.getChildren()[0].text().split("\n").length;
    updateElement({
        type: "text",
        id: group.id(),
        config: {
            color: editorTextColorInput.value,
            label: editorTextLabelInput.value.replace(/%/g, "\n"),
            fontSize: group.getChildren()[0].fontSize(),
        },
    });
}

function syncTextEditor({ color = "#000", label = "" }) {
    editorTextColorInput.value = color;
    editorTextColorLabel.style.backgroundColor = color;
    editorTextLabelInput.value = label.replace(/\n/g, "%");
}
