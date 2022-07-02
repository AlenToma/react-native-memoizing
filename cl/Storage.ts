import { DataCache, IStorage } from "../types";
import { encrypt, decode, sleep } from '../useFull'

const SQLite = require("react-native-sqlite-2").default;

var db = SQLite.openDatabase('RNMemoizing.db', '1.0', '', 1);
export default class Storage implements IStorage {
    init: boolean = false;
    async validateTable() {
        if (!this.init) {
            await this.clean();
            this.init = true;
        }
        return new Promise<void>((resolve, reject) => {
            try {
                db.transaction(function (txn: any) {
                    console.log("tsCreated");
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS RNMemoizing (id INTEGER PRIMARY KEY AUTOINCREMENT, file text not null, data text NOT NULL, date text NOT NULL, daysToSave number not null)',
                        [],
                        resolve,
                        (e: any) => {
                            console.error("FileCacheMemo-validateTable", e);
                            reject(e);
                        });
                });
            } catch (e) {
                console.error(e);
            }
        })
    }


    async clean() {
        return new Promise<void>(async (resolve, reject) => {
            try {
                db.transaction(function (txn: any) {
                    txn.executeSql("DELETE FROM RNMemoizing", [], (ts: any, results: any) => {
                        resolve();
                    }, (e: any) => {
                        console.error("FileCacheMemo-clean", e);
                        reject(e);
                    });
                    return null;
                });
            } catch (e) {
                console.error("FileCacheMemo-clean", e);
                return null;
            }
        });
    }


    async set(file: string, value: DataCache, encryptionKey?: string) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await this.validateTable();
                db.transaction(function (txn: any) {
                    let jsonData = JSON.stringify(value);
                    if (encryptionKey !== undefined)
                        jsonData = encrypt(encryptionKey, jsonData);
                    txn.executeSql('INSERT INTO RNMemoizing (file, data, date, daysToSave) VALUES (?,?,?,?)', [file, jsonData, value.date.toISOString(), 1], () => {
                        resolve();
                    }, (e: any) => {
                        console.error("FileCacheMemo-set", e);
                        reject(e);
                    });
                });
                //  await AsyncStorage.setItem(file, jsonData);

            } catch (e) {
                console.error("FileCacheMemo-set", file, e, file);
            }
        });
    }

    async get(file: string, encryptionKey?: string) {
        return new Promise<DataCache>(async (resolve, reject) => {
            try {
                await this.validateTable();
                db.transaction(function (txn: any) {
                    txn.executeSql("select * from RNMemoizing where file=?", [file], (ts: any, results: any) => {
                        try {
                            const len = results.rows.length;
                            let item = undefined as any;
                            for (let i = 0; i < len; i++) {
                                item = results.rows.item(i);
                                break;
                            }

                            if (encryptionKey !== undefined)
                                item = decode(encryptionKey, item.data);
                            item = JSON.parse(item);

                            resolve(item);
                        } catch (e) {
                            console.error("FileCacheMemo-get", e);
                            reject(e);
                        }
                    }, (e: any) => {
                        console.error("FileCacheMemo-get", e);
                        reject(e);
                    });
                });
            } catch (e) {
                console.error("FileCacheMemo-get", e, file);
                return null;
            }
        });
    }

    async has(file: string) {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                await this.validateTable();
                db.transaction(function (txn: any) {
                    txn.executeSql("select * from RNMemoizing where file=?", [file], (ts: any, results: any) => {
                        const len = results.rows.length;
                        let item = undefined as any;
                        for (let i = 0; i < len; i++) {
                            item = results.rows.item(i);
                            break;
                        }

                        resolve(item != null && item != undefined);
                    }, (e: any) => {
                        console.error("FileCacheMemo-has", e);
                        reject(e);
                    });
                });
            } catch (e) {
                console.error("FileCacheMemo-has", e, file);
                return null;
            }
        });
    }

    async delete(...files: string[]) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await this.validateTable();
                db.transaction(function (txn: any) {
                    txn.executeSql("delete from RNMemoizing where file=?", [files[0]], (ts: any, results: any) => {
                        resolve();
                    }, (e: any) => {
                        console.error("FileCacheMemo-delete", e, files);
                        reject(e);
                    });
                    return null;
                });
            } catch (e) {
                console.error("FileCacheMemo-delete", e, files);
                return null;
            }
        });
    }

    async getFiles(files?: string[]) {
        return new Promise<string[]>(async (resolve, reject) => {
            try {
                await this.validateTable();
                db.transaction(function (txn: any) {
                    txn.executeSql("select * from RNMemoizing " + (files != undefined && files.length > 0 ? "where file in (" + files.map(x => "?") + ")" : ""), files != undefined && files.length > 0 ? files : [], (ts: any, results: any) => {
                        const len = results.rows.length;
                        let items = [];
                        for (let i = 0; i < len; i++) {
                            items.push(results.rows.item(i));
                            break;
                        }

                        resolve(items.map(x => x.file));
                    }, (e: any) => {
                        console.error("FileCacheMemo-getFiles", e, files);
                        reject(e);
                    });
                });
            } catch (e) {
                console.error("FileCacheMemo-getFiles", e, files);
                return null;
            }
        });
    }

}