const elementEditor = document.getElementById("element-editor");

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

    // Selection managment
    group.on("click", (e) => {
        let nodes = transformerNoResize.nodes();
        if (nodes.includes(group)) {
            if (!e.evt.ctrlKey) {
                nodes.forEach((el) => el.draggable(false));
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
                transformerNoResize.nodes([...nodes, group]);
            } else {
                nodes.forEach((el) => el.draggable(false));
                transformerNoResize.nodes([group]);
            }
            group.draggable(true);
        }
        elementsLayer.batchDraw();

        if (transformerNoResize.nodes().length == 1) {
            // elementEditor.innerHTML = getEditor(type, config);
            displayEditor(id);
            elementEditor.style.top = "8px";
        } else {
            elementEditor.style.top = "-100px";
        }
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
        }
    });

    // Refresh view
    elementsLayer.batchDraw();

    // Add element to project data if not already in
    if (!projectData.elements.some((e) => e.id === id)) {
        projectData.elements.push({ id, type, x, y, rotation, ...config });
        let nodes = transformerNoResize.nodes();
        nodes.forEach((el) => el.draggable(false));
        transformerNoResize.nodes([group]);
        group.draggable(true);
    }

    elements.push(group);

    // elementEditor.innerHTML = getEditor(type, config);
    displayEditor(id);
    elementEditor.style.top = "8px";
}

function createShape(type, config) {
    switch (type) {
        case "table":
            return createTable(config);
        case "doubletable":
            return createDoubleTable(config);
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
        default:
            console.warn("Unknown type:", type);
            return null;
    }
}

function displayEditor(id) {
    const element = projectData.elements.find((el) => el.id === id);

    // Hide all attributes
    document.querySelectorAll("#element-editor .attribute").forEach((attr) => {
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
