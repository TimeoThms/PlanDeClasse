const fileInput = document.getElementById("input-file");
const filenameInput = document.getElementById("input-filename");
const exportBtn = document.getElementById("btn-export");

// Default, empty project data
let projectData = {
    filename: "",
    width: stage.width(),
    height: stage.height(),
    walls: [],
    elements: [],
};

fileInput.addEventListener("input", function (event) {
    const file = event.target.files[0]; // Fetch file

    fileInput.value = null;

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                projectData = {};

                projectData = JSON.parse(e.target.result);

                const requiredKeys = [
                    "filename",
                    "width",
                    "height",
                    "walls",
                    "elements",
                ];

                const isValid = requiredKeys.every((key) => key in projectData);

                if (!isValid) {
                    throw new Error(
                        "Le fichier JSON ne contient pas toutes les clés requises !"
                    );
                }

                loadProject();
            } catch (error) {
                console.error("Erreur dans le fichier json :", error);
            }
        };

        reader.readAsText(file);
    }
});

filenameInput.addEventListener("input", function () {
    const value = filenameInput.value;
    projectData.filename = value;
});

exportBtn.addEventListener("click", () => {
    // Sort projectData elements by zIndex
    projectData.elements = projectData.elements.sort((a, b) => {
        const groupA = elements.find((g) => g.id() === a.id);
        const groupB = elements.find((g) => g.id() === b.id);
        return groupA.zIndex() - groupB.zIndex();
    });

    jsonStr = JSON.stringify(projectData);

    let a = document.createElement("a");
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr);
    a.download = projectData.filename + "_DATA.json";

    a.click();
    unsavedChanges = false;
});

function loadProject() {
    // Delete all elements
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

    resetZoom();
    updateGrid();
    displayEditor();

    layer.batchDraw();
    elementsLayer.batchDraw();
    topLayer.batchDraw();

    updateStudentsList();

    pushStateSnapshot();
}
