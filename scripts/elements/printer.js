const addPrinterBtn = document.getElementById("add-printer-btn");

// Returns the list of shapes used to make the printer
function createPrinter({ }) {
    const imageObj = new Image();
    imageObj.crossOrigin = "anonymous";
    imageObj.src =
        "https://timeothms.github.io/PlanDeClasse/ressources/images/printer.svg";
    const icon = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: 35,
        height: 35,
    });
    return [icon];
}

addPrinterBtn.addEventListener("click", () => {
    addElement({
        type: "printer",
        id: generateId(),
        rotation: 0,
        config: { },
    });
    pushStateSnapshot();
});
