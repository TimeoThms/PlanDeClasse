// Download stage to PNG
const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", () => {
    pointsHandles.forEach(function (circle) {
        circle.visible(false);
    });
    gridLines.forEach(function (line) {
        line.visible(false);
    });

    const dataURL = stage.toDataURL({
        pixelRatio: 3,
    });

    // Create link and click it
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "plan_de_classe.png"; // Filename
    a.click();

    pointsHandles.forEach(function (circle) {
        circle.visible(true);
    });
    gridLines.forEach(function (line) {
        line.visible(true);
    });
});

// Start drawing and delete walls
const createWallsBtn = document.getElementById("btn-create-walls");
const deleteWallsBtn = document.getElementById("btn-delete-walls");

createWallsBtn.addEventListener("click", () => {
    createWalls();
})

deleteWallsBtn.addEventListener("click", () => {
    deleteWalls();
});
