const addTableBtn = document.getElementById("add-table-btn");
const tableColorInput = document.getElementById("table-color");
const tableColorLabel = document.getElementById("table-color-label");
const tableLabelInput = document.getElementById("table-label-input");

tableColorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    tableColorLabel.style.backgroundColor = selectedColor;
});

function addTable(
    id,
    x = 100,
    y = 100,
    rotation = 0,
    color = "#000",
    labelContent = ""
) {
    let group = new Konva.Group({
        x: x,
        y: y,
        draggable: true,
    });

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

    group.add(chair);
    group.add(plank);
    group.add(label);

    group.rotation(rotation);

    elementsLayer.add(group);

    transformerNoResize.nodes([...transformerNoResize.nodes(), group]);

    group.on("dragmove", (e) => {
        const node = e.target;
        const stage = node.getStage();
        const { width, height } = stage.size();
        const box = node.getClientRect(); // Group dimensions

        // Snap to grid
        let [newX, newY] = getNearestGridPoint(node.x(), node.y());

        // Check if outside of stage
        newX = Math.max(0, Math.min(width - box.width, newX));
        newY = Math.max(0, Math.min(height - box.height, newY));

        node.position({ x: newX, y: newY });

        const tableElement = projectData.elements.find(
            (element) => element.id === id
        );
        if (tableElement) {
            tableElement.x = newX;
            tableElement.y = newY;
        }
    });

    group.on("transformend", (e) => {
        const tableElement = projectData.elements.find(
            (element) => element.id === id
        );
        if (tableElement) {
            tableElement.rotation = e.target.rotation();
        }
    });

    group.on("click", () => {
        transformerNoResize.nodes([group]);

        elementsLayer.batchDraw();
    });

    elementsLayer.batchDraw();

    if (!projectData.elements.some((e) => e.id === id)) {
        projectData.elements.push({
            id: id,
            type: "table",
            x: x,
            y: y,
            rotation: 0,
            label: labelContent,
            color: color,
        });
    }

    elements.push(group);
}

addTableBtn.addEventListener("click", () => {
    addTable(
        generateId(),
        100,
        100,
        0,
        tableColorInput.value,
        tableLabelInput.value
    );
});
