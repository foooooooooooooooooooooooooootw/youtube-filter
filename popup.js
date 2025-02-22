document.addEventListener("DOMContentLoaded", () => {
    const keywordInput = document.getElementById("keywordInput");
    const addKeywordBtn = document.getElementById("addKeyword");
    const keywordList = document.getElementById("keywordList");

    const channelInput = document.getElementById("channelInput");
    const addChannelBtn = document.getElementById("addChannel");
    const channelList = document.getElementById("channelList");

    function updateUI(listElement, items) {
        listElement.innerHTML = "";
        items.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${item} <span class="remove" data-index="${index}">❌</span>`;
            listElement.appendChild(li);
        });
    }

    function loadFilters() {
        chrome.storage.sync.get(["blockedKeywords", "blockedChannels"], (data) => {
            updateUI(keywordList, data.blockedKeywords || []);
            updateUI(channelList, data.blockedChannels || []);
        });
    }

    function saveFilter(type, inputElement, listElement) {
        const newValue = inputElement.value.trim();
        if (!newValue) return;

        chrome.storage.sync.get([type], (data) => {
            const updatedList = [...(data[type] || []), newValue];
            chrome.storage.sync.set({ [type]: updatedList }, loadFilters);
        });

        inputElement.value = "";
    }

    function removeFilter(type, index) {
        chrome.storage.sync.get([type], (data) => {
            const updatedList = (data[type] || []).filter((_, i) => i !== index);
            chrome.storage.sync.set({ [type]: updatedList }, loadFilters);
        });
    }

    addKeywordBtn.addEventListener("click", () => saveFilter("blockedKeywords", keywordInput, keywordList));
    addChannelBtn.addEventListener("click", () => saveFilter("blockedChannels", channelInput, channelList));

    keywordList.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove")) {
            removeFilter("blockedKeywords", Number(event.target.dataset.index));
        }
    });

    channelList.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove")) {
            removeFilter("blockedChannels", Number(event.target.dataset.index));
        }
    });

    loadFilters();
});
