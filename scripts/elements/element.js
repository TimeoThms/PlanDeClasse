const elementEditor = document.getElementById("element-editor");
const sizeDisplay = document.getElementById("size-display");

const notResizeableTypes = [
    "table",
    "doubletable",
    // "door",
    "desk",
    // "whiteboard",
];

const horizontalResizeableTypes = ["door", "whiteboard"];

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
        // Handle placement mode
        if (!isArrangementMode) {
            if (!selectedStudent) return;
            const elementData = projectData.elements.find((el) => el.id === id);
            const selectedStudentData = getStudentData(selectedStudent);
            let labelStr = "";
            // Only set the label if the click is a leftclick. Therefore right click of middle click will delete the current label.
            if (e.evt.button === 0) {
                labelStr = `${selectedStudentData.lastName} ${selectedStudentData.firstName}`;
            }
            if (type == "table") {
                updateElement({
                    type: "table",
                    id: id,
                    config: {
                        color: elementData.color,
                        label: labelStr,
                    },
                });
            }
            if (type == "doubletable") {
                const pointerPosition = stage.getPointerPosition();
                const isLeftSide = pointerPosition.x - 65 < group.x();
                let label1, label2;
                if (isLeftSide) {
                    label1 = labelStr;
                    label2 = elementData.label2;
                } else {
                    label1 = elementData.label1;
                    label2 = labelStr;
                }
                updateElement({
                    type: "doubletable",
                    id: id,
                    config: {
                        color: elementData.color,
                        label1: label1,
                        label2: label2,
                    },
                });
            }
            pushStateSnapshot();
        } else {
            // Handle arrangement mode
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
                    if (!isZPressed) {
                        transformer.nodes()[0].moveToTop();
                        transformer.moveToTop();
                    }
                }

                group.draggable(true);
            }

            updateTransformerResizeState();
            displayEditor();

            elementsLayer.batchDraw();
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
            const rotation = group.rotation();
            group.rotation(0);
            const box = group.getClientRect();
            elementData.rotation = rotation;
            elementData.x = box.x;
            elementData.y = box.y;

            if (!notResizeableTypes.includes(elementData.type)) {
                if (!horizontalResizeableTypes.includes(elementData.type)) {
                    elementData.height = box.height;
                    group.height(box.height);
                }
                elementData.width = box.width;
                group.width(box.width);
            }
            group.rotation(rotation);
        }
    });

    group.on("transform", (e) => {
        const id = transformer.nodes()[0].id();
        const element = projectData.elements.find((el) => el.id === id);

        if (transformer.getActiveAnchor() == "rotater") {
            return;
        }
        const rotation = group.rotation();
        group.rotation(0); // Set the rotation to 0 to prevent errors with the width and height being modified indirectly by the rotation

        if (element.type == "text") {
            const textShape = group.getChildren()[0];
            const anchor = transformer.getActiveAnchor();

            const oldBox = group.getClientRect({ skipTransform: false });

            const scale = group.scaleY();
            const width = textShape.width();
            const height = textShape.height();
            const newHeight = height * scale;

            textShape.fontSize(newHeight);
            textShape.width((width - 20) * scale + 20);
            textShape.height(newHeight);

            group.scaleX(1);
            group.scaleY(1);

            // If resized from the top anchor, adapt element's Y coordinate
            if (anchor === "top-center") {
                const newBox = group.getClientRect({ skipTransform: false });

                const oldBottom = oldBox.y + oldBox.height;
                const newBottom = newBox.y + newBox.height;

                const deltaY = oldBottom - newBottom;

                group.y(group.y() + deltaY);
            }
        } else {
            group.getChildren().forEach((shape) => {
                if (shape instanceof Konva.Image) {
                    const box = group.getClientRect();
                    let freeSpace = Math.min(box.width, box.height);
                    shape.setAttrs({
                        x: freeSpace * 0.2,
                        y: freeSpace * 0.2,
                        width: freeSpace * 0.6,
                        height: freeSpace * 0.6,
                    });
                } else {
                    shape.x(shape.x() * group.scaleX());
                    shape.y(shape.y() * group.scaleY());
                    shape.width(shape.width() * group.scaleX());
                    shape.height(shape.height() * group.scaleY());
                }
            });
            group.scaleX(1);
            group.scaleY(1);
        }
        group.rotation(rotation); // Set rotation back to normal
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
        case "storage":
            return createStorage(config);
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
            return syncTextEditor(config);
        case "storage":
            return syncStorageEditor(config);
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

        if (!notResizeableTypes.includes(element.type)) {
            if (elementEditor.style.top == "8px") {
                sizeDisplay.style.transition = "none";
            } else {
                sizeDisplay.style.transition = "top 0.2s ease-in-out";
            }
            sizeDisplay.style.top = "96px";
            syncSizeDisplay();
        } else {
            if (elementEditor.style.top == "8px") {
                sizeDisplay.style.transition = "none";
            } else {
                sizeDisplay.style.transition = "top 0.2s ease-in-out";
            }
            sizeDisplay.style.top = "-100px";
        }
        elementEditor.style.top = "8px";
    } else {
        elementEditor.style.top = "-100px";
        if (elementEditor.style.top == "8px") {
            sizeDisplay.style.transition = "none";
        } else {
            sizeDisplay.style.transition = "top 0.2s ease-in-out";
        }
        sizeDisplay.style.top = "-100px";
    }
}

function syncSizeDisplay() {
    const node = transformer.nodes()[0];
    const elementData = projectData.elements.find((el) => el.id === node.id());
    const box = node.getClientRect({ skipTransform: true });
    if (horizontalResizeableTypes.includes(elementData.type)) {
        sizeDisplay.innerText = `Taille : ${Math.round(box.width)} cm`;
    } else {
        sizeDisplay.innerText = `Taille : ${Math.round(
            box.width
        )} x ${Math.round(box.height)} cm`;
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

let isZPressed = false;
document.addEventListener("keydown", (e) => {
    if (e.key === "z" || e.key === "Z") {
        isZPressed = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "z" || e.key === "Z") {
        isZPressed = false;
    }
});
