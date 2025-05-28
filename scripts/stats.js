const statsIds = [
    "seats",
    "computer",
    "projector",
    "printer",
    "trashcan",
    "broom",
];

const typesWithStats = [
    { type: "table", statId: "seats", increment: 1 },
    { type: "doubletable", statId: "seats", increment: 2 },
    { type: "computer", statId: "computer", increment: 1 },
    { type: "printer", statId: "printer", increment: 1 },
    { type: "trashcan", statId: "trashcan", increment: 1 },
];

statsIds.forEach(function (id) {
    projectData.countsOffsets[id] = 0;
    const countElement = document.querySelector(`#count-${id}`);
    const plusButton = document.querySelector(`#plus-${id}`);
    const minusButton = document.querySelector(`#minus-${id}`);
    const resetButton = document.querySelector(`#reset-${id}`);

    plusButton.addEventListener("click", () => {
        projectData.countsOffsets[id]++;
        pushStateSnapshot();
    });

    // Écouteur d'événements pour le bouton - (décrément)
    minusButton.addEventListener("click", () => {
        projectData.countsOffsets[id]--;
        pushStateSnapshot();
    });

    // Écouteur d'événements pour le bouton Reset
    resetButton.addEventListener("click", () => {
        projectData.countsOffsets[id] = 0;
        pushStateSnapshot();
    });
});

function getCountById(id, bypassOffset = false) {
    let count = 0;
    projectData.elements.forEach((element) => {
        const statInfo = typesWithStats.find(
            (item) => item.type === element.type
        );
        if (statInfo && statInfo.statId === id) {
            count += statInfo.increment;
        }
    });

    if (bypassOffset) {
        return count;
    }

    return count + (projectData.countsOffsets[id] || 0);
}

function updateCountsDisplays() {
    statsIds.forEach((id) => {
        const countElement = document.querySelector(`#count-${id}`);
        countElement.textContent = getCountById(id);
    });
}
