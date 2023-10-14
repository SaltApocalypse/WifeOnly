/* 常量定义 */
const URL_CANBEREFRESH = ["chrome://newtab/", "edge://newtab/"];

/**
 * i18n
 */
function loadInnerText () {
    document.getElementById("label_single").textContent = chrome.i18n.getMessage("ui_label_single", USER_LANGUAGE);
    document.getElementById("label_url").textContent = chrome.i18n.getMessage("ui_label_url", USER_LANGUAGE);
    document.getElementById("input_url").placeholder = chrome.i18n.getMessage("ui_input_url", USER_LANGUAGE);
    document.getElementById("input_url").setAttribute("title", chrome.i18n.getMessage("ui_input_url_title", USER_LANGUAGE));
    document.getElementById("btn_url").textContent = chrome.i18n.getMessage("ui_btn_url", USER_LANGUAGE);
    document.getElementById("label_file").textContent = chrome.i18n.getMessage("ui_label_file", USER_LANGUAGE);
    document.getElementById("input_file").setAttribute("title", chrome.i18n.getMessage("ui_input_file_title", USER_LANGUAGE));
    document.getElementById("label_multi").textContent = chrome.i18n.getMessage("ui_label_multi", USER_LANGUAGE);
    document.getElementById("label_folder").innerText = chrome.i18n.getMessage("ui_label_folder", USER_LANGUAGE);
    document.getElementById("input_folder").setAttribute("title", chrome.i18n.getMessage("ui_input_folder_title", USER_LANGUAGE));
}

/**
 * DOM事件监听
 */
document.addEventListener("DOMContentLoaded", function () {
    loadInnerText(); // 加载i18n
    // newtabRefresh(); // 加载背景

    /**
     * 用户模式设置
     * @param {number} mode - 0-默认 1-单图 2-本地随机图
     */
    function setUserMode (mode) {
        if (mode >= 0 && mode < 3)
            localStorage.setItem(KEY_USERMODE, mode);
        else
            console.log("Error: UserMode.")
    }

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
    }

    /**
     * 用户模式1下，修改成功并存储URL
     * @param {string} url - 需要存储的URL
     */
    function storeURL (url) {
        localStorage.setItem(KEY_IMAGE, url);
        setUserMode(1);
        newtabRefresh();
        alert(chrome.i18n.getMessage("actions_success"));
    }

    /* url输入 - 处理事件 */
    document.getElementById("btn_url").addEventListener("click", function () {
        var inputUrlValue = document.getElementById("input_url").value;
        inputUrlValue === "" ? alert(chrome.i18n.getMessage("actions_notapic")) : handleUrlInput(); // 空检测

        async function handleUrlInput () {
            try { // URL有效性检测
                const RESPONSE = (await fetch(inputUrlValue, { method: 'HEAD' }));
                if (RESPONSE.status === 200) {
                    storeURL(inputUrlValue);
                }
                else {
                    alert(chrome.i18n.getMessage("actions_notapic"));
                }
            } catch {// 无网络链接的时候会导致无法检测
                alert(chrome.i18n.getMessage("actions_networkerror"));
            }
        }
    });

    /* 文件导入 - 处理事件 */
    document.getElementById("input_file").addEventListener("change", function (event) {
        // var files = event.target.files;
        // if (files && files.length > 0) {
        //     var reader = new FileReader();
        //     reader.onload = function (event) {
        //         chrome.storage.local.set({''})
        //     }
        // }
    });

    /* 文件夹导入 - 处理事件 */
    document.getElementById("input_folder").addEventListener("change", function (event) {
        // var files = event.target.files;
        // var imageURLs = []; // 图片列表
        // for (var i = 0; i < files.length; i++) {
        //     var file = files[i];
        //     if (file.type.startsWith('image/')) { // 检查文件类型以确保它是一个图片
        //         var objectUrl = URL.createObjectURL(file);
        //         imageURLs.push(objectUrl);
        //     }
        // }
        // localStorage.setItem('imageURLs', JSON.stringify(imageURLs));
        // setUserMode(2);
        // newtabRefresh();
        // alert(chrome.i18n.getMessage("actions_success"));
    });
});
/**
 * Links for test:
 * https://cdn.jsdelivr.net/gh/SaltApocalypse/CDN/WifeOnly/Test/1.png // png
 * https://cdn.jsdelivr.net/gh/SaltApocalypse/CDN/WifeOnly/Test/2.jpg // jpg
 * https://cdn.jsdelivr.net/gh/SaltApocalypse/CDN/WifeOnly/Test/2.png // **unavailable**
*/

/* 
var files = event.target.files;
        if (files && files.length > 0) {
            var url = URL.createObjectURL(files[0]); // 创建对象URL，解决大文件无法读取
            storeURL(url);
            URL.revokeObjectURL(selectedFile);
        }
        // FIXME: blob临时图片问题
*/