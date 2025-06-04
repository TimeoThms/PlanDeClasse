const addOutletBtn = document.getElementById("add-outlet-btn");

// Returns the list of shapes used to make the outlet
function createOutlet({}) {
    let rect = new Konva.Rect({
        x: 0,
        y: 0,
        width: 14,
        height: 20,
        fill: "#64a8c4",
        cornerRadius: 2,
    });

    const imageObj = new Image();
    imageObj.crossOrigin = "anonymous";
    imageObj.src =
        "https://timeothms.github.io/PlanDeClasse/ressources/images/outlet.png";
    const icon = new Konva.Image({
        x: 3,
        y: 3,
        image: imageObj,
        width: 8,
        height: 14,
    });
    return [rect, icon];
}

addOutletBtn.addEventListener("click", () => {
    addElement({
        type: "outlet",
        id: generateId(),
        rotation: 0,
        config: {},
    });
    pushStateSnapshot();
});
