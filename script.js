// ===============================
// VERİLER
// ===============================

let userName = localStorage.getItem("userName") || "";

let tasks = JSON.parse(
    localStorage.getItem("tasks") || "[]"
);

let diaryPages = JSON.parse(
    localStorage.getItem("diaryPages") || '[""]'
);

let currentDiaryPage = 0;


// ===============================
// ELEMENTLER
// ===============================

const welcomeScreen = document.getElementById("welcome-screen");
const mainApp = document.getElementById("main-app");

const nameInput = document.getElementById("name-input");
const saveNameBtn = document.getElementById("save-name-btn");

const profileName = document.getElementById("profile-name");
const homeName = document.getElementById("home-name");


// ===============================
// İLK GİRİŞ
// ===============================

function startApp() {

    if (userName) {

        welcomeScreen.classList.add("hidden");
        mainApp.classList.remove("hidden");

        profileName.textContent = userName;
        homeName.textContent = userName;

        renderTaskEditor();
        renderTasks();
        loadDiary();
    }
}


// ===============================
// İSİM KAYDET
// ===============================

saveNameBtn.addEventListener("click", saveName);

nameInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        saveName();
    }

});

function saveName() {

    const name = nameInput.value.trim();

    if (name === "") {
        alert("Lütfen adını yaz!");
        return;
    }

    userName = name;

    localStorage.setItem("userName", userName);

    startApp();
}


// ===============================
// MENÜ
// ===============================

const menuButtons =
    document.querySelectorAll(".menu-btn");

const pages =
    document.querySelectorAll(".page");

menuButtons.forEach(button => {

    button.addEventListener("click", () => {

        const pageName =
            button.dataset.page;

        menuButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        pages.forEach(page => {
            page.classList.add("hidden");
        });

        document
            .getElementById(pageName + "-page")
            .classList.remove("hidden");


        if (pageName === "tasks") {
            renderTasks();
        }

        if (pageName === "edit-tasks") {
            renderTaskEditor();
        }

        if (pageName === "diary") {
            loadDiary();
        }

    });

});


// ===============================
// GÖREV DÜZENLEME
// ===============================

const taskEditor =
    document.getElementById("task-editor");

const addTaskBtn =
    document.getElementById("add-task-btn");

const saveTasksBtn =
    document.getElementById("save-tasks-btn");


function renderTaskEditor() {

    taskEditor.innerHTML = "";

    if (tasks.length === 0) {

        addTask("");

        return;
    }

    tasks.forEach(task => {

        addTask(task.name, false);

    });

}


function addTask(text = "", saveImmediately = true) {

    const row =
        document.createElement("div");

    row.className =
        "task-edit-row";


    const number =
        document.createElement("span");

    number.className =
        "task-number";


    const input =
        document.createElement("input");

    input.className =
        "task-input";

    input.type =
        "text";

    input.placeholder =
        "Görev yaz...";

    input.value =
        text;


    const deleteButton =
        document.createElement("button");

    deleteButton.className =
        "delete-task";

    deleteButton.textContent =
        "✕";


    deleteButton.addEventListener("click", () => {

        row.remove();

        updateTaskNumbers();

    });


    row.appendChild(number);
    row.appendChild(input);
    row.appendChild(deleteButton);

    taskEditor.appendChild(row);

    updateTaskNumbers();
}


function updateTaskNumbers() {

    const rows =
        document.querySelectorAll(".task-edit-row");

    rows.forEach((row, index) => {

        row.querySelector(".task-number")
            .textContent = `${index + 1}.`;

    });

}


addTaskBtn.addEventListener("click", () => {

    addTask("");

});


// ===============================
// GÖREVLERİ KAYDET
// ===============================

saveTasksBtn.addEventListener("click", () => {

    const inputs =
        document.querySelectorAll(".task-input");

    tasks = [];


    inputs.forEach(input => {

        const text =
            input.value.trim();

        if (text !== "") {

            tasks.push({
                name: text,
                completed: false
            });

        }

    });


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    renderTasks();

    alert("Görevlerin kaydedildi! ✅");

});


// ===============================
// GÖREV LİSTESİ
// ===============================

function renderTasks() {

    const taskList =
        document.getElementById("task-list");

    const noTasks =
        document.getElementById("no-tasks");

    const progressText =
        document.getElementById("progress-text");

    const progressPercent =
        document.getElementById("progress-percent");

    const progressFill =
        document.getElementById("progress-fill");

    const completionMessage =
        document.getElementById("completion-message");


    taskList.innerHTML = "";


    // GÖREV YOKSA

    if (tasks.length === 0) {

        noTasks.classList.remove("hidden");

        progressText.textContent =
            "0 / 0 görev tamamlandı";

        progressPercent.textContent =
            "0%";

        progressFill.style.width =
            "0%";

        completionMessage.classList.add("hidden");

        return;
    }


    noTasks.classList.add("hidden");


    // TAMAMLANAN GÖREVLER

    const completedTasks =
        tasks.filter(task => task.completed).length;

    const totalTasks =
        tasks.length;


    const percentage =
        Math.round(
            (completedTasks / totalTasks) * 100
        );


    // İLERLEME

    progressText.textContent =
        `${completedTasks} / ${totalTasks} görev tamamlandı`;

    progressPercent.textContent =
        `${percentage}%`;

    progressFill.style.width =
        `${percentage}%`;


    // HEPSİ BİTTİ Mİ?

    if (completedTasks === totalTasks) {

        completionMessage.classList.remove("hidden");

    } else {

        completionMessage.classList.add("hidden");

    }


    // GÖREVLER

    tasks.forEach((task, index) => {

        const item =
            document.createElement("div");

        item.className =
            "task-item";


        if (task.completed) {

            item.classList.add("completed");

        }


        const checkbox =
            document.createElement("div");

        checkbox.className =
            "task-checkbox";


        checkbox.textContent =
            task.completed ? "✓" : "✕";


        const name =
            document.createElement("span");

        name.className =
            "task-name";

        name.textContent =
            task.name;


        item.appendChild(checkbox);
        item.appendChild(name);


        // GÖREVE BASINCA ✓ / ✕

        item.addEventListener("click", () => {

            tasks[index].completed =
                !tasks[index].completed;


            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );


            renderTasks();

        });


        taskList.appendChild(item);

    });

}


// ===============================
// GÜNLÜK
// ===============================

const diaryText =
    document.getElementById("diary-text");

const diaryPageNumber =
    document.getElementById("diary-page-number");


function loadDiary() {

    if (diaryPages.length === 0) {

        diaryPages = [""];

    }


    diaryText.value =
        diaryPages[currentDiaryPage] || "";


    updateDiaryPageNumber();

}


function saveCurrentDiaryPage() {

    diaryPages[currentDiaryPage] =
        diaryText.value;


    localStorage.setItem(
        "diaryPages",
        JSON.stringify(diaryPages)
    );

}


function updateDiaryPageNumber() {

    diaryPageNumber.textContent =
        `Sayfa ${currentDiaryPage + 1} / ${diaryPages.length}`;

}


// Yazdıkça otomatik kaydet

diaryText.addEventListener("input", () => {

    saveCurrentDiaryPage();

});


// ===============================
// ÖNCEKİ SAYFA
// ===============================

document
    .getElementById("previous-page")
    .addEventListener("click", () => {

        saveCurrentDiaryPage();


        if (currentDiaryPage > 0) {

            currentDiaryPage--;

            loadDiary();

        }

    });


// ===============================
// SONRAKİ SAYFA
// ===============================

document
    .getElementById("next-page")
    .addEventListener("click", () => {

        saveCurrentDiaryPage();


        if (
            currentDiaryPage <
            diaryPages.length - 1
        ) {

            currentDiaryPage++;

        }


        loadDiary();

    });


// ===============================
// YENİ SAYFA
// ===============================

document
    .getElementById("add-diary-page")
    .addEventListener("click", () => {

        saveCurrentDiaryPage();


        diaryPages.push("");

        currentDiaryPage =
            diaryPages.length - 1;


        localStorage.setItem(
            "diaryPages",
            JSON.stringify(diaryPages)
        );


        loadDiary();

    });


// ===============================
// SAYFA SİL
// ===============================

document
    .getElementById("delete-diary-page")
    .addEventListener("click", () => {

        if (diaryPages.length === 1) {

            diaryPages[0] = "";

            currentDiaryPage = 0;

        } else {

            diaryPages.splice(
                currentDiaryPage,
                1
            );


            if (
                currentDiaryPage >=
                diaryPages.length
            ) {

                currentDiaryPage =
                    diaryPages.length - 1;

            }

        }


        localStorage.setItem(
            "diaryPages",
            JSON.stringify(diaryPages)
        );


        loadDiary();

    });


// ===============================
// BAŞLAT
// ===============================

startApp();