// TRANSFORMERS

// Init the transformer
const transformer = new Konva.Transformer({
    nodes: [],
    rotateEnabled: true,
    resizeEnabled: true,
    keepRatio: false,
    enabledAnchors: [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "middle-right",
        "middle-left",
        "top-center",
        "bottom-center",
    ],
    rotateAnchorOffset: 20,
    anchorCornerRadius: 100,
    rotationSnaps: Array.from({ length: 73 }, (_, i) => i * 5), // [0, 5, 10, 15, ..., 360]
    draggable: true,
    ignoreStroke: true,
    flipEnabled: false,
    shouldOverdrawWholeArea: true,
});

function updateTransformerResizeState() {
    transformer.resizeEnabled(true);
    transformer.enabledAnchors([
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "middle-right",
        "middle-left",
        "top-center",
        "bottom-center",
    ]);
    transformer.nodes().forEach((node) => {
        const elementData = projectData.elements.find(
            (el) => el.id === node.id()
        );
        if (elementData.type == "text") {
            transformer.enabledAnchors(["top-center", "bottom-center"]);
        }
        if (horizontalResizeableTypes.includes(elementData.type)) {
            transformer.enabledAnchors(["middle-right", "middle-left"]);
        }
        if (notResizeableTypes.includes(elementData.type)) {
            transformer.resizeEnabled(false);
        }
    });
    transformer.moveToTop();
}

function getSelectionBoundingBox(nodes) {
    let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

    nodes.forEach((node) => {
        const box = node.getClientRect({ skipTransform: false });
        minX = Math.min(minX, box.x);
        minY = Math.min(minY, box.y);
        maxX = Math.max(maxX, box.x + box.width);
        maxY = Math.max(maxY, box.y + box.height);
    });

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}

transformer.on("dragmove", (e) => {
    const tr = e.target;
    const stage = tr.getStage();
    let { width: stageW, height: stageH } = stage.size();
    // stageH += transformer.rotateAnchorOffset() + 5;

    const selectionBox = getSelectionBoundingBox(transformer.nodes());

    let newX = selectionBox.x;
    let newY = selectionBox.y;

    if (selectionBox.x < 0) newX = 0;
    if (selectionBox.y < 0) newY = 0;
    if (selectionBox.x + selectionBox.width > stageW)
        newX = stageW - selectionBox.width;
    if (selectionBox.y + selectionBox.height > stageH)
        newY = stageH - selectionBox.height;

    if (gridToggled) {
        const corners = [
            [newX, newY], // top left
            [newX + selectionBox.width, newY], // top right
            [newX, newY + selectionBox.height], // bottom left
            [newX + selectionBox.width, newY + selectionBox.height], // bottom right
        ];

        let bestSnap = null;
        let minDistance = Infinity;
        for (let i = 0; i < corners.length; i++) {
            const [x, y] = corners[i];
            const [snapX, snapY] = getNearestGridPoint(x, y);
            const distance = Math.sqrt((snapX - x) ** 2 + (snapY - y) ** 2);

            if (distance < minDistance) {
                minDistance = distance;
                bestSnap = { originX: x, originY: y, snapX, snapY };
            }
        }
        newX += bestSnap.snapX - bestSnap.originX;
        newY += bestSnap.snapY - bestSnap.originY;
    }

    // Door offset
    if (transformer.nodes().length == 1 && gridToggled && gridResolution > 5) {
        const element = transformer.nodes()[0];
        const elementData = projectData.elements.find(
            (el) => el.id === element.id()
        );

        if (elementData.type == "door") {
            const rot = element.rotation();

            if (Math.round(Math.abs(rot)) == 90) {
                newX -= 5;
            } else if (Math.round(Math.abs(rot)) % 180 == 0) {
                newY -= 5;
            }
        }
    }

    // Elements potions relatively to their position with the selection
    const deltaX = newX - selectionBox.x;
    const deltaY = newY - selectionBox.y;
    transformer.nodes().forEach((element) => {
        element.x(element.x() + deltaX);
        element.y(element.y() + deltaY);
    });

    elementsLayer.batchDraw();
});

transformer.on("dragend", (e) => {
    setTimeout(() => {
        pushStateSnapshot();
    }, 0);
});
transformer.on("transformend", (e) => {
    setTimeout(() => {
        pushStateSnapshot();
    }, 0);
});

// Unselect all elements if layer is clicked (aka background rect and grid lines)
layer.on("click", () => {
    if (!isCtrlPressed) {
        unselectAll();
    }
});

