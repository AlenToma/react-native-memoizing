
"use strict";

class Cipher {

    b64_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    b64_encode(data: any) {
        var o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";
        if (!data) { return data; }
        do {
            o1 = data[i++];
            o2 = data[i++];
            o3 = data[i++];
            bits = o1 << 16 | o2 << 8 | o3;
            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;
            enc += this.b64_table.charAt(h1) + this.b64_table.charAt(h2) + this.b64_table.charAt(h3) + this.b64_table.charAt(h4);
        } while (i < data.length);
        r = data.length % 3;
        return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
    }

    b64_decode(data: string) {
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];
        if (!data) { return data; }
        data += "";
        do {
            h1 = this.b64_table.indexOf(data.charAt(i++));
            h2 = this.b64_table.indexOf(data.charAt(i++));
            h3 = this.b64_table.indexOf(data.charAt(i++));
            h4 = this.b64_table.indexOf(data.charAt(i++));
            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
            o1 = bits >> 16 & 0xff;
            o2 = bits >> 8 & 0xff;
            o3 = bits & 0xff;
            result.push(o1);
            if (h3 !== 64) {
                result.push(o2);
                if (h4 !== 64) {
                    result.push(o3);
                }
            }
        } while (i < data.length);
        return result;
    }

    keyCharAt(key: string, i: number) {
        return key.charCodeAt(Math.floor(i % key.length));
    }

    xor_encrypt(key: string, data: any) {
        return (data.map ? data: data.split("")).map((c: any, i: any) => {
            return c.charCodeAt(0) ^ this.keyCharAt(key, i);
        });
    }

    xor_decrypt(key: string, data: any) {
        return (data.map ? data: data.split("")).map((c: any, i: any) => {
            return String.fromCharCode(c ^ this.keyCharAt(key, i));
        }).join("");
    }
}


const XORCipher = {
    encode: function (key: string, data: string) {
        const cypger = new Cipher();
        const nData = cypger.xor_encrypt(key, data);
        return cypger.b64_encode(nData);
    },
    decode: function (key: string, data: string) {
        const cypger = new Cipher();
        const nData = cypger.b64_decode(data);
        return cypger.xor_decrypt(key, nData);
    }
};

export default XORCipher;


