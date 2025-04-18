const dataHistory = {
    snapshots: [
        {
            projectData: structuredClone(projectData),
            studentsData: getStudentsListData(),
        },
    ],
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
    const snapshot = {
        projectData: structuredClone(projectData),
        studentsData: getStudentsListData(),
    };

    // Prevents pushing a snapshot twice (should never happen but just in case)
    const currentSnapshot = dataHistory.snapshots[dataHistory.currentIndex];
    const hasChanged =
        JSON.stringify(currentSnapshot) !== JSON.stringify(snapshot);
    if (!hasChanged) return;

    dataHistory.snapshots = dataHistory.snapshots.slice(
        0,
        dataHistory.currentIndex + 1
    );
    dataHistory.snapshots.push(snapshot);
    dataHistory.currentIndex++;

    unsavedChanges = true;
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
    if (snapshot.projectData != projectData) {
        projectData = structuredClone(snapshot.projectData);

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
        filenameInput.value = snapshot.projectData.filename;
        widthInput.value = snapshot.projectData.width / 100; // Values in meters, 1px = 1cm
        heightInput.value = snapshot.projectData.height / 100;

        // Match size to the size of the loaded project
        stage.width(snapshot.projectData.width);
        canvas.width(snapshot.projectData.width);
        stage.height(snapshot.projectData.height);
        canvas.height(snapshot.projectData.height);

        loadWalls(snapshot.projectData.walls, isDrawingWalls);

        // Load elements
        snapshot.projectData.elements.forEach((e) => {
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
    if (snapshot.studentsData != getStudentsListData()) {
        studentsIds.forEach((id) => deleteStudent(id));
        loadStudentsList(snapshot.studentsData);
    }
}