function unselectAll() {
    transformer.nodes().forEach((node) => {
        node.draggable(false);
        let elementData = projectData.elements.find(
            (el) => el.id === node.id()
        );
        if (elementData.type == "text" && elementData.label == "") {
            node.destroy();
            projectData.elements = projectData.elements.filter(
                (obj) => obj.id !== node.id()
            );
        }
    });
    transformer.nodes([]);
    elementsLayer.batchDraw();

    elementEditor.style.top = "-100px";

    sizeDisplay.style.transition = "top 0.2s ease-in-out";
    sizeDisplay.style.top = "-100px";
}

document.addEventListener("keydown", (e) => {
    const focusedElement = document.activeElement;
    // Bypass any behaviour if the user is typing in an input
    if (
        focusedElement.tagName != "INPUT" &&
        focusedElement.tagName != "TEXTAREA"
    ) {
        // Delete elements selected by the transformer
        if (e.key === "Delete" || e.key === "Backspace") {
            deleteSelection();
            return;
        }

        // COPY PASTE

        if (e.ctrlKey && e.key === "c") {
            copySelection();
            return;
        }
        if (e.ctrlKey && e.key === "v") {
            pasteSelection();
            return;
        }

        // Arrows to move transformer
        let step = gridToggled ? gridResolution : 1;
        let dx = 0;
        let dy = 0;
        let moved = false;
        switch (e.key) {
            case "ArrowUp":
                dy = -step;
                moved = true;
                break;
            case "ArrowDown":
                dy = step;
                moved = true;
                break;
            case "ArrowLeft":
                dx = -step;
                moved = true;
                break;
            case "ArrowRight":
                // Déplacer vers la droite
                dx = step;
                moved = true;
                break;
            default:
                return; // Ignorer les autres touches
        }
        if (moved && transformer.nodes().length > 0) {
            e.preventDefault();
            transformer.nodes().forEach((group) => {
                group.setPosition({ x: group.x() + dx, y: group.y() + dy });
            });
            transformer.fire("dragmove");
            transformer.nodes().forEach((group) => {
                group.fire("dragend");
            });
            transformer.fire("dragend");
            elementsLayer.batchDraw();
        }
    }
});

function deleteSelection() {
    const selectedNodes = transformer.nodes();
    selectedNodes.forEach((node) => {
        node.destroy();
        projectData.elements = projectData.elements.filter(
            (obj) => obj.id !== node.id()
        );
    });
    transformer.nodes([]);
    elementsLayer.batchDraw();
    elementEditor.style.top = "-100px";

    sizeDisplay.style.transition = "top 0.2s ease-in-out";
    sizeDisplay.style.top = "-100px";
    pushStateSnapshot();
}

let clipboard = [];
let clipboardCoords = { x: 0, y: 0 };

function copySelection() {
    clipboard = [];
    transformer.nodes().forEach((node) => {
        clipboard.push(projectData.elements.find((el) => el.id === node.id()));
    });

    // Find selection coordinates
    let minX = Infinity,
        minY = Infinity;
    transformer.nodes().forEach((node) => {
        minX = Math.min(minX, node.x());
        minY = Math.min(minY, node.y());
    });

    clipboardCoords = { x: minX, y: minY };
}

function pasteSelection() {
    let nodes = transformer.nodes();
    nodes.forEach((el) => el.draggable(false));
    transformer.nodes([]);

    let pastedElements = [];

    clipboard.forEach((element) => {
        let { type, id, x, y, rotation, ...config } = element;
        const newId = generateId();
        x = x + 20;
        y = y + 20;
        addElement({ type, id: newId, x, y, rotation, config });
        pastedElements.push(elements.find((el) => el.id() === newId));
    });

    pastedElements.forEach((element) => {
        if (!transformer.nodes().includes(element)) {
            transformer.nodes([...transformer.nodes(), element]);
        }
        element.draggable(true);
    });

    displayEditor();

    layer.batchDraw();

    pushStateSnapshot();
}

transformer.on("transform", (e) => {
    transformer.nodes().forEach((node) => {});
});

transformer.on("click", (e) => {
    const pointer = stage.getPointerPosition();
    const hits = stage.getAllIntersections(pointer);

    let found_parents = [];

    const elementIds = elements.map((el) => el.id());

    hits.forEach((shape) => {
        const parent = shape.getParent();
        if (
            parent &&
            typeof parent.id === "function" &&
            elementIds.includes(parent.id())
        ) {
            if (!found_parents.includes(parent)) {
                parent.fire("click", { evt: e.evt }, true);
            }
            found_parents.push(parent);
            clicked_something = true;
        }
    });
});

transformer.on("transform", () => {
    syncSizeDisplay();
});

elementsLayer.add(transformer);
