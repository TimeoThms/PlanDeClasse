const addTableBtn = document.getElementById("add-table-btn");
const tableColorInput = document.getElementById("table-color");
const tableColorLabel = document.getElementById("table-color-label");
const tableLabelInput = document.getElementById("table-label-input");

tableColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    tableColorLabel.style.backgroundColor = selectedColor;
});

// Returns the list of shapes used to make the table
function createTable({ color = "#000", labelContent = "" }) {
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

    let label = new Konva.Text({
        x: 0,
        y: 0,
        text: labelContent,
        fontSize: 10,
        fontFamily: "Arial",
        fill: "#000",
        width: 65,
        height: 45,
        padding: 4,
        align: "center",
        verticalAlign: "middle",
    });

    return [chair, plank, label];
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
            labelContent: tableLabelInput.value,
        },
    });
});

function getTableEditor({ color = "#000", labelContent = "" }) {
    return `
    <div class="attribute">
        <h4>Couleur</h4>
        <input type="color" name="" id="table-color" value="${color}" hidden>
        <label for="table-color" class="color-label" id="table-color-label" style="background-color: ${color}"></label>
    </div>
    <div class="attribute">
        <h4>Texte</h4>
        <input type="text" name="" id="table-label-input" class="label-input" placeholder="Aucun" value="${labelContent}">
    </div>
    `
}