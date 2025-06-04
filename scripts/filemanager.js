const fileInput = document.getElementById("input-file");
const filenameInput = document.getElementById("input-filename");
const exportBtn = document.getElementById("btn-export");

function ensureDefaults(data = {}) {
    const defaultConfig = {
        filename: "",
        width: stage.width(),
        height: stage.height(),
        walls: [],
        elements: [],
        countsOffsets: {},
    };

    for (const key in defaultConfig) {
        if (!(key in data)) {
            data[key] = defaultConfig[key];
        }
    }
    return data;
}

// Default, empty project data
let projectData = ensureDefaults();

fileInput.addEventListener("input", function (event) {
    const file = event.target.files[0]; // Fetch file

    fileInput.value = null;

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                projectData = {};

                projectData = JSON.parse(e.target.result);

                loadProject();
            } catch (error) {
                console.error("Erreur dans le fichier json :", error);
            }
        };

        reader.readAsText(file);
    }
});

filenameInput.addEventListener("input", function () {
    const value = filenameInput.value;
    projectData.filename = value;
});

exportBtn.addEventListener("click", () => {
    // Sort projectData elements by zIndex
    projectData.elements = projectData.elements.sort((a, b) => {
        const groupA = elements.find((g) => g.id() === a.id);
        const groupB = elements.find((g) => g.id() === b.id);
        return groupA.zIndex() - groupB.zIndex();
    });

    jsonStr = JSON.stringify(projectData);

    let a = document.createElement("a");
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr);
    a.download = projectData.filename + "_DATA.json";

    a.click();
    unsavedChanges = false;
});

function loadProject() {
    projectData = ensureDefaults(projectData);

    // Delete all elements
    elements.forEach((e) => {
        if (e && e.destroy) {
            e.destroy();
        }
    });

    elements = [];

    elementsLayer.batchDraw();

    // Clear transformer nodes of all previous elements
    transformer.nodes([]);

    // Fill size inputs with their values
    filenameInput.value = projectData.filename;
    widthInput.value = projectData.width / 100; // Values in meters, 1px = 1cm
    heightInput.value = projectData.height / 100;

    // Match size to the size of the loaded project
    stage.width(projectData.width);
    canvas.width(projectData.width);
    stage.height(projectData.height);
    canvas.height(projectData.height);

    loadWalls(projectData.walls);

    // Load elements
    projectData.elements.forEach((e) => {
        // Get attributes of the element. ...config corresponds to the remaining arguments (aka type-related args)
        const { type, id, x, y, rotation, ...config } = e;
        addElement({ type, id, x, y, rotation, config });
    });

    resetZoom();
    updateGrid();
    displayEditor();

    layer.batchDraw();
    elementsLayer.batchDraw();
    topLayer.batchDraw();

    updateStudentsList();

    pushStateSnapshot();
}

function writeLabelValue(doc, label, value, x, y) {
    doc.setTextColor("#000");
    doc.setFontType("bold");
    doc.text(label, x, y);

    const labelWidth = doc.getTextWidth(label);

    doc.setFontType("normal");
    doc.text(value, x + labelWidth, y);

    if (value.endsWith(`${projectData.filename}_DATA.json `)) {
        let parts = value.split(`${projectData.filename}_DATA.json`);
        const lineX = doc.getTextWidth(label + parts[0]) + 15;

        doc.setLineWidth(0.3);
        doc.line(
            lineX,
            y + 1,
            lineX + doc.getTextWidth(`${projectData.filename}_DATA.json`),
            y + 1
        );
    }
}

function downloadToPDF() {
    // Hide useless elements
    selectionRectangle.visible(false);
    pointsHandles.forEach(function (circle) {
        circle.visible(false);
    });
    gridLines.forEach(function (line) {
        line.visible(false);
    });
    lengthDisplays.forEach(function (label) {
        label.visible(false);
    });
    transformer.visible(false);

    // Generate image
    const dataURL = stage.toDataURL({
        pixelRatio: 2, // On the canvas, 1px = 1cm, on export, the resolution is doubled
    });

    // Show elements again if needed
    if (isArrangementMode) {
        pointsHandles.forEach(function (circle) {
            circle.visible(true);
        });
        gridLines.forEach(function (line) {
            line.visible(true);
        });
        lengthDisplays.forEach(function (label) {
            label.visible(true);
        });
        transformer.visible(true);
    }

    const imgRatio = stage.width() / stage.height();

    const orientation =
        stage.width() > stage.height() ? "landscape" : "portrait";

    var doc = new jsPDF({ orientation: orientation, unit: "mm", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 5;

    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    let newWidth = maxWidth;
    let newHeight = newWidth / imgRatio;

    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * imgRatio;
    }

    const x = (pageWidth - newWidth) / 2;

    doc.addImage(dataURL, "JPEG", x, margin, newWidth, newHeight);

    // SECOND PAGE
    doc.setFont("Inter");
    doc.addPage("a4", "portrait");

    // Titles

    doc.setFontType("bold");
    doc.setFontSize(24);
    doc.setTextColor("#415a77");

    doc.text("Informations", 15, 20);
    doc.text("Statistiques", 100, 20);
    doc.text("Modifications", 15, 90);

    // Corps
    doc.setTextColor("#000");
    doc.setFontSize(14);

    writeLabelValue(doc, "Nom : ", projectData.filename, 15, 30);
    writeLabelValue(doc, "Version : ", new Date().toLocaleString(), 15, 38);
    writeLabelValue(doc, "Largeur : ", `${projectData.width / 100} m`, 15, 46);
    writeLabelValue(doc, "Hauteur : ", `${projectData.height / 100} m`, 15, 54);

    writeLabelValue(doc, "Places : ", `${getCountById("seats")}`, 100, 30);
    writeLabelValue(
        doc,
        "Ordinateurs : ",
        `${getCountById("computers")}`,
        100,
        38
    );
    writeLabelValue(
        doc,
        "Vidéoprojecteurs : ",
        `${getCountById("projector")}`,
        100,
        46
    );
    writeLabelValue(
        doc,
        "Imprimantes : ",
        `${getCountById("printer")}`,
        100,
        54
    );
    writeLabelValue(
        doc,
        "Poubelles : ",
        `${getCountById("trashcan")}`,
        100,
        62
    );
    writeLabelValue(
        doc,
        "Prises de courant : ",
        `${getCountById("outlet")}`,
        100,
        70
    );
    writeLabelValue(doc, "Balais : ", `${getCountById("broom")}`, 100, 78);

    // Edition section
    doc.setFontSize(12);

    writeLabelValue(
        doc,
        "1. ",
        `Téléchargez le fichier ${projectData.filename}_DATA.json `,
        15,
        108
    );

    doc.setTextColor("#0b68d4");
    const base64 = btoa(encodeURIComponent(JSON.stringify(projectData)));
    doc.textWithLink(
        "en cliquant ici.",
        15 +
            doc.getTextWidth(
                `1. Téléchargez le fichier ${projectData.filename}_DATA.pdf   `
            ),
        108,
        {
            url: `https://timeothms.github.io/PlanDeClasse/download.html#data=${base64}`,
        }
    );

    writeLabelValue(
        doc,
        "2. ",
        `Vous serez automatiquement redirigé vers l'éditeur`,
        15,
        116
    );
    writeLabelValue(
        doc,
        "3. ",
        `Cliquez sur le bouton "Importer" et sélectionnez le fichier téléchargé`,
        15,
        124
    );
    writeLabelValue(doc, "4. ", `Modifiez le projet à votre guise.`, 15, 132);

    doc.setTextColor("#0b68d4");
    doc.textWithLink(
        "Lien vers la documentation",
        15 + doc.getTextWidth("4. Modifiez le projet à votre guise. "),
        132,
        {
            url: `https://github.com/TimeoThms/PlanDeClasse/blob/main/README.md`,
        }
    );

    doc.save(`${projectData.filename}_IMG.pdf`);
}
