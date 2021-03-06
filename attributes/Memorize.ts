import { DataCache, MemorizeOptions } from '../types'
import { sleep, days_between } from '../useFull';
import { getStorage } from '..';

const getKey = (option: MemorizeOptions, propertyName: string, target: any, ...args: any[]) => {
    let key = JSON.stringify(args) + propertyName;
    key = "memoizing." + key.replace(/(\/|-|\.|:|"|'|\{|\}|\[|\]|\,| |\’)/gmi, "").toLowerCase()
    if (option.keyModifier !== undefined)
        key += option.keyModifier(target, key);
    return key.toLowerCase() + ".json";
}

const callingFun = new Map<string, boolean>();


export default function Memorize(option: MemorizeOptions) {
    if (!option.storage)
        option.storage = getStorage();
    if (!option.storage) {
        console.error("storage cannnot be null");
        throw "storage cannnot be null";
    }

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const currentFn = descriptor.value as (...args: any[]) => Promise<any>;
        descriptor.value = async function (...args: any[]) {
            const key = getKey(option, propertyKey, this, args);
            while (callingFun.has(key))
                await sleep(10);
            let data = null as DataCache | null;
            callingFun.set(key, true)
            try {
                if (option.storage) {
                    if (await option.storage.has(key) && !option.isDebug) {
                        data = await option.storage.get(key, option.encryptionKey);
                    }
                    if (data && typeof data.date === "string")
                        data.date = new Date(data.date);

                    if (!data || days_between(data.date) >= option.daysToSave) {
                        try {
                            let data2 = await currentFn.bind(this)(...args);
                            if (!option.isDebug) {
                                if (data2) {
                                    if (!option.validator || option.validator(data2)) {
                                        if (data)
                                            await option.storage.delete(key);
                                        await option.storage.set(key, { date: new Date(), data: data2 }, option.encryptionKey);
                                        return data2;
                                    } else {
                                        if (data) {
                                            await option.storage.delete(key);
                                            data.date = new Date();
                                            await option.storage.set(key, data, option.encryptionKey); // extend the date
                                        }
                                        return data?.data ?? data2;
                                    }
                                }
                            } else data = { data: data2, date: new Date() };
                        } catch (e) {
                            console.error("MemoizingError", e);
                        }
                    }
                }
                return data?.data;
            } catch (e) {
                console.error("MemoizingError", e);
            } finally {
                callingFun.delete(key);
            }
        }

    }
}