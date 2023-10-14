/* 常量定义 */
const KEY_IMAGE = "keyUrlImage";
const KEY_USERMODE = "keyUserMode";
const USER_LANGUAGE = chrome.i18n.getUILanguage();

/* 首次安装 */
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install') {
        localStorage.setItem(KEY_USERMODE, 0);
    }
});

/**
 * DOM事件监听
 */
document.addEventListener("DOMContentLoaded", function () {
    /* 语言获取 */
    document.getElementById("html").setAttribute("lang", USER_LANGUAGE);
    /* UI元素加载 */
    document.getElementById("title_newtab").innerText = chrome.i18n.getMessage("ui_title_newtab", USER_LANGUAGE);

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

    /**
     * 刷新图片
     */
    function newtabLoad () {
        var target = document.getElementById("body_newtab");

        if ('0' === user_mode || undefined === user_mode || null === user_mode) { // 默认
            if ("zh-CN" === USER_LANGUAGE || "zh-TW" === USER_LANGUAGE || "zh-HK" === USER_LANGUAGE) {
                target.style.background = "url(../images/default_image_zh.png)";
            }
            else {
                target.style.background = "url(../images/default_image_en.png)";
            }
        }
        else if ('1' === user_mode) { // 使用单张图片
            target.style.background = "url(" + localStorage.getItem(KEY_IMAGE) + ")";
        }
        else if ('2' === user_mode) { // 调用图片组
            //     var imageUrls = JSON.parse(localStorage.getItem('imageUrls'));
            //     if (imageUrls && imageUrls.length > 0) {
            //         var randomIndex = Math.floor(Math.random() * imageUrls.length);
            //         var selectedImageUrl = imageUrls[randomIndex];
            //         target.style.background = 'url(' + selectedImageUrl + ')';
            //     }
        }

        target.style.backgroundSize = "cover";
        target.style.backgroundRepeat = "no-repeat";
        target.style.backgroundPosition = "center 60%";
        target.style.backgroundAttachment = "fixed";
        newtabRefresh();
    }

    newtabLoad(); // 启动时加载
});