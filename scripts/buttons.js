// Download stage to PNG
const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", () => {
    pointsHandles.forEach(function (circle) {
        circle.visible(false);
    });
    gridLines.forEach(function (line) {
        line.visible(false);
    });
    transformer.visible(false);

    const dataURL = stage.toDataURL({
        pixelRatio: 2, // On the canvas, 1px = 1cm, on export, the resolution is doubled
    });

    // Create link and click it
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = projectData.filename + "_IMG.png"; // Filename
    a.click();

    pointsHandles.forEach(function (circle) {
        circle.visible(true);
    });
    gridLines.forEach(function (line) {
        line.visible(true);
    });
    transformer.visible(true);
});

// Grid
const toggleGridBtn = document.getElementById("btn-toggle-grid");
toggleGridBtn.addEventListener("click", () => {
    toggleGrid();
});

// Start drawing and delete walls
const createWallsBtn = document.getElementById("btn-create-walls");
const deleteWallsBtn = document.getElementById("btn-delete-walls");

createWallsBtn.addEventListener("click", () => {
    createWalls();
});

deleteWallsBtn.addEventListener("click", () => {
    deleteWalls();
});

// Height and width input
const widthInput = document.getElementById("width-input");
const heightInput = document.getElementById("height-input");

widthInput.addEventListener("change", function () {
    const value = widthInput.value;

    if (value >= 0) {
        stage.width(value * 100);
        canvas.width(value * 100);
        projectData.width = value * 100;

        resetZoom();
        updateGrid();
    } else {
        alert("Valeur invalide ! Veuillez entrer un nombre positif");
    }
});

heightInput.addEventListener("change", function () {
    const value = heightInput.value;

    if (value >= 0) {
        stage.height(value * 100);
        canvas.height(value * 100);
        projectData.height = value * 100;

        resetZoom();
        updateGrid();
    } else {
        alert("Valeur invalide ! Veuillez entrer un nombre positif");
    }
});
