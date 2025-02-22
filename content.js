function removeBlockedVideos() {
    chrome.storage.sync.get(["blockedKeywords", "blockedChannels"], (data) => {
        const blockedKeywords = data.blockedKeywords || [];
        const blockedChannels = data.blockedChannels || [];
        
        let removedCount = 0;

        document.querySelectorAll("ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer").forEach((video) => {
            const titleElement = video.querySelector("#video-title");
            const channelElement = video.querySelector("ytd-channel-name a");

            if (!titleElement || !channelElement) return;

            const title = titleElement.textContent.toLowerCase();
            const channel = channelElement.textContent.toLowerCase();

            const shouldRemove = blockedKeywords.some(keyword => title.includes(keyword.toLowerCase())) ||
                                 blockedChannels.some(blocked => channel.includes(blocked.toLowerCase()));

            if (shouldRemove) {
                video.remove();
                removedCount++;
            }
        });

        console.log(`YouTube Filter: Removed ${removedCount} videos.`);
        chrome.action.setBadgeText({ text: removedCount ? removedCount.toString() : "" });
    });
}

document.addEventListener("DOMContentLoaded", removeBlockedVideos);
const observer = new MutationObserver(removeBlockedVideos);
observer.observe(document.body, { childList: true, subtree: true });
