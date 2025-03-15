const fileInput = document.getElementById("input-file");
const filenameInput = document.getElementById("input-filename");
const exportBtn = document.getElementById("btn-export");

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

    if (value) {
        projectData.filename = value;
    } else {
        alert("Veuillez entrer un nom de fichier");
    }
});

exportBtn.addEventListener("click", () => {
    jsonStr = JSON.stringify(projectData);

    let a = document.createElement("a");
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr);
    a.download = projectData.filename + "_DATA.json";

    a.click();
});

function loadProject() {
    // Delete all elements
    elements.forEach((e) => {
        if (e && e.destroy) {
            e.destroy();
        }
    });

    elementsLayer.batchDraw();

    // Clear transformer nodes
    transformerNoResize.nodes([]);

    filenameInput.value = projectData.filename;

    widthInput.value = projectData.width / 100;
    heightInput.value = projectData.height / 100;

    stage.width(projectData.width);
    canvas.width(projectData.width);
    stage.height(projectData.height);
    canvas.height(projectData.height);

    loadWalls(projectData.walls);

    // Load elements
    projectData.elements.forEach((e) => {
        if (e.type === "table") {
            addTable(e.id, e.x, e.y, e.rotation, e.color, e.label);
        }
    });


    resetZoom();
    updateGrid();

    layer.batchDraw();
    elementsLayer.batchDraw();
}

function exportProject() {}
