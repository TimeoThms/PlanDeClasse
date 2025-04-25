// Stage init
const container = document.getElementById("container");

const defaultSize = { width: 1050, height: 800 };

const stage = new Konva.Stage({
    container: "container",
    width: defaultSize.width,
    height: defaultSize.height,
});

// Fill size inputs, in meters, 1px = 1cm
widthInput.value = stage.width() / 100;
heightInput.value = stage.height() / 100;

const layer = new Konva.Layer();
stage.add(layer);

const canvas = new Konva.Rect({
    x: 0,
    y: 0,
    width: stage.width(),
    height: stage.height(),
    fill: "white",
});
layer.add(canvas);
canvas.moveToBottom();

let elements = [];

const elementsLayer = new Konva.Layer();
stage.add(elementsLayer);

updateGrid();

let last_id = null;
function generateId() {
    // Uses timestamp as unique identifier
    id = `id_${Date.now()}`;
    while (id == last_id) {
        id = `id_${Date.now()}`;
    }
    last_id = id;
    return id;
}

document.querySelectorAll("input").forEach((el) => {
    if (!el.classList.contains("no-log")) {
        el.addEventListener("change", () => {
            pushStateSnapshot();
        });
    }
});

// Prevents right click menu to open on the stage
stage.on("contextmenu", (e) => {
    e.evt.preventDefault();
});

window.addEventListener("beforeunload", (e) => {
    if (unsavedChanges) {
        e.preventDefault();
    }

    localStorage.setItem("projectData", JSON.stringify(projectData));
    localStorage.setItem(
        "studentsListData",
        JSON.stringify(getStudentsListData())
    );
    localStorage.setItem(
        "isArrangementMode",
        JSON.stringify(isArrangementMode)
    );
});

window.addEventListener("load", () => {
    try {
        const savedProject = localStorage.getItem("projectData");
        if (savedProject) {
            projectData = JSON.parse(savedProject);
            loadProject();
        }
    } catch (error) {
        console.error("Error parsing projectData:", error);
    }

    try {
        const savedStudents = localStorage.getItem("studentsListData");
        if (savedStudents) {
            loadStudentsList(JSON.parse(savedStudents));
        }
    } catch (error) {
        console.error("Error parsing studentsListData:", error);
    }

    try {
        const retrievedIsArrangementMode =
            localStorage.getItem("isArrangementMode");
        if (retrievedIsArrangementMode !== null) {
            switchMode(JSON.parse(retrievedIsArrangementMode));
        } else {
            isArrangementMode = true;
        }
    } catch (error) {
        console.error("Error parsing isArrangementMode:", error);
    }
    unsavedChanges = false;
});

const headers = document.querySelectorAll("h2");
headers.forEach((header) => {
    header.addEventListener("click", () => {
        const content = header.nextElementSibling;

        if (!content) return;

        if (content.classList.contains("open")) {
            content.style.maxHeight = content.scrollHeight + "px";
        } else {
            content.style.maxHeight = "0";
        }
    });
});
