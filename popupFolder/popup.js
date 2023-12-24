let tasks = []

function updateTime() {
    chrome.storage.local.get(["timer", "timeOption", "isRunning"], (res) => {
        const time = document.getElementById("timeShown")
        const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0")
        let seconds = "00"
        if (res.timer % 60 != 0) {
            seconds = `${60 - res.timer % 60}`.padStart(2, "0")
        }
        time.textContent = `${minutes}:${seconds}`
        startTimerBtn.textContent = res.isRunning ? "Pause, :-)" : "Let's Begin!"
    })
}

// I am trying to run updateTime for every second, here I will update the timer value
updateTime()
setInterval(updateTime, 1000)

const startTimerBtn = document.getElementById("startBtn")
startTimerBtn.addEventListener("click", () => {
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            startTimerBtn.textContent = !res.isRunning ? "Pause, :-)" : "Let's Begin!"
        })
    })
})

const resetTimerBtn = document.getElementById("resetBtn")
resetTimerBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
    }, () => {
        startTimerBtn.textContent = "Let's Begin!"
    })
})

const addTaskBtn = document.getElementById("addBtn")
addTaskBtn.addEventListener("click", () => addTask())

chrome.storage.sync.get(["tasks"], (res) => {
    tasks = res.tasks ? res.tasks : []
    renderTasks()
})

function saveTasks() {
    chrome.storage.sync.set({
        tasks,
    })
}

function renderTask(taskNum) {
    const taskRow = document.createElement("div")

    const text = document.createElement("input")
    text.type = "text"
    text.placeholder = "What are we adding to the plate?"
    text.value = tasks[taskNum]
    text.className = "taskInput"
    text.addEventListener("change", () => {
        tasks[taskNum] = text.value
        saveTasks()
    })

    const deleteBtn = document.createElement("input")
    deleteBtn.type = "button"
    deleteBtn.value = "X"
    deleteBtn.className = "taskDelete"
    deleteBtn.addEventListener("click", () => {
        deleteTask(taskNum)
    })

    taskRow.appendChild(text)
    taskRow.appendChild(deleteBtn)

    const taskContainer = document.getElementById("taskContainer")
    taskContainer.appendChild(taskRow)
}

function addTask() {
    const taskNum = tasks.length
    tasks.push("")
    renderTask(taskNum)
    saveTasks()
}

function deleteTask(taskNum) {
    tasks.splice(taskNum, 1)
    renderTasks()
    saveTasks()
}

function renderTasks() {
    const taskContainer = document.getElementById("taskContainer")
    taskContainer.textContent = ""
    tasks.forEach((taskText, taskNum) => {
        renderTask(taskNum)
    })
}
