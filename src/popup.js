/**
 * i18n
 */
function popupLoadInnerText () {
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
    console.log("popup: innerText loaded.");
}

/* DOM事件监听 */
document.addEventListener("DOMContentLoaded", async function () {
    popupLoadInnerText(); // 加载i18n

    /* url输入 - 处理事件 */
    document.getElementById("btn_url").addEventListener("click", function () {
        var inputUrl = document.getElementById("input_url").value;
        inputUrl === "" ? alert(chrome.i18n.getMessage("actions_notapic")) : handleUrlInput(); // 空检测

        async function handleUrlInput () {
            try { // URL有效性检测
                const RESPONSE = await fetch(inputUrl, { method: 'HEAD' });
                if (RESPONSE.status === 200) {
                    await databaseStore(KEY_IMAGE, inputUrl);
                    await databaseStore(KEY_USERMODE, '1');
                    newtabRefresh();
                    alert(chrome.i18n.getMessage("actions_success"));
                }
                else {
                    alert(chrome.i18n.getMessage("actions_notapic"));
                }
            } catch { // 无网络链接的时候会导致无法检测
                alert(chrome.i18n.getMessage("actions_networkerror"));
            }
        }
    });

    /* 文件导入 - 处理事件 */
    document.getElementById("input_file").addEventListener("change", function (event) {
        var files = event.target.files;
        if (files && files.length > 0) {
            var reader = new FileReader();
            reader.onload = function () {
                var url = reader.result;
                databaseStore(KEY_IMAGE, url);
                databaseStore(KEY_USERMODE, '1');
                newtabRefresh();
                alert(chrome.i18n.getMessage("actions_success"));
            }
            reader.readAsDataURL(files[0]);
        }
    });

    /* 文件夹导入 - 处理事件 */
    document.getElementById("input_folder").addEventListener("change", function (event) {
    });
});

/**
 * Links for test:
 * https://cdn.jsdelivr.net/gh/SaltApocalypse/CDN/WifeOnly/Test/1.png // png
 * https://cdn.jsdelivr.net/gh/SaltApocalypse/CDN/WifeOnly/Test/2.jpg // jpg
 * https://cdn.jsdelivr.net/gh/SaltApocalypse/CDN/WifeOnly/Test/2.png // **unavailable**
*/