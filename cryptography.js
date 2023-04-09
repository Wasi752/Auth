//Checking the crypto module
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//Encrypting text
function encrypt(id, type) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(id + ":" + type + ":" + getCurrentDate());
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), code: encrypted.toString('hex') };
}

// Decrypting text
function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.code, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
function getCurrentDate() {
    const today = new Date();
    return today.getFullYear() + '.' + today.getMonth() + '.' + today.getDate();
}
function check(userType, code) {
    try {
        const decrypted = decrypt(code)
        const [_, type, date] = decrypted.split(':')
        return type === userType && date === getCurrentDate();
        // if (parseInt(id) === user && pass === password && parseInt(date) === getCurrentDate()) {
        //     return true;
        // } else {
        //     return false;
        // }
    } catch (e) {
        return false;
    }
}
module.exports = { encrypt, decrypt, check }