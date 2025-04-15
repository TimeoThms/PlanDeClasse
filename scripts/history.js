const history = {
    snapshots: [],
    currentIndex: 0,
};

document.addEventListener("keydown", function (event) {
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
    const snapshot = JSON.parse(JSON.stringify(projectData));
    history.snapshots = history.snapshots.slice(0, history.currentIndex + 1);
    history.snapshots.push(snapshot);
    history.currentIndex++;
}

function undo() {
    if (history.currentIndex > 0) {
        history.currentIndex--;
        applySnapshot(history.snapshots[history.currentIndex]);
    }
}

function redo() {
    if (history.currentIndex < history.snapshots.length - 1) {
        history.currentIndex++;
        applySnapshot(history.snapshots[history.currentIndex]);
    }
}

function applySnapshot(snapshot) {

    if (snapshot === projectData) return;

    projectData = snapshot;

    elements.forEach((e) => {
        if (e && e.destroy) {
            e.destroy();
        }
    });

    elementsLayer.batchDraw();

    // Clear transformer nodes of all previous elements
    transformer.nodes([]);

    // Fill size inputs with their values
    filenameInput.value = projectData.filename;
    widthInput.value = projectData.width / 100; // Values in meters, 1px = 1cm
    heightInput.value = projectData.height / 100;

    // Match size to the size of the loaded project
    stage.width(projectData.width);
    canvas.width(projectData.width);
    stage.height(projectData.height);
    canvas.height(projectData.height);

    loadWalls(projectData.walls);

    // Load elements
    projectData.elements.forEach((e) => {
        // Get attributes of the element. ...config corresponds to the remaining arguments (aka type-related args)
        const { type, id, x, y, rotation, ...config } = e;
        addElement({ type, id, x, y, rotation, config });
    });

    // resetZoom();
    updateGrid();
    displayEditor();

    layer.batchDraw();
    elementsLayer.batchDraw();
}
