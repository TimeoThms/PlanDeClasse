const studentsList = document.getElementById("students-list");
const noStudent = document.getElementById("no-student");

let studentsIds = [];

function addStudent(lastName, firstName, group) {
    const id = generateId().slice(3);
    studentsIds.push(id);
    const student = document.createElement("div");
    student.className = "student";
    student.id = `student-${id}`;
    student.innerHTML = `
    <p>${lastName}</p>
    <p>${firstName}</p>
    <p style="width: 60px">${group}</p>

    <svg class="student-icon edit" id="edit-icon-${id}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#415A77">
    <path d="M21.28 6.4L11.74 15.94C10.79 16.89 7.97 17.33 7.34 16.7C6.71 16.07 7.14 13.25 8.09 12.3L17.64 2.75C17.88 2.49 18.16 2.29 18.48 2.14C18.8 2 19.14 1.92 19.49 1.91C19.84 1.91 20.18 1.97 20.51 2.1C20.83 2.23 21.12 2.42 21.37 2.67C21.61 2.92 21.81 3.21 21.94 3.54C22.07 3.86 22.13 4.21 22.12 4.55C22.11 4.9 22.03 5.25 21.89 5.56C21.74 5.88 21.54 6.17 21.28 6.4Z" stroke="#415A77" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11 4H6C4.94 4 3.92 4.42 3.17 5.17C2.42 5.92 2 6.94 2 8V18C2 19.06 2.42 20.08 3.17 20.83C3.92 21.58 4.94 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#415A77" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <svg class="student-icon" id="delete-icon-${id}" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 7H20" stroke="#9d4848" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 10L7.7 19.36C7.87 20.31 8.7 21 9.67 21h4.66c.97 0 1.8-.69 1.97-1.64L18 10" stroke="#9d4848" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 5c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v2H9V5Z" stroke="#9d4848" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;

    const editIcon = student.querySelector(`#edit-icon-${id}`);
    const deleteIcon = student.querySelector(`#delete-icon-${id}`);

    // Ajouter un événement click pour l'icône edit
    editIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        editStudent(id);
    });

    // Ajouter un événement click pour l'icône delete
    deleteIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteStudent(id);
    });

    student.addEventListener("click", () => {
        // Select if not already
        if (id !== selectedStudent) {
            setSelectedStudent(id);
        }
    });

    studentsList.appendChild(student);

    if (!selectedStudent) {
        setSelectedStudent(id);
    }

    return id;
}

function getStudentElement(id) {
    if (studentsIds.includes(id)) {
        return document.getElementById(`student-${id}`);
    }
}

function getStudentData(id) {
    let student = getStudentElement(id);
    if (!student) return;
    const infos = student.querySelectorAll("p");
    const lastName = infos[0].textContent;
    const firstName = infos[1].textContent;
    const group = infos[2].textContent;
    return { lastName: lastName, firstName: firstName, group: group };
}

function setStudentData(id, lastName, firstName, group) {
    let student = getStudentElement(id);
    if (!student) return;
    const infos = student.querySelectorAll("p");
    infos[0].textContent = lastName;
    infos[1].textContent = firstName;
    infos[2].textContent = group;
}

function deleteStudent(id) {
    element = getStudentElement(id);
    element.remove();
    studentsIds = studentsIds.filter((e) => e !== id);
    if (studentsIds.length == 0) {
        noStudent.hidden = false;
    }
    if (id == selectedStudent) {
        selectedStudent = null;
    }
}

var selectedStudent;

function setSelectedStudent(id) {
    // Unselect previously selected student
    if (selectedStudent) {
        let previousSelectedElement = getStudentElement(selectedStudent);
        previousSelectedElement.classList.toggle("selected");
    }
    // Select the new one
    let newSelectedElement = getStudentElement(id);
    newSelectedElement.classList.toggle("selected");
    selectedStudent = id;
}

// Manual student addition
const studentManualLastNameInput = document.getElementById(
    "student-manual-last-name-input"
);
const studentManualFirstNameInput = document.getElementById(
    "student-manual-first-name-input"
);
const studentManualGroupInput = document.getElementById(
    "student-manual-group-input"
);
const addStudentManualBtn = document.getElementById("add-student-manual-btn");

addStudentManualBtn.addEventListener("click", () => {
    addStudent(
        studentManualLastNameInput.value,
        studentManualFirstNameInput.value,
        studentManualGroupInput.value
    );
    noStudent.hidden = true;
});

// Students list files management

const saveStudentsListBtn = document.getElementById("save-students-list-btn");
const studentsListInput = document.getElementById("students-list-input");

saveStudentsListBtn.addEventListener("click", () => {
    saveStudentsListToCSV();
});

studentsListInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    const extension = file.name.split(".").pop().toLowerCase();

    reader.onload = function (e) {
        const data = e.target.result;
        let jsonData;

        if (extension === "csv") {
            // CSV Logic
            const workbook = XLSX.read(data, { type: "string" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            jsonData = XLSX.utils.sheet_to_json(sheet);
        } else if (extension === "xlsx" || extension === "xls") {
            // XLSX Logic

            const workbook = XLSX.read(data, { type: "array" });

            // Get first sheet
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            // Check if A7 contains "Nom"
            const cell = sheet["A7"];
            if (
                !(
                    cell &&
                    cell.v &&
                    cell.v.toString().trim().toLowerCase() === "nom"
                )
            ) {
                alert(`Erreur dans le fichier ! Colonne "Nom" introuvable.`);
                return;
            }

            const size = XLSX.utils.decode_range(sheet["!ref"]); // Sheet size

            // Get the "Classe" column
            let groupColumn = null;
            for (let C = size.s.c; C <= size.e.c; ++C) {
                // Loop from first column (size.s.c) to last column (size.e.c)
                const cellCoords = XLSX.utils.encode_cell({ c: C, r: 6 }); // ligne 7 (index 6)
                const cell = sheet[cellCoords];
                // Check cell value and break if the "Classe" column is found
                if (
                    cell &&
                    cell.v &&
                    cell.v.toString().trim().toLowerCase() === "classe"
                ) {
                    classColumn = C;
                    break;
                }
            }

            if (classColumn === null) {
                alert(`Erreur dans le fichier ! Colonne "Classe" introuvable.`);
                return;
            }

            jsonData = [];

            // Browse the file until the last row and add each student to jsonData
            for (let R = 7; R <= size.e.r; ++R) {
                const nameCell = sheet[XLSX.utils.encode_cell({ c: 0, r: R })]; // Colonne A
                const classCell =
                    sheet[XLSX.utils.encode_cell({ c: classColumn, r: R })];

                if (nameCell && nameCell.v) {
                    const fullName = nameCell.v.toString();

                    const splitIndex = fullName.search(/[a-zà-ÿ]/) - 1; // Get the index of the first lowercase character and substract one to find the beggining of the firstName

                    let lastName = "";
                    let firstName = "";

                    if (splitIndex !== -1) {
                        lastName = fullName.substring(0, splitIndex).trim();
                        firstName = fullName.substring(splitIndex).trim();
                    } else {
                        // In case there is no lowercase character (should not happen)
                        lastName = fullName;
                        firstName = "";
                    }

                    jsonData.push({
                        lastName: lastName,
                        firstName: firstName,
                        group: classCell ? classCell.v.toString().trim() : "", // classCell data if the cell is defined, else empty string
                    });
                }
            }
        }

        loadStudentsList(jsonData);
    };

    if (extension === "csv") {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
});

function saveStudentsListToCSV() {
    let data = [];
    let groupSuffix = "";
    let consistentGroup = true;
    studentsIds.forEach((id) => {
        const studentData = getStudentData(id);
        data.push(studentData);
        // Set group suffix to the first student group, and then check if it's the same for every students
        if (groupSuffix === "") {
            groupSuffix = `_${studentData.group}`;
        } else if (groupSuffix !== `_${studentData.group}`) {
            consistentGroup = false;
        }
    });
    if (!consistentGroup) {
        groupSuffix = "";
    }
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(data));
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `liste_classe${groupSuffix}.csv`;
    link.click();
}

function loadStudentsList(data) {
    // Delete current list
    studentsIds.forEach((id) => deleteStudent(id));
    // Load new list
    data.forEach((student) => {
        addStudent(student.lastName, student.firstName, student.group);
    });
}

// Student editor
const studentEditor = document.getElementById("student-editor");

const studentEditorLastNameInput = document.getElementById(
    "student-editor-last-name-input"
);
const studentEditorFirstNameInput = document.getElementById(
    "student-editor-first-name-input"
);
const studentEditorGroupInput = document.getElementById(
    "student-editor-group-input"
);

const studentEditorCancelBtn = document.getElementById(
    "student-editor-cancel-btn"
);
const studentEditorSaveBtn = document.getElementById("student-editor-save-btn");

var editedStudentId;

function editStudent(id) {
    const currentData = getStudentData(id);
    studentEditorLastNameInput.value = currentData.lastName;
    studentEditorFirstNameInput.value = currentData.firstName;
    studentEditorGroupInput.value = currentData.group;
    editedStudentId = id;
    studentEditor.hidden = false;
}

studentEditorCancelBtn.addEventListener("click", () => {
    studentEditor.hidden = true;
});

studentEditorSaveBtn.addEventListener("click", () => {
    setStudentData(
        editedStudentId,
        studentEditorLastNameInput.value,
        studentEditorFirstNameInput.value,
        studentEditorGroupInput.value
    );
    studentEditor.hidden = true;
});
