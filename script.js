const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const dueDateInput = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");
const addSound = document.getElementById("addSound");
const deleteSound = document.getElementById("deleteSound");

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `${task.completed ? "completed" : ""} category-${task.category}`;
    li.setAttribute("draggable", "true");

    li.innerHTML = `
      <span>${task.text} <span class="task-category">[${task.category}]</span>
      ${task.dueDate ? `<br><small>📅 Due: ${task.dueDate}</small>` : ""}</span>
      <div>
        <button onclick="toggleComplete(${index})">✅</button>
        <button onclick="fadeDelete(${index}, this)">❌</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const category = categorySelect.value;
  const dueDate = dueDateInput.value;
  if (text === "") return;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, category, dueDate, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  dueDateInput.value = "";
  addSound.play();
  loadTasks();
}

function toggleComplete(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function fadeDelete(index, btn) {
  const li = btn.closest("li");
  li.classList.add("fade-out");
  deleteSound.play();
  setTimeout(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }, 300);
}

// Drag-and-drop sorting
taskList.addEventListener("dragstart", (e) => {
  if (e.target.tagName === "LI") {
    e.target.classList.add("dragging");
  }
});

taskList.addEventListener("dragend", (e) => {
  if (e.target.tagName === "LI") {
    e.target.classList.remove("dragging");
    saveNewOrder();
  }
});

taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const afterElement = [...taskList.children].find(
    (el) => el !== dragging && e.clientY < el.getBoundingClientRect().top + el.offsetHeight / 2
  );
  if (afterElement) {
    taskList.insertBefore(dragging, afterElement);
  } else {
    taskList.appendChild(dragging);
  }
});

function saveNewOrder() {
  const newTasks = [...taskList.children].map((li) => {
    const text = li.querySelector("span").childNodes[0].nodeValue.trim();
    const category = li.className.match(/category-(\w+)/)[1];
    const completed = li.classList.contains("completed");
    const dueDateMatch = li.innerHTML.match(/Due: (\d{4}-\d{2}-\d{2})/);
    const dueDate = dueDateMatch ? dueDateMatch[1] : "";
    return { text, category, dueDate, completed };
  });
  localStorage.setItem("tasks", JSON.stringify(newTasks));
}

addTaskBtn.addEventListener("click", addTask);
window.addEventListener("load", loadTasks);
