// Zoom and move stage in workspace

const planView = document.querySelector(".plan-view");

let scale = Math.min(
    (planView.offsetWidth / stage.width()) * 0.9,
    (planView.offsetHeight / stage.height()) * 0.9
);
let isDragging = false;
let startX, startY;
let offsetX = 0,
    offsetY = 0;
let minScale = 0.05;
let maxScale = 10;
let isCtrlPressed = false;

function resetZoom() {
    scale = Math.min(
        (planView.offsetWidth / stage.width()) * 0.9,
        (planView.offsetHeight / stage.height()) * 0.9
    );
    container.style.transform = `scale(${scale})`;
    offsetX = 0;
    offsetY = 0;
    minScale = 0.05;
    maxScale = 10;
}

// Init scale on load to fit 90% of the height or width

resetZoom();

// Listener for control key
window.addEventListener("keydown", (e) => {
    if (e.key === "Control" || e.key === "Meta") {
        isCtrlPressed = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "Control" || e.key === "Meta") {
        isCtrlPressed = false;
    }
});

planView.addEventListener("mousedown", (e) => {
    if (e.button !== 0 || !isCtrlPressed) return; // Left button
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
});

planView.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    container.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
});

planView.addEventListener("mouseup", () => {
    isDragging = false;
});

planView.addEventListener("mouseleave", () => {
    isDragging = false;
});

// Handle zoom on container
planView.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomFactor = 0.03;
    if (e.deltaY < 0) {
        scale = Math.min(scale + zoomFactor, maxScale); // Zoom in
    } else {
        scale = Math.max(scale - zoomFactor, minScale); // Zoom out
    }
    container.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
});

function getViewCenter() {
    const containerRect = stage.container().getBoundingClientRect();

    topY = -containerRect.top / scale;
    bottomY = (containerRect.bottom - 2 * offsetY) / scale;

    leftX = (-containerRect.left + 380) / scale; // menu width (350) + 2 * padding (16)
    rightX = (containerRect.right - 380 - 2 * offsetX) / scale;

    return { x: (rightX + leftX) / 2, y: (bottomY + topY) / 2 };
}

document.addEventListener("keydown", (e) => {
    if (!isCtrlPressed) return;
    let step = 10;
    let dx = 0;
    let dy = 0;
    let moved = false;
    switch (e.key) {
        case "ArrowUp":
            dy = -step;
            moved = true;
            break;
        case "ArrowDown":
            dy = step;
            moved = true;
            break;
        case "ArrowLeft":
            dx = -step;
            moved = true;
            break;
        case "ArrowRight":
            // Déplacer vers la droite
            dx = step;
            moved = true;
            break;
        default:
            return; // Ignorer les autres touches
    }
    offsetX += dx;
    offsetY += dy;
    container.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
});

// Move arrows buttons
const arrowsButtons = [
    { btn: document.getElementById("arrow-up-btn"), dx: 0, dy: 1 },
    { btn: document.getElementById("arrow-down-btn"), dx: 0, dy: -1 },
    { btn: document.getElementById("arrow-left-btn"), dx: 1, dy: 0 },
    { btn: document.getElementById("arrow-right-btn"), dx: -1, dy: 0 },
];

arrowsButtons.forEach((btnData) => {
    let holdInterval;
    btnData.btn.addEventListener("mousedown", (e) => {
        holdInterval = setInterval(() => {
            offsetX += btnData.dx * 6;
            offsetY += btnData.dy * 6;

            container.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        }, 10);
    });
    document.addEventListener("mouseup", () => clearInterval(holdInterval));
});