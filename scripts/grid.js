const resolutionInput = document.getElementById("resolution-input");

let gridToggled = true;

function toggleGrid() {
    gridToggled = !gridToggled;
    updateGrid();
    if (gridToggled) {
        toggleGridBtn.innerText = "Cacher";
    } else {
        toggleGridBtn.innerText = "Afficher";
    }
}

function getNearestGridPoint(x, y) {
    return [
        Math.round(x / gridResolution) * gridResolution,
        Math.round(y / gridResolution) * gridResolution,
    ];
}

var gridLines = [];

// Grid resolution can be 5, 10, 20, 40 or 80 and input goes from 0 to 4, so the resolution is 5 * 2^input
let gridResolution = 5 * Math.pow(2, resolutionInput.value);

// Update resolution and re-draw the grid when the input resolution changes
resolutionInput.addEventListener("input", function () {
    gridResolution = 5 * Math.pow(2, this.value);
    updateGrid();
});

// Pretty straightforward
function updateGrid() {
    gridLines.forEach((line) => {
        line.destroy();
    });

    gridLines = [];

    if (!gridToggled) return;

    // Horizontals lines
    for (let i = 0; i < Math.floor(stage.width() / gridResolution) + 1; i++) {
        const gridLine = new Konva.Line({
            points: [i * gridResolution, 0, i * gridResolution, stage.height()],
            stroke: "#ccc",
            strokeWidht: 1,
        });
        gridLines.push(gridLine);
        layer.add(gridLine);
        gridLine.zIndex(1); // z-index 1, just above the white background
    }

    // Vertical lines
    for (let i = 0; i < Math.floor(stage.height() / gridResolution) + 1; i++) {
        const gridLine = new Konva.Line({
            points: [0, i * gridResolution, stage.width(), i * gridResolution],
            stroke: "#ccc",
            strokeWidht: 1,
        });
        gridLines.push(gridLine);
        layer.add(gridLine);
        gridLine.zIndex(1);
    }
}
