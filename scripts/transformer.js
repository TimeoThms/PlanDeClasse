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
    shouldOverdrawWholeArea: true,
    ignoreStroke: true,
    flipEnabled: false,
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
        if (notResizeableTypes.includes(elementData.type)) {
            transformer.resizeEnabled(false);
        }
    });
}

transformer.on("dragmove", (e) => {
    const tr = e.target;
    const stage = tr.getStage();
    let { width, height } = stage.size();
    height += transformer.rotateAnchorOffset() + 5;

    const box = tr.getClientRect();

    let minX = Infinity,
        minY = Infinity;

    // Loop through all nodes to calculate the minimum X and Y values
    transformer.nodes().forEach((node) => {
        const nodeBox = node.getClientRect(); // Get the bounding box of each element without transformer
        minX = Math.min(minX, nodeBox.x);
        minY = Math.min(minY, nodeBox.y);
    });

    let newX = minX;
    let newY = minY;

    // Correct coords if selection is dragged out of the stage
    if (minX < 0) {
        newX = 0;
    }
    if (minY < 0) {
        newY = 0;
    }
    if (minX + box.width > width) {
        newX = width - box.width;
    }
    if (minY + box.height > height) {
        newY = height - box.height;
    }

    if (gridToggled) {
        // Snap to the grid
        [newX, newY] = getNearestGridPoint(newX, newY);
    }

    // Elements potions relatively to their position with the selection
    transformer.nodes().forEach((element) => {
        element.position({
            x: newX + (element.x() - minX),
            y: newY + (element.y() - minY),
        });
    });

    elementsLayer.batchDraw();
});

// Unselect all elements if layer is clicked (aka background rect and grid lines)
layer.on("click", () => {
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
});

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
        }

        // COPY PASTE

        if (e.ctrlKey && e.key === "c") {
            copySelection();
        }
        if (e.ctrlKey && e.key === "v") {
            pasteSelection();
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
    });

    displayEditor();

    layer.batchDraw();
}

elementsLayer.add(transformer);
