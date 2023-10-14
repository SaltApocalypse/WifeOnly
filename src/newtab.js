/* 首次安装 */
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install') {
        localStorage.setItem(KEY_USERMODE, 0);
    }
});

/* DOM事件监听 */
document.addEventListener("DOMContentLoaded", function () {
    /* 语言获取 */
    document.documentElement.setAttribute("lang", USER_LANGUAGE);
    /* UI元素加载 */
    document.title = chrome.i18n.getMessage("ui_title_newtab", USER_LANGUAGE);

    /* 用户模式读取 */
    var user_mode = localStorage.getItem(KEY_USERMODE);

    /* 添加 refreshTab 监听 */
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.action == "refreshTab") {
                location.reload();
            }
        }
    );

    newtabLoad(user_mode); // 启动时加载
});

/**
 * 刷新图片
 */
function newtabLoad (mode) {
    var target = document.getElementById("body_newtab");

    if ('0' === mode || undefined === mode || null === mode) { // 默认
        if ("zh-CN" === USER_LANGUAGE || "zh-TW" === USER_LANGUAGE || "zh-HK" === USER_LANGUAGE) {
            target.style.background = "url(../images/default_image_zh.png)";
        }
        else {
            target.style.background = "url(../images/default_image_en.png)";
        }
    }
    else if ('1' === mode) { // 使用单张图片
        target.style.background = "url(" + localStorage.getItem(KEY_IMAGE) + ")";
    }
    else if ('2' === mode) { // 调用图片组
        //     var imageUrls = JSON.parse(localStorage.getItem('imageUrls'));
        //     if (imageUrls && imageUrls.length > 0) {
        //         var randomIndex = Math.floor(Math.random() * imageUrls.length);
        //         var selectedImageUrl = imageUrls[randomIndex];
        //         target.style.background = 'url(' + selectedImageUrl + ')';
        //     }
    }
    console.log("newtab: usermode " + mode + " loaded.");

    target.style.backgroundSize = "cover";
    target.style.backgroundRepeat = "no-repeat";
    target.style.backgroundPosition = "center 60%";
    target.style.backgroundAttachment = "fixed";
}
