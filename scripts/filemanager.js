const fileInput = document.getElementById("input-file");
const filenameInput = document.getElementById("input-filename");

let projectData = {};

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

function loadProject() {
    filenameInput.value = projectData.filename;
    loadWalls(projectData.walls);
}

function exportProject() {}
