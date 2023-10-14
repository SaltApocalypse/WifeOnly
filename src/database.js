/**
     * 数据库：打开数据库
     * @returns Promise((resolve, reject)
     */
function databaseOpen () {
    return new Promise((resolve, reject) => {
        var openRequest = indexedDB.open('wifeonly', 1);
        openRequest.onupgradeneeded = function (event) {
            var db = event.target.result;
            db.createObjectStore('images'); // 创建对象存储
        };
        openRequest.onerror = function (event) {
            reject("数据库打开失败。");
        };
        openRequest.onsuccess = function (event) {
            resolve(event.target.result);
        };
    });
}

/**
 * 数据库：存入键值对
 * @param {string} key 
 * @param {string} data 
 */
function databaseStore (key, data) {
    databaseOpen().then(function (db) {
        var transaction = db.transaction(['images'], 'readwrite');
        var store = transaction.objectStore('images');
        var request = store.put(data, key);
        request.onsuccess = function (event) {
            console.log("数据库：数据存入成功。");
        };
        request.onerror = function (event) {
            console.log("数据库：数据存入失败。");
        };
    }).catch(function (err) {
        console.log(err);
    });
}

/**
 * 数据库：通过键读取值
 * @param {string} key 
 */
function databaseFetch (key) {
    databaseOpen().then(function (db) {
        var transaction = db.transaction(['images'], 'readonly');
        var store = transaction.objectStore('images');
        var request = store.get(key);
        request.onsuccess = function (event) {
            if (request.result) {
                console.log("Data fetched successfully");
                // 你可以使用 event.target.result 来获取到数据
            } else {
                console.log("No data found");
            }
        };
        request.onerror = function (event) {
            console.log("Error fetching data");
        };
    }).catch(function (err) {
        console.log(err);
    });
}