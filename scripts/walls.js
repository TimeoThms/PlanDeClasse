let isDrawingWalls = false;
let points = [];
let walls = new Konva.Line({
    points: [],
    stroke: "#415A77",
    strokeWidth: 3,
    lineJoin: "round",
    lineCap: "round",
    closed: false,
});
layer.add(walls);

const topLayer = new Konva.Layer();
stage.add(topLayer);

let pointsHandles = [];
let lengthDisplays = [];

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

    topLayer.add(circle);
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

        updateWallLengthLabel(index);
        layer.batchDraw();
        topLayer.batchDraw();
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
        walls.closed(true);
        addWallLengthLabel();
        return;
    }
    createPoint(coords[0], coords[1]);
    walls.points(points);

    addWallLengthLabel();

    layer.batchDraw();
    topLayer.batchDraw();

    pushStateSnapshot();
});

function createWalls() {
    if (points.length > 0 || isDrawingWalls) {
        alert("Il y a déjà des murs ! Supprimez les avant.");
        return;
    }
    isDrawingWalls = true;
    walls.closed(false);
}

function deleteWalls() {
    pointsHandles.forEach(function (handle) {
        handle.destroy();
    });
    lengthDisplays.forEach(function (label) {
        label.destroy();
    });
    walls.closed(false);
    isDrawingWalls = false;
    pointsHandles = [];
    projectData.walls = [];
    lengthDisplays = [];
    walls.points([]);
    points = [];
    layer.batchDraw();
    topLayer.batchDraw();
}

function loadWalls(uploadedPoints, shouldEndWithDrawingTrue = false) {
    deleteWalls();
    isDrawingWalls = true;
    for (let i = 0; i < uploadedPoints.length; i += 2) {
        createPoint(uploadedPoints[i], uploadedPoints[i + 1]);
        walls.points(points);
        addWallLengthLabel();
    }
    isDrawingWalls = shouldEndWithDrawingTrue;
    walls.closed(!shouldEndWithDrawingTrue);
    addWallLengthLabel();

    if (!isArrangementMode) {
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
    }

    layer.batchDraw();
    topLayer.batchDraw();
}

function addWallLengthLabel() {
    if (points.length >= 4) {
        let indexoffset = 0;
        if (!isDrawingWalls) {
            indexoffset = 2;
        }
        const startIndex = points.length - 4 + indexoffset;
        const x1 = points[startIndex % points.length];
        const y1 = points[(startIndex + 1) % points.length];
        const x2 = points[(startIndex + 2) % points.length];
        const y2 = points[(startIndex + 3) % points.length];

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        const lengthInMeters = (
            Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) / 100
        ).toFixed(2);

        const lengthLabel = new Konva.Label({
            x: midX,
            y: midY,
            opacity: 0.7,
        });
        lengthLabel.add(
            new Konva.Tag({
                fill: "#ddd",
                cornerRadius: 8,
            })
        );
        lengthLabel.add(
            new Konva.Text({
                text: `${lengthInMeters} m`,
                fontSize: 14,
                fill: "#000",
                fontStyle: "bold",
                padding: 4,
            })
        );

        lengthLabel.offsetX(lengthLabel.width() / 2);
        lengthLabel.offsetY(lengthLabel.height() / 2);

        topLayer.add(lengthLabel);
        lengthDisplays.push(lengthLabel);
    }
}

function updateWallLengthLabel(handleIndex) {
    const firstLabelIndex = handleIndex;
    const secondLabelIndex =
        // Adding lengthDisplays.length to handle negative numbers modulo
        (handleIndex - 1 + lengthDisplays.length) % lengthDisplays.length;

    const labelsToUpdate = [firstLabelIndex, secondLabelIndex];

    labelsToUpdate.forEach((index) => {
        let secondHandleIndex;
        if (handleIndex == index) {
            secondHandleIndex =
                (handleIndex + 1 + lengthDisplays.length) %
                lengthDisplays.length;
        } else {
            secondHandleIndex =
                (handleIndex - 1 + lengthDisplays.length) %
                lengthDisplays.length;
        }
        const x1 = points[handleIndex * 2];
        const y1 = points[handleIndex * 2 + 1];
        const x2 = points[secondHandleIndex * 2];
        const y2 = points[secondHandleIndex * 2 + 1];

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        const lengthInMeters = (
            Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) / 100
        ).toFixed(2);

        const lengthLabel = lengthDisplays[index];
        if (lengthLabel) {
            lengthLabel.position({ x: midX, y: midY });
            const textNode = lengthLabel.findOne("Text");
            textNode.text(`${lengthInMeters} m`);
            lengthLabel.offsetX(lengthLabel.width() / 2);
            lengthLabel.offsetY(lengthLabel.height() / 2);
        }
    });
}
