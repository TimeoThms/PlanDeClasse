const dataHistory = {
    snapshots: [structuredClone(projectData)],
    currentIndex: 0,
};

document.addEventListener("keydown", function (event) {
    // Prevents undoing/redoing while inputing text somewhere
    if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

    if (event.ctrlKey) {
        if (event.key === "z" || event.key === "Z") {
            event.preventDefault();
            undo();
        } else if (event.key === "y" || event.key === "Y") {
            event.preventDefault();
            redo();
        }
    }
});

function pushStateSnapshot() {
    const snapshot = structuredClone(projectData);

    // Prevents pushing a snapshot twice (should never happen but just in case)
    const currentSnapshot = dataHistory.snapshots[dataHistory.currentIndex];
    const hasChanged =
        JSON.stringify(currentSnapshot) !== JSON.stringify(snapshot);

    if (!hasChanged) return;

    dataHistory.snapshots = dataHistory.snapshots.slice(
        0,
        dataHistory.currentIndex + 1
    );
    console.log("Saved");
    dataHistory.snapshots.push(snapshot);
    dataHistory.currentIndex++;
}

function undo() {
    if (dataHistory.currentIndex > 0) {
        dataHistory.currentIndex--;
        applySnapshot(dataHistory.snapshots[dataHistory.currentIndex]);
    }
}

function redo() {
    if (dataHistory.currentIndex < dataHistory.snapshots.length - 1) {
        dataHistory.currentIndex++;
        applySnapshot(dataHistory.snapshots[dataHistory.currentIndex]);
    }
}

function applySnapshot(snapshot) {
    if (snapshot === projectData) return;

    projectData = structuredClone(snapshot);

    // Creates an array with the ids of selected elements
    const selectedElements = transformer.nodes().map((e) => e.id());

    elements.forEach((e) => {
        if (e && e.destroy) {
            e.destroy();
        }
    });

    elements = [];

    elementsLayer.batchDraw();

    // Clear transformer nodes of all previous elements
    transformer.nodes([]);

    // Fill size inputs with their values
    filenameInput.value = snapshot.filename;
    widthInput.value = snapshot.width / 100; // Values in meters, 1px = 1cm
    heightInput.value = snapshot.height / 100;

    // Match size to the size of the loaded project
    stage.width(snapshot.width);
    canvas.width(snapshot.width);
    stage.height(snapshot.height);
    canvas.height(snapshot.height);

    loadWalls(snapshot.walls, isDrawingWalls);

    // Load elements
    snapshot.elements.forEach((e) => {
        // Get attributes of the element. ...config corresponds to the remaining arguments (aka type-related args)
        const { type, id, x, y, rotation, ...config } = e;
        addElement({ type, id, x, y, rotation, config });
    });

    elements.forEach((node) => {
        if (selectedElements.includes(node.id())) {
            transformer.nodes([...transformer.nodes(), node]);
        }
    });

    updateTransformerResizeState();

    updateGrid();
    displayEditor();

    layer.batchDraw();
    elementsLayer.batchDraw();
}
