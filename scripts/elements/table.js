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
        draggable: false,
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

    group.on("transformend", (e) => {
        const tableElement = projectData.elements.find(
            (element) => element.id === id
        );
        if (tableElement) {
            tableElement.rotation = e.target.rotation();
            tableElement.x = e.target.x();
            tableElement.y = e.target.y();
        }
    });

    group.on("click", (e) => {
        let nodes = transformerNoResize.nodes();
        if (nodes.includes(group)) {
            if (!e.evt.ctrlKey) {
                // If click element without CTRL on multiple selection, select only it
                nodes.forEach((element) => {
                    element.draggable(false);
                });
                transformerNoResize.nodes([group]);
                group.draggable(true);
            } else {
                transformerNoResize.nodes(
                    nodes.filter((node) => node !== group)
                );
                group.draggable(false);
            }
        } else {
            if (e.evt.ctrlKey) {
                // If control key is pressed, add element to transformer nodes
                transformerNoResize.nodes([...nodes, group]);
            } else {
                // Else just set the nodes to the element
                nodes.forEach((element) => {
                    element.draggable(false);
                });
                transformerNoResize.nodes([group]);
            }
            group.draggable(true);
        }

        // transformerNoResize.nodes([group]);

        elementsLayer.batchDraw();
    });

    group.on("dragend", (e) => {
        const tableElement = projectData.elements.find(
            (element) => element.id === id
        );
        if (tableElement) {
            tableElement.x = e.target.x();
            tableElement.y = e.target.y();
        }

        elementsLayer.batchDraw();
    });

    elementsLayer.batchDraw();

    if (!projectData.elements.some((e) => e.id === id)) {
        // If not in project data yet, aka newly added element
        projectData.elements.push({
            id: id,
            type: "table",
            x: x,
            y: y,
            rotation: 0,
            label: labelContent,
            color: color,
        });

        transformerNoResize.nodes([group]);
        group.draggable(true);
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
