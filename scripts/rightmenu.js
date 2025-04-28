const rightMenu = document.getElementById("right-menu");

const deleteButton = document.getElementById("delete-button");
const copyButton = document.getElementById("copy-button");
const pasteButton = document.getElementById("paste-button");

// Prevents right click menu to open on the stage
stage.on("contextmenu", (e) => {
    e.evt.preventDefault();
    openRightClickContextMenu();
});

function openRightClickContextMenu() {
    if (!isArrangementMode) return;
    rightMenu.hidden = false;
    var e = window.event;

    var posX = e.clientX;
    var posY = e.clientY;

    if (transformer.nodes().length == 0) {
        deleteButton.classList.add("unavailable");
        copyButton.classList.add("unavailable");
    } else {
        deleteButton.classList.remove("unavailable");
        copyButton.classList.remove("unavailable");
    }

    if (clipboard.length == 0) {
        pasteButton.classList.add("unavailable");
    } else {
        pasteButton.classList.remove("unavailable");
    }

    rightMenu.style = `top: ${
        posY - rightMenu.getClientRects()[0].height
    }px; left:${posX}px`;
}

document.addEventListener("click", (e) => {
    if (!rightMenu.hidden && e.button != 2) {
        rightMenu.hidden = true;
    }
});

// Menu buttons

deleteButton.addEventListener("click", (e) => {
    deleteSelection();
});
copyButton.addEventListener("click", (e) => {
    copySelection();
});
pasteButton.addEventListener("click", (e) => {
    pasteSelection();
});
