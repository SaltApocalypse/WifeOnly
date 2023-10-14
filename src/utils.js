/* 存放可以被刷新的url */
const URL_CANBEREFRESH = ["chrome://newtab/", "edge://newtab/"];
/* 使用到的键 */
const KEY_IMAGE = "imageUrl";
const KEY_USERMODE = "userMode";
/* 用户语言 */
const USER_LANGUAGE = chrome.i18n.getUILanguage();

/**
 * 刷新所有新标签页
 */
function newtabRefresh () {
    chrome.tabs.query({}, function (tabs) {
        for (let tab of tabs) {
            if (tab.url && URL_CANBEREFRESH.includes(tab.url)) {
                chrome.tabs.sendMessage(tab.id, { action: "refreshTab" });
            }
        }
    });
    console.log("newtab: refreshed.");
}