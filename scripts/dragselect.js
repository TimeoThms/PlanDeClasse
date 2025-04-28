const selectionRectangle = new Konva.Rect({
    fill: "rgba(77,177,236,0.2)",
    stroke: "#4DB1EC",
    visible: false,
});

topLayer.add(selectionRectangle);

let x1, y1, x2, y2;

stage.on("mousedown", (e) => {
    if (
        isCtrlPressed ||
        e.target.getLayer()._id == 4 ||
        pointsHandles.includes(e.target) ||
        !isArrangementMode ||
        e.evt.button != 0
    )
        return; // Layer 4 is elementsLayer and 2 is top layer

    const containerRect = stage.container().getBoundingClientRect();

    x1 = (e.evt.clientX - containerRect.left) / scale;
    y1 = (e.evt.clientY - containerRect.top) / scale;

    x2 = x1;
    y2 = y1;

    selectionRectangle.visible(true);
    selectionRectangle.width(0);
    selectionRectangle.height(0);
    topLayer.batchDraw();
});

window.addEventListener("mousemove", (e) => {
    const containerRect = stage.container().getBoundingClientRect();

    if (!selectionRectangle.visible()) {
        return;
    }
    x2 = (e.clientX - containerRect.left) / scale;
    y2 = (e.clientY - containerRect.top) / scale;

    selectionRectangle.setAttrs({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
    });

    const box = selectionRectangle.getClientRect();
    const selected = elements.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
    );

    transformer.nodes(selected);
    updateTransformerResizeState();
    elementsLayer.batchDraw();
    topLayer.batchDraw();
});

window.addEventListener("mouseup", (e) => {
    if (!selectionRectangle.visible()) {
        return;
    }
    setTimeout(() => {
        selectionRectangle.visible(false);
        topLayer.batchDraw();
    });
});
