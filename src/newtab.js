/* 背景元素 */
const NEWTAB = document.getElementById("body_newtab");

/* 首次安装监听 */
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install') {
        localStorage.setItem(KEY_USERMODE, 0);
    }
});

/* DOM事件监听 */
document.addEventListener("DOMContentLoaded", async function () {
    /* 语言获取 */
    document.documentElement.setAttribute("lang", USER_LANGUAGE);
    /* UI元素加载 */
    document.title = chrome.i18n.getMessage("ui_title_newtab", USER_LANGUAGE);

    /* 添加 refreshTab 监听 */
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.action == "refreshTab") {
                location.reload();
            }
        }
    );

    /* 用户模式读取 */
    const USER_MODE = await databaseFetch(KEY_USERMODE);
    newtabLoad(USER_MODE); // 启动时加载图片
});

/**
 * 图片加载
 * @param {number} mode - 用户模式
 */
function newtabLoad (mode) {
    if (undefined === mode || '0' === mode) { // 默认
        if ("zh-CN" === USER_LANGUAGE || "zh-TW" === USER_LANGUAGE || "zh-HK" === USER_LANGUAGE) {
            NEWTAB.style.background = "url(../images/default_image_zh.png)";
        }
        else {
            NEWTAB.style.background = "url(../images/default_image_en.png)";
        }
        newtabApplyStyles(NEWTAB, mode);
    }
    else if ('1' === mode) { // 使用单张图片
        databaseFetch(KEY_IMAGE).then((url) => {
            NEWTAB.style.background = "url(" + url + ")";
            newtabApplyStyles(NEWTAB, mode);
        }).catch((error) => {
            console.error(error);
        });
    }
    else if ('2' === mode) { // 调用图片API
        // databaseFetch(KEY_IMAGE).then((api) => {
        //     fetch(api).then(response => {
        //         if (!response.ok) {
        //             alert(chrome.i18n.getMessage("actions_networkerror"));
        //         }
        //         return response.json();
        //     }).then(data => {
        //         const URL = data.images;
        //         NEWTAB.style.background = "url(" + URL + ")";
        //         newtabApplyStyles(NEWTAB, mode);
        //     })
        // }).catch((error) => {
        //     console.error(error);
        // });
    }
    console.log("newtab: usermode " + mode + " loaded.");
}

/**
 * 单独写出来的背景样式设置
 * @param {*} NEWTAB - 背景目标
 * @param {*} mode - 用户模式，用来看看要不要居左
 */
function newtabApplyStyles (NEWTAB, mode) {
    NEWTAB.style.backgroundSize = "cover";
    NEWTAB.style.backgroundRepeat = "no-repeat";
    NEWTAB.style.backgroundPosition = (undefined === mode ? "left" : "center");
    NEWTAB.style.backgroundAttachment = "fixed";
}