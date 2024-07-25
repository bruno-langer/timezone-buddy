let actualTime = 0
const categoryColors = {
    "0": "#1a6955",
    "1": "#F4BF3E",
    "2": "#F43E3E",
}
const categoryText = {
    "0": " 👌",
    "1": "⏰",
    "2": "⛔",
}


setInterval(() => {
    fetch('/ping.txt')
    chrome.storage?.local.get(['myZones'], (result) => {
        if (result.myZones) {
            const zonesList = result.myZones
            zonesList.forEach((zone) => {
                // const localTime = DateTime.now().setZone(zone.zoneName);
                const localTime = new Date().toLocaleString('en-US', { timeZone: zone.zoneName })
                date = new Date(localTime)
                const zoneTime = (date.getHours() >= 7 && date.getHours() <= 20) ? (date.getHours() >= 8 && date.getHours() <= 18) ? 0 : 1 : 2
                actualTime = zoneTime > actualTime ? zoneTime : actualTime

            })
        }
    })

    chrome.action.setIcon({ path: { "16": `icons/icon${actualTime}.png` } })
        .catch((err) => console.error(err))

}, 20000)
