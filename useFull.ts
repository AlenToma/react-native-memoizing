import cryptoJs from 'crypto-js';
import { Base64 } from 'js-base64'

const sleep = async (ms: number) => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

const days_between = function (date: Date) {
    // The number of milliseconds in one day
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let firstDate = date as any;
    let secondDate = new Date() as any;

    // Convert back to days and return
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    return diffDays;
}

const encrypt = (key: string, str: string) => {
    str = str.trim();
    if (!str.startsWith("¤¤")) { // already encrypted
        const d = cryptoJs.AES.encrypt(str, key).toString();
        return "¤¤" + Base64.btoa(d);
    }
    return str;

}

const decode = (key: string, str: string) => {
    str = str.trim();
    if (str.startsWith("¤¤")) {
        str = str.substring(2);
        str = Base64.atob(str);

        const bytes = cryptoJs.AES.decrypt(str, key);
        const originalText = bytes.toString(cryptoJs.enc.Utf8);
        return originalText as string;
    }

    return str;
}

export {
    sleep,
    days_between,
    encrypt,
    decode
}