// ==========================================
// 1. SELECT HTML ELEMENTS
// ==========================================

const form = document.querySelector("form");

const taskInput = document.querySelector("#taskInput");
const dateInput = document.querySelector("#dateInput");

const selects = document.querySelectorAll("select");

const categoryInput = selects[0];
const priorityInput = selects[1];

const taskList = document.querySelector("#taskList");

const allFilter = document.querySelector("#allFilter");
const activeFilter = document.querySelector("#activeFilter");
const doneFilter = document.querySelector("#doneFilter");

const progressText = document.querySelector("#progressText");

const progressPercentageElement =
    document.querySelector("#progressPercentage");

const progressBar = document.querySelector("#progressBar");    
const currentDate = document.querySelector("#currentDate");
// ==========================================
// 2. STORE ALL TASKS
// ==========================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ==========================================
// 3. ADD NEW TASK
// ==========================================

form.addEventListener("submit", function (event) {

    // Stop form from refreshing the page
    event.preventDefault();

    // Get task title
    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter the task title.");
        return;
    }

    // Create a new task object
    const newTask = {

        id: Date.now(),

        title: title,

        date: dateInput.value,

        category: categoryInput.value,

        priority: priorityInput.value,

        completed: false
    };

    // Add task to tasks array
    tasks.push(newTask);

    // Save tasks
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Display tasks
    renderTasks();

    // Clear task input
    taskInput.value = "";

});


// ==========================================
// 4. RENDER TASKS
// ==========================================

function renderTasks() {

    // Clear existing task list
    taskList.innerHTML = "";


    // ======================================
    // PROGRESS CALCULATION
    // ======================================

    const completedTasks = tasks.filter(function (task) {

        return task.completed === true;

    });

    const totalTasks = tasks.length;

    const completedCount = completedTasks.length;

    let progressPercentage = 0;

    if (totalTasks > 0) {

        progressPercentage = Math.round(
            (completedCount / totalTasks) * 100
        );

    }

    // Update progress text
    progressText.textContent =
        `${completedCount} of ${totalTasks} tasks completed`;

    // Update percentage
    progressPercentageElement.textContent =
        `${progressPercentage}%`;
    progressBar.style.width = `${progressPercentage}%`;    


    // ======================================
    // FILTER TASKS
    // ======================================

    let filteredTasks = tasks;


    // Show only active tasks
    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function (task) {

            return task.completed === false;

        });

    }


    // Show only completed tasks
    if (currentFilter === "done") {

        filteredTasks = tasks.filter(function (task) {

            return task.completed === true;

        });

    }


    // ======================================
    // CREATE TASK CARDS
    // ======================================

    filteredTasks.forEach(function (task) {

        const article = document.createElement("article");


        // Card styling
        article.className =
            "flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4";


        // Card HTML
        article.innerHTML = `

            <!-- Complete checkbox -->

            <input
                type="checkbox"
                class="task-checkbox h-4 w-4 accent-black"
                data-id="${task.id}"
                ${task.completed ? "checked" : ""}
            >


            <!-- Task information -->

            <div class="flex-1">

                <h4 class="text-sm font-medium ${
                    task.completed
                        ? "text-gray-400 line-through"
                        : ""
                }">

                    ${task.title}

                </h4>


                <div class="mt-1 flex gap-3 text-xs text-gray-400">

                    <span>${task.category}</span>

                    <span>•</span>

                    <span>${task.priority} Priority</span>

                </div>

            </div>


            <!-- Edit button -->

            <button
                class="edit-btn text-sm text-gray-400 hover:text-black"
                data-id="${task.id}"
            >
                Edit
            </button>


            <!-- Delete button -->

            <button
                class="delete-btn text-sm text-gray-400 hover:text-red-500"
                data-id="${task.id}"
            >
                Delete
            </button>

        `;


        // Add card to task list
        taskList.appendChild(article);

    });


    // ======================================
    // 5. DELETE TASK
    // ======================================

    const deleteButtons =
        document.querySelectorAll(".delete-btn");


    deleteButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            // Get task ID
            const id = Number(this.dataset.id);


            // Remove task
            tasks = tasks.filter(function (task) {

                return task.id !== id;

            });


            // Save updated tasks
            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );


            // Render updated list
            renderTasks();

        });

    });


    // ======================================
    // 6. EDIT TASK
    // ======================================

    const editButtons =
        document.querySelectorAll(".edit-btn");


    editButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            // Get task ID
            const id = Number(this.dataset.id);


            // Find task
            const task = tasks.find(function (task) {

                return task.id === id;

            });


            // Ask for new title
            const newTitle =
                prompt(
                    "Enter new task title:",
                    task.title
                );


            // Update task
            if (
                newTitle !== null &&
                newTitle.trim() !== ""
            ) {

                task.title = newTitle.trim();


                // Save changes
                localStorage.setItem(
                    "tasks",
                    JSON.stringify(tasks)
                );


                // Render updated task
                renderTasks();

            }

        });

    });


    // ======================================
    // 7. COMPLETE / UNCOMPLETE TASK
    // ======================================

    const checkboxes =
        document.querySelectorAll(".task-checkbox");


    checkboxes.forEach(function (checkbox) {

        checkbox.addEventListener("change", function () {

            // Get task ID
            const id = Number(this.dataset.id);


            // Find task
            const task = tasks.find(function (task) {

                return task.id === id;

            });


            // Update completed status
            task.completed = this.checked;


            // Save changes
            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );


            // Render updated task
            // This also updates the progress
            renderTasks();

        });

    });

}


// ==========================================
// 8. FILTER BUTTONS
// ==========================================

allFilter.addEventListener("click", function () {

    currentFilter = "all";

    renderTasks();

});


activeFilter.addEventListener("click", function () {

    currentFilter = "active";

    renderTasks();

});


doneFilter.addEventListener("click", function () {

    currentFilter = "done";

    renderTasks();

});


// ==========================================
// 9. INITIAL RENDER
// ==========================================

// Load saved tasks and progress
renderTasks();

// ==========================================
// 10. date upddte
// ==========================================
const today = new Date();

currentDate.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
});