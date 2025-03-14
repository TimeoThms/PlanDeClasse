const addTableBtn = document.getElementById("add-table-btn");

function addTable(x = 100, y = 100) {

    let group = new Konva.Group({
        x: x,
        y: y,
        draggable: true,
    });

    let chair = new Konva.Rect({
        x: 12,
        y: 40,
        width: 41,
        height: 10,
        fill: '#1a6e23',
        cornerRadius: 100,
    });

    let plank = new Konva.Rect({
        x: 0,
        y: 0,
        width: 65,
        height: 45,
        fill: '#b6c4d6',
        cornerRadius: 4,
        stroke: '#1a6e23',
        strokeWidth: 2,
    });

    var tr = new Konva.Transformer();
    tr.resizeEnabled(false);
    layer.add(tr);
    tr.nodes([group]);

    group.add(chair);
    group.add(plank);
    layer.add(group);

    layer.batchDraw();
}