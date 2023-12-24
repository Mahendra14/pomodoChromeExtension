const timeOption = document.getElementById("timeInput")
timeOption.addEventListener("change", (event) => {
    const val = event.target.value
    if (val < 1 || val > 60) {
        timeOption.value = 25
    }
})

const saveBtn = document.getElementById("saveBtn")
saveBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        timeOption: timeOption.value,
        isRunning: false,
    })
})

chrome.storage.local.get(["timeInput"], (res) => {
    timeOption.value = res.timeOption
})