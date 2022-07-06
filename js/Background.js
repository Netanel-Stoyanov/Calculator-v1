chrome.storage.local.get("history", (result) => {
    if (!result.history) {
        chrome.storage.local.set({"history" : []}).then();
    }
})