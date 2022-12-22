/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by brais, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */

/* global indexedDB, IDBKeyRange */

'use strict';

var IDBManager = {
    dbName: '',
    storeName: '',
    key: '',
    initialize: function (dbName, storeName, key, indexes) {
        return new Promise((resolve, reject) => {
            if (!dbName)
                reject(new Error('Database name has not been provided')); 

            if (!storeName)
                reject(new Error('Store name has not been provided')); 

            IDBManager.dbName = dbName;
            IDBManager.storeName = storeName;
            IDBManager.key = key;

            if (indexes)
                indexes = JSON.parse(indexes);

            // This first deletes any database of the same name
            let dRequest = indexedDB.deleteDatabase(IDBManager.dbName);
            dRequest.onerror = () => reject(dRequest.error);

            // Open or create the specified database
            let request = indexedDB.open(IDBManager.dbName);
            request.onupgradeneeded = () => {
                let db = request.result;
                let store;
                if (key) {
                    store = db.createObjectStore(IDBManager.storeName, {keyPath: key});
                }
                else {
                    store = db.createObjectStore(IDBManager.storeName);
                }
                resolve({message: 'Database and store created'});
                if (indexes && indexes.length) {
                    for (let i = 0; i < indexes.length; i++) {
                        if (indexes[i].props) {
                            store.createIndex(indexes[i].name, indexes[i].value, indexes[i].props);
                            continue;
                        }
                        store.createIndex(indexes[i].name, indexes[i].value);
                    }
                }
            };
            request.onerror = () => reject(request.error);
        });
    },
    get: function (key, index) {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open(IDBManager.dbName);
            request.onsuccess = () => {
                let db = request.result;
                let tx = db.transaction(IDBManager.storeName, 'readonly');
                let st = tx.objectStore(IDBManager.storeName);
                if (!isNaN(key))
                    key = Number(key);
                let gRequest;
                if (index) {
                    index = st.index(index);
                    gRequest = index.getAll(key);
                }
                else
                    gRequest = st.get(key);
                gRequest.onsuccess = () => resolve(gRequest.result);
                gRequest.onerror = () => reject(gRequest.error);
            };
            request.onerror = () => reject(request.error);
        });
    },
    set: function (key, value) {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open(IDBManager.dbName);
            request.onsuccess = () => {
                    let db = request.result;
                    let tx = db.transaction(IDBManager.storeName, 'readwrite');
                    let st = tx.objectStore(IDBManager.storeName);
                    let sRequest;
                    if (key && !IDBManager.key)
                        sRequest = st.put(value, key);
                    else
                        sRequest = st.put(value);

                    sRequest.onsuccess = () => resolve(sRequest.result);
                    sRequest.onerror = () => reject(sRequest.error);
            };
            request.onerror = () => reject(request.error);
        });
    },
    remove: function (key, index) {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open(IDBManager.dbName);
            request.onsuccess = () => {
                let db = request.result;
                let tx = db.transaction(IDBManager.storeName, 'readwrite');
                let st = tx.objectStore(IDBManager.storeName);
                if (!isNaN(key))
                    key = Number(key);
                if (!index) {
                    let rRequest = st.delete(key);
                    rRequest.onsuccess = () => resolve({message: 'Entry identified by: ' + key + ' deleted'});
                    rRequest.onerror = () => reject(rRequest.error);
                }  
                else {
                    index = st.index(index);
                    let cRequest = index.openCursor(IDBKeyRange.only(key));
                    cRequest.onsuccess = () => {
                        let errors = [];
                        let cursor = cRequest.result;
                        if (cursor) {
                            let rRequest = st.delete(cursor.primaryKey);
                            rRequest.onerror = () => errors.push(rRequest.error);
                            cursor.continue();
                        }
                        else {
                            if (errors.length)
                                reject(new Error('There were some errors while deleting data by index: ' + index +  ' and value: ' + key));
                            else
                                resolve({message: 'All data have been deleted successfully by index: ' + index +  ' and value: ' + key});
                        }
                    };
                    cRequest.onerror = () => reject(cRequest.error); 
                }
                
            };
            request.onerror = () => reject(request.error);
        });
    }
};