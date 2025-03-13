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
