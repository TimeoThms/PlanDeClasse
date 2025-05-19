const addComputerBtn = document.getElementById("add-computer-btn");

// Returns the list of shapes used to make the computer
function createComputer({ }) {
    const imageObj = new Image();
    imageObj.crossOrigin = "anonymous";
    imageObj.src =
        "https://timeothms.github.io/PlanDeClasse/ressources/images/computer.png";
    const icon = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: 35,
        height: 35,
    });
    return [icon];
}

addComputerBtn.addEventListener("click", () => {
    addElement({
        type: "computer",
        id: generateId(),
        rotation: 0,
        config: { },
    });
    pushStateSnapshot();
});
