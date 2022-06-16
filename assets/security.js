
import CryptoJS from "crypto-js"


export function encrypt(plainText)
{
    return CryptoJS.AES.encrypt(plainText, process.env.ENCRYPTION_SECRET).toString();
}

// Decrypt
export function decrypt(cipherText)
{
    try{
        var bytes  = CryptoJS.AES.decrypt(cipherText, process.env.ENCRYPTION_SECRET);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    catch(err)
    {
        return false
    }
}


