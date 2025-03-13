const fileInput = document.getElementById("input-file");
const filenameInput = document.getElementById("input-filename");
const exportBtn = document.getElementById("btn-export");

let projectData = {
    "filename": "",
    "width": stage.width(),
    "height": stage.height(),
    "walls": [],
    "elements": []
};

fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0]; // Fetch file

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
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
    console.log("Changed:" + value);

    if (value) {
        projectData.filename = value;
    } else {
        alert("Veuillez entrer un nom de fichier");
    }
});

exportBtn.addEventListener("click", () => {
    jsonStr = JSON.stringify(projectData);

    let a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr);
    a.download = projectData.filename + "_DATA.json";

    a.click();
});
function loadProject() {
    filenameInput.value = projectData.filename;

    widthInput.value = projectData.width/100;
    heightInput.value = projectData.height/100;

    stage.width(projectData.width);
    canvas.width(projectData.width);
    stage.height(projectData.height);
    canvas.height(projectData.height);
    
    loadWalls(projectData.walls);
    resetZoom();
    updateGrid();
}

function exportProject() {}
