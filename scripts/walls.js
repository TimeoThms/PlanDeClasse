let isDrawingPolygon = false;
let points = [];
let polygon = new Konva.Line({
    points: [],
    stroke: "#415A77",
    strokeWidth: 3,
    lineJoin: "round",
    lineCap: "round",
    closed: true,
});
layer.add(polygon);

let pointsHandles = [];

stage.on("click", (e) => {
    if (!isDrawingPolygon) return;
    const pos = stage.getPointerPosition();

    const nearestGridPoint = getNearestGridPoint(pos.x, pos.y);

    if (nearestGridPoint[0] == points[0] && nearestGridPoint[1] == points[1]) {
        // Check if start point is clicked
        isDrawingPolygon = false;
        return;
    }

    points.push(nearestGridPoint[0], nearestGridPoint[1]);

    polygon.points(points);

    let circle = new Konva.Circle({
        x: nearestGridPoint[0],
        y: nearestGridPoint[1],
        radius: 5,
        fill: "#1B263B",
        draggable: true,
    });

    layer.add(circle);
    pointsHandles.push(circle);

    // When a circle is moved, update the polygon point
    circle.on("dragmove", function () {
        let index = pointsHandles.indexOf(circle);
        const stageWidth = stage.width();
        const stageHeight = stage.height();

        let newX = circle.x();
        let newY = circle.y();

        // Prevent from placing points out of the stage
        newX = Math.max(8, Math.min(stageWidth - 8, newX));
        newY = Math.max(8, Math.min(stageHeight - 8, newY));

        const nearestGridPoint = getNearestGridPoint(newX, newY);

        circle.position({ x: nearestGridPoint[0], y: nearestGridPoint[1] });

        points[index * 2] = nearestGridPoint[0];
        points[index * 2 + 1] = nearestGridPoint[1];

        polygon.points(points);
        layer.batchDraw();
    });

    layer.batchDraw();
});

function createWalls() {
    console.log(points.length);
    if (points.length > 0 || isDrawingPolygon) {
        alert("Il y a déjà des murs ! Supprimez les avant.");
        return;
    }
    console.log("start drawing")
    isDrawingPolygon = true;
}

function deleteWalls() {
    pointsHandles.forEach(function (handle) {
        handle.destroy();
        isDrawingPolygon = false;
    });
    pointsHandles = [];
    polygon.points([]);
    points = []
    layer.batchDraw();
}
