const addTrashcanBtn = document.getElementById("add-trashcan-btn");

// Returns the list of shapes used to make the trashcan
function createTrashcan({ }) {
    const imageObj = new Image();
    imageObj.crossOrigin = "anonymous";
    imageObj.src =
        "https://timeothms.github.io/PlanDeClasse/ressources/images/trashcan.png";
    const icon = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: 35,
        height: 35,
    });
    return [icon];
}

addTrashcanBtn.addEventListener("click", () => {
    addElement({
        type: "trashcan",
        id: generateId(),
        rotation: 0,
        config: { },
    });
    pushStateSnapshot();
});
