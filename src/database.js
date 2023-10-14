/**
     * 数据库：打开数据库
     * @returns Promise((resolve, reject)
     */
function databaseOpen () {
    return new Promise((resolve, reject) => {
        var openRequest = indexedDB.open('wifeonly', 1);
        openRequest.onupgradeneeded = function (event) {
            event.target.result.createObjectStore('main'); // 创建对象存储
        };
        openRequest.onerror = function (event) {
            reject("数据库：数据库打开失败。");
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
    return new Promise((resolve, reject) => {
        databaseOpen().then(function (db) {
            var transaction = db.transaction(['main'], 'readwrite');
            var store = transaction.objectStore('main');
            var request = store.put(data, key);
            request.onsuccess = function (event) {
                resolve("数据库：数据存入成功。");
            };
            request.onerror = function (event) {
                reject(new Error("数据库：数据存入失败。"));
            };
        }).catch(function (error) {
            reject(error);
        });
    });
}

/**
 * 数据库：通过键读取值
 * @param {string} key 
 */
function databaseFetch (key) {
    return new Promise((resolve, reject) => {
        databaseOpen().then(function (db) {
            var transaction = db.transaction(['main'], 'readonly');
            var store = transaction.objectStore('main');
            var request = store.get(key);
            request.onsuccess = function (event) {
                console.log("数据库：成功获取 " + key + "。");
                resolve(request.result);
            };
            request.onerror = function (event) {
                reject(new Error("数据库：获取失败。"));
            };
        }).catch(function (error) {
            console.error(error);
        });
    });
}