let isDrawingWalls = false;
let points = [];
let walls = new Konva.Line({
    points: [],
    stroke: "#415A77",
    strokeWidth: 3,
    lineJoin: "round",
    lineCap: "round",
    closed: true,
});
layer.add(walls);

let pointsHandles = [];

function createPoint(x, y) {
    points.push(x, y);

    projectData.walls.push(x, y);

    let circle = new Konva.Circle({
        x: x,
        y: y,
        radius: 5,
        fill: "#1B263B",
        draggable: true,
    });

    layer.add(circle);
    pointsHandles.push(circle);

    // When a circle is moved, update the walls point
    circle.on("dragmove", function () {
        let index = pointsHandles.indexOf(circle);
        const stageWidth = stage.width();
        const stageHeight = stage.height();

        let newX = circle.x();
        let newY = circle.y();

        // Prevent from placing points out of the stage
        newX = Math.max(8, Math.min(stageWidth - 8, newX));
        newY = Math.max(8, Math.min(stageHeight - 8, newY));

        const coords = getNearestGridPoint(newX, newY);

        circle.position({ x: coords[0], y: coords[1] });

        points[index * 2] = coords[0];
        points[index * 2 + 1] = coords[1];

        projectData.walls[index * 2] = coords[0];
        projectData.walls[index * 2 + 1] = coords[1];

        walls.points(points);
        layer.batchDraw();
    });
}

stage.on("click", (e) => {
    if (!isDrawingWalls) return;
    const pos = stage.getPointerPosition();

    let coords = [pos.x, pos.y];

    if (gridToggled) {
        // If the grid in enabled, map the point to the neared grid point
        coords = getNearestGridPoint(pos.x, pos.y);
    }

    if (
        (coords[0] == points[0] && coords[1] == points[1]) ||
        Math.sqrt((points[0] - coords[0]) ** 2 + (points[1] - coords[1]) ** 2) <
            10
    ) {
        // Check if start point is clicked
        isDrawingWalls = false;
        return;
    }

    createPoint(coords[0], coords[1]);
    walls.points(points);

    layer.batchDraw();
});

function createWalls() {
    if (points.length > 0 || isDrawingWalls) {
        alert("Il y a déjà des murs ! Supprimez les avant.");
        return;
    }
    isDrawingWalls = true;
}

function deleteWalls() {
    pointsHandles.forEach(function (handle) {
        handle.destroy();
        isDrawingWalls = false;
    });
    pointsHandles = [];
    projectData.walls = []
    walls.points([]);
    points = [];
    layer.batchDraw();
}

function loadWalls(uploadedPoints) {
    deleteWalls();
    for (let i=0; i < uploadedPoints.length; i+=2) {
        createPoint(uploadedPoints[i], uploadedPoints[i+1]);
    }
    walls.points(points);
    layer.batchDraw();
}
