// Download stage to PNG
const downloadBtn = document.getElementById("downloadBtn");

var unsavedChanges = false;

downloadBtn.addEventListener("click", () => {
    pointsHandles.forEach(function (circle) {
        circle.visible(false);
    });
    gridLines.forEach(function (line) {
        line.visible(false);
    });
    lengthDisplays.forEach(function (label) {
        label.visible(false);
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

    if (arrangementMode) {
        pointsHandles.forEach(function (circle) {
            circle.visible(true);
        });
        gridLines.forEach(function (line) {
            line.visible(true);
        });
        lengthDisplays.forEach(function (label) {
            label.visible(true);
        });
        transformer.visible(true);
    }
});

// Reset
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
    if (
        confirm("Attention, des modifications pourraient être perdues !") ==
        false
    )
        return;

    deleteWalls();
    elements.forEach((e) => {
        if (e && e.destroy) {
            e.destroy();
        }
    });

    elements = [];

    transformer.nodes([]);

    filenameInput.value = "";
    widthInput.value = defaultSize.width / 100; // Values in meters, 1px = 1cm
    heightInput.value = defaultSize.height / 100;

    stage.width(defaultSize.width);
    stage.height(defaultSize.height);

    projectData = {
        filename: "",
        width: stage.width(),
        height: stage.height(),
        walls: [],
        elements: [],
    };

    stage.width(projectData.width);
    canvas.width(projectData.width);
    stage.height(projectData.height);
    canvas.height(projectData.height);

    resetZoom();
    displayEditor();

    layer.batchDraw();

    pushStateSnapshot();
});

// Mode switch
const arrangementBtn = document.getElementById("arrangement-mode-btn");
const placementBtn = document.getElementById("placement-mode-btn");
const arrangementSection = document.getElementById("arrangement-menu");
const placementSection = document.getElementById("placement-menu");

arrangementBtn.addEventListener("click", () => {
    switchMode(true);
});
placementBtn.addEventListener("click", () => {
    switchMode(false);
});

var isArrangementMode;
function switchMode(arrangementMode) {
    if (arrangementMode === isArrangementMode) return;

    isArrangementMode = arrangementMode;

    if (!isArrangementMode) {
        arrangementSection.hidden = true;
        placementSection.hidden = false;
        arrangementBtn.classList.remove("active");
        placementBtn.classList.add("active");

        unselectAll();
        if (gridToggled) {
            toggleGrid();
        }
        pointsHandles.forEach(function (circle) {
            circle.visible(false);
            circle.draggable(false);
        });
        lengthDisplays.forEach(function (label) {
            label.visible(false);
        });
    } else {
        arrangementSection.hidden = false;
        placementSection.hidden = true;
        arrangementBtn.classList.add("active");
        placementBtn.classList.remove("active");

        toggleGrid();
        pointsHandles.forEach(function (circle) {
            circle.visible(true);
            circle.draggable(true);
        });
        lengthDisplays.forEach(function (label) {
            label.visible(true);
        });
    }

    // Max height setup for tabs opened by default
    const openedTabs = document.querySelectorAll(".menu-tab.open");
    openedTabs.forEach((tab) => {
        tab.style.transition = "none";
        tab.style.maxHeight = tab.scrollHeight + "px";
        setTimeout(() => {
            // 1ms delay to bypass a weird bug of the browser not saving the new state of the transition
            tab.style.transition = "max-height 0.3s ease-in-out";
        }, 1);
    });
}

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
