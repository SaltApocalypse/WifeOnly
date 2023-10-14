/* 常量定义 */
const urlsCanbeRefresh = ["chrome://newtab/", "edge://newtab/"];

/**
 * i18n
 */
function loadInnerText () {
    document.getElementById("label_single").textContent = chrome.i18n.getMessage("ui_label_single", user_language);
    document.getElementById("label_url").textContent = chrome.i18n.getMessage("ui_label_url", user_language);
    document.getElementById("input_url").placeholder = chrome.i18n.getMessage("ui_input_url", user_language);
    document.getElementById("input_url").setAttribute("title", chrome.i18n.getMessage("ui_input_url_title", user_language));
    document.getElementById("btn_url").textContent = chrome.i18n.getMessage("ui_btn_url", user_language);
    document.getElementById("label_file").textContent = chrome.i18n.getMessage("ui_label_file", user_language);
    document.getElementById("input_file").setAttribute("title", chrome.i18n.getMessage("ui_input_file_title", user_language));
    document.getElementById("label_multi").textContent = chrome.i18n.getMessage("ui_label_multi", user_language);
    document.getElementById("label_folder").innerText = chrome.i18n.getMessage("ui_label_folder", user_language);
    document.getElementById("input_folder").setAttribute("title", chrome.i18n.getMessage("ui_input_folder_title", user_language));
}


/**
 * DOM事件监听
 */
document.addEventListener("DOMContentLoaded", function () {
    loadInnerText(); // 加载i18n
    // refreshBackground(); // 加载背景

    /**
     * 用户模式设置
     * @param {number} mode - 0-默认 1-单图 2-本地随机图
     */
    function setUserMode (mode) {
        if (mode >= 0 && mode < 3)
            localStorage.setItem('userMode', mode);
        else
            console.log("Error: UserMode.")
    }


    /**
     * 刷新所有新标签页
     */
    function refreshBackground () {
        chrome.tabs.query({}, function (tabs) {
            for (let tab of tabs) {
                if (tab.url && urlsCanbeRefresh.includes(tab.url)) {
                    chrome.tabs.sendMessage(tab.id, { action: "refreshTab" });
                }
            }
        });
    }

    /**
     * 修改成功并存储URL
     * @param {string} url - 需要存储的URL
     */
    function storeURL (url) {
        localStorage.setItem(image_key, url);
        setUserMode(1);
        refreshBackground();
        alert(chrome.i18n.getMessage("actions_success"));
    }

    /* url输入 - 处理事件 */
    document.getElementById("btn_url").addEventListener("click", function () {
        var inputUrlValue = document.getElementById("input_url").value;
        inputUrlValue === "" ? alert(chrome.i18n.getMessage("actions_notapic")) : handleUrlInput(); // 空检测

        async function handleUrlInput () {
            try { // URL有效性检测
                const response = await fetch(inputUrlValue, { method: 'HEAD' });
                if (response.status === 200)
                    storeURL(inputUrlValue);
                else
                    alert(chrome.i18n.getMessage("actions_notapic"));
            } catch {
                alert(chrome.i18n.getMessage("actions_networkerror"));
            }
        }
    });

    /* 文件导入 - 处理事件 */
    document.getElementById("input_file").addEventListener("change", function (event) {
        var files = event.target.files;
        if (files && files.length > 0) {
            var url = URL.createObjectURL(files[0]); // 创建对象URL，解决大文件无法读取
            storeURL(url);
            URL.revokeObjectURL(selectedFile);
        }
    });

    /* 文件夹导入 - 处理事件 */
    document.getElementById("input_folder").addEventListener("change", function (event) {
        var files = event.target.files;
        var imageURLs = []; // 图片列表
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.type.startsWith('image/')) { // 检查文件类型以确保它是一个图片
                var objectUrl = URL.createObjectURL(file);
                imageURLs.push(objectUrl);
            }
        }
        localStorage.setItem('imageURLs', JSON.stringify(imageURLs));
        setUserMode(2);
        refreshBackground();
        alert(chrome.i18n.getMessage("actions_success"));
    });
});
/**
 * Links for test:
 * https://cdn.jsdelivr.net/gh/SaltApocalypse/CDN/WifeOnly/Test/1.png // png
 * https://cdn.jsdelivr.net/gh/SaltApocalypse/CDN/WifeOnly/Test/2.jpg // jpg
 * https://cdn.jsdelivr.net/gh/SaltApocalypse/CDN/WifeOnly/Test/2.png // **unavailable**
*/