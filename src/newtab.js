var image_key = "newtab_image";
var user_language = chrome.i18n.getUILanguage();

/* 首次安装 */
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install') {
        localStorage.setItem('userMode', 0);
    }
});

/**
 * DOM事件监听
 */
document.addEventListener("DOMContentLoaded", function () {
    /* 语言获取 */
    document.getElementById("html").setAttribute("lang", user_language);

    var usermode = localStorage.getItem('userMode'); // 用户模式

    chrome.storage.local.get(['userMode'], function (result) {
        let userMode = parseInt(result.userMode, 10);
        if (isNaN(userMode)) {
            userMode = 0;  // 或者你的默认模式
        }
        // switch()
    });


    /* 添加 refreshTab 监听 */
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.action == "refreshTab") {
                location.reload();
            }
        }
    );

    /* UI元素加载 */
    document.getElementById("title_newtab").innerText = chrome.i18n.getMessage("ui_title_newtab", user_language);

    /**
     * 刷新图片
     */
    function loadBodyBackground () {
        var target = document.getElementById("body_newtab");

        if ('0' === usermode || null === usermode) { // 默认
            if ("zh-CN" === user_language || "zh-TW" === user_language || "zh-HK" === user_language) {
                target.style.background = "url(../images/default_image_zh.png)";
            }
            else {
                target.style.background = "url(../images/default_image_en.png)";
            }
        }
        else if ('1' === usermode) { // 使用单张图片
            target.style.background = "url(" + localStorage.getItem(image_key) + ")";
        }
        // else if ('2' === usermode) { // 调用图片组
        //     var imageUrls = JSON.parse(localStorage.getItem('imageUrls'));
        //     if (imageUrls && imageUrls.length > 0) {
        //         var randomIndex = Math.floor(Math.random() * imageUrls.length);
        //         var selectedImageUrl = imageUrls[randomIndex];
        //         target.style.background = 'url(' + selectedImageUrl + ')';
        //     }
        // }

        target.style.backgroundSize = "cover";
        target.style.backgroundRepeat = "no-repeat";
        target.style.backgroundPosition = "center 60%";
        target.style.backgroundAttachment = "fixed";
        refreshBackground();
    }

    loadBodyBackground(); // 启动时加载
});