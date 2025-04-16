const studentsList = document.getElementById("students-list");
const noStudent = document.getElementById("no-student");

let studentsIds = [];

function addStudent(name, surname, group) {
    const id = generateId().slice(3);
    studentsIds.push(id);
    const student = document.createElement("div");
    student.className = "student";
    student.id = `student-${id}`;
    student.innerHTML = `
    <p>${name}</p>
    <p>${surname}</p>
    <p>${group}</p>

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
    editIcon.addEventListener("click", () => {
        editStudent(id);
    });

    // Ajouter un événement click pour l'icône delete
    deleteIcon.addEventListener("click", () => {
        deleteStudent(id);
    });

    student.addEventListener("click", () => {
        // Select
    });

    studentsList.appendChild(student);
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
    const name = infos[0].textContent;
    const surname = infos[1].textContent;
    const group = infos[2].textContent;
    return { name: name, surname: surname, group: group };
}

function setStudentData(id, name, surname, group) {
    let student = getStudentElement(id);
    if (!student) return;
    const infos = student.querySelectorAll("p");
    infos[0].textContent = name;
    infos[1].textContent = surname;
    infos[2].textContent = group;
}

function deleteStudent(id) {
    element = getStudentElement(id);
    element.remove();
    studentsIds = studentsIds.filter((e) => e !== id);
    if (studentsIds.length == 0) {
        noStudent.hidden = false;
    }
}

// Manual student addition
const studentManualNameInput = document.getElementById(
    "student-manual-name-input"
);
const studentManualSurnameInput = document.getElementById(
    "student-manual-surname-input"
);
const studentManualGroupInput = document.getElementById(
    "student-manual-group-input"
);
const addStudentManualBtn = document.getElementById("add-student-manual-btn");

addStudentManualBtn.addEventListener("click", () => {
    addStudent(
        studentManualNameInput.value,
        studentManualSurnameInput.value,
        studentManualGroupInput.value
    );
    noStudent.hidden = true;
});

// Student editor
const studentEditor = document.getElementById("student-editor");

const studentEditorNameInput = document.getElementById(
    "student-editor-name-input"
);
const studentEditorSurnameInput = document.getElementById(
    "student-editor-surname-input"
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
    studentEditorNameInput.value = currentData.name;
    studentEditorSurnameInput.value = currentData.surname;
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
        studentEditorNameInput.value,
        studentEditorSurnameInput.value,
        studentEditorGroupInput.value
    );
    studentEditor.hidden = true;
});
