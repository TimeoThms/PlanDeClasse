const elementEditor = document.getElementById("element-editor");

const notResizeableTypes = [
    "table",
    "doubletable",
    "door",
    "desk",
    "whiteboard",
];

function addElement({ type, id, x = 100, y = 100, rotation = 0, config = {} }) {
    let group = new Konva.Group({
        id: id,
        x: x,
        y: y,
        rotation: rotation,
        draggable: false,
    });

    // Get the list of shapes to add in the group
    let element = createShape(type, config);

    // Handle if element is a single shape or multiple shapes
    if (Array.isArray(element)) {
        element.forEach((shape) => group.add(shape));
    } else {
        group.add(element);
    }

    elementsLayer.add(group);

    const size = getSize(group);
    group.width(size.w);
    group.height(size.h);

    // Selection managment
    group.on("click", (e) => {
        let nodes = transformer.nodes();
        if (nodes.includes(group)) {
            if (!e.evt.ctrlKey) {
                // If simple click on the element and element is already selected, select only this element
                nodes.forEach((el) => el.draggable(false));
                transformer.nodes([group]);
                group.draggable(true);
            } else {
                // If ctrl+click on a selected element, unselect it
                transformer.nodes(nodes.filter((node) => node !== group));
                group.draggable(false);
            }
        } else {
            if (e.evt.ctrlKey) {
                // If ctrl+click on new element, append it to the transformer nodes
                transformer.nodes([...nodes, group]);
            } else {
                // Else, select only the element
                nodes.forEach((el) => el.draggable(false));
                transformer.nodes([group]);
            }

            group.draggable(true);
        }

        updateTransformerResizeState();
        displayEditor();

        elementsLayer.batchDraw();
    });

    // Save coordinates after the element is dragged
    group.on("dragend", (e) => {
        const elementData = projectData.elements.find((el) => el.id === id);
        if (elementData) {
            elementData.x = e.target.x();
            elementData.y = e.target.y();
        }
        elementsLayer.batchDraw();
    });

    // Save after transformation (rotation)
    group.on("transformend", (e) => {
        const elementData = projectData.elements.find((el) => el.id === id);
        if (elementData) {
            elementData.rotation = e.target.rotation();
            elementData.x = e.target.x();
            elementData.y = e.target.y();

            if (!notResizeableTypes.includes(elementData.type)) {
                const size = getSize(group);

                elementData.width = size.w;
                elementData.height = size.h;
                group.width(size.w);
                group.height(size.h);
            }
        }
    });

    group.on("transform", (e) => {
        const id = transformer.nodes()[0].id();
        const element = projectData.elements.find((el) => el.id === id);

        if (element.type == "text" && transformer.getActiveAnchor() != "rotater") {
            textShape = group.getChildren()[0];
            let scale = Math.floor(group.scaleY()*1000000000)/1000000000;
            let width = Math.floor(textShape.width()*1000000000)/1000000000;
            let height = Math.floor(textShape.height()*1000000000)/1000000000;
            console.log(scale);
            textShape.fontSize(height * scale);
            textShape.width((width - 20) * scale + 20);
            textShape.height(height * scale);
        } else {
            group.getChildren().forEach((shape) => {
            shape.x(shape.x() * group.scaleX());
            shape.y(shape.y() * group.scaleY());
            shape.width(shape.width() * group.scaleX());
            shape.height(shape.height() * group.scaleY());
        });
        group.scaleX(1);
        group.scaleY(1);
    }

       
    });

    // Refresh view
    elementsLayer.batchDraw();

    // Add element to project data if not already in
    if (!projectData.elements.some((e) => e.id === id)) {
        projectData.elements.push({
            type,
            id,
            x,
            y,
            rotation,
            ...config,
        });
        let nodes = transformer.nodes();
        nodes.forEach((el) => el.draggable(false));
        transformer.nodes([group]);
        group.draggable(true);
    }

    elements.push(group);

    updateTransformerResizeState();

    displayEditor(id);
    elementEditor.style.top = "8px";
}

function getSize(group) {
    // Calculate height and width of the group
    let minX = Infinity,
        minY = Infinity;
    let maxX = -Infinity,
        maxY = -Infinity;

    group.getChildren().forEach((child) => {
        const box = child.getClientRect(); // Boîte englobante de l'enfant
        minX = Math.min(minX, box.x);
        minY = Math.min(minY, box.y);
        maxX = Math.max(maxX, box.x + box.width);
        maxY = Math.max(maxY, box.y + box.height);
    });

    const w = maxX - minX;
    const h = maxY - minY;

    return { w, h };
}

function createShape(type, config) {
    switch (type) {
        case "table":
            return createTable(config);
        case "doubletable":
            return createDoubletable(config);
        case "door":
            return createDoor(config);
        case "desk":
            return createDesk(config);
        case "whiteboard":
            return createWhiteboard(config);
        case "rectangle":
            return createRectangle(config);
        case "circle":
            return createCircle(config);
        case "text":
            return createText(config);
        default:
            console.warn("Unknown type:", type);
            return null;
    }
}

// Function used to fill the content of the editor inputs with the values of the selected element
function syncEditorValues(type, config) {
    switch (type) {
        case "table":
            return syncTableEditor(config);
        case "doubletable":
            return syncDoubletableEditor(config);
        case "door":
            return syncDoorEditor(config);
        case "desk":
            return syncDeskEditor(config);
        case "whiteboard":
            return syncWhiteboardEditor(config);
        case "rectangle":
            return syncRectangleEditor(config);
        case "circle":
            return syncCircleEditor(config);
        case "text":
            return syncTextEditor(config)
        default:
            console.warn("Unknown type:", type);
            return null;
    }
}

function displayEditor() {
    if (transformer.nodes().length == 1) {
        const id = transformer.nodes()[0].id();
        const element = projectData.elements.find((el) => el.id === id);

        // Hide all attributes
        document
            .querySelectorAll("#element-editor .attribute")
            .forEach((attr) => {
                attr.hidden = true;
            });

        // Show attributes related to the type
        document
            .querySelectorAll(`#element-editor .${element.type}-attribute`)
            .forEach((attr) => {
                attr.hidden = false;
            });

        const config = Object.fromEntries(
            // Convert to key-value arrays and filter it to only keep type-related config
            Object.entries(element).filter(
                ([key]) => !["type", "id", "x", "y", "rotation"].includes(key)
            )
        );

        syncEditorValues(element.type, config);

        elementEditor.style.top = "8px";
    } else {
        elementEditor.style.top = "-100px";
    }
}

function updateElement({ type, id, config = {} }) {
    // Get element in elements list
    const element = elements.find((el) => el.id() === id);

    // Get the new shapes
    element.destroyChildren();
    let shapes = createShape(type, config);

    // Update the group
    if (Array.isArray(shapes)) {
        shapes.forEach((shape) => element.add(shape));
    } else {
        element.add(shapes);
    }

    elementsLayer.batchDraw();

    // Merge old element data with updated data
    let elementData = projectData.elements.find((el) => el.id === id);
    Object.assign(elementData, config);
}
