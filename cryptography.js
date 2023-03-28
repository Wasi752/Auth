//Checking the crypto module
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//Encrypting text
function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text + ":" + getCurrentDate());
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypting text
function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
function getCurrentDate() {
    const today = new Date();
    return today.getFullYear() + today.getMonth() + today.getDay();
}
function check(password, code) {
    const decrypted = decrypt(code)
    const [pass, date] = decrypted.split(':')
    if (pass === password && parseInt(date) === getCurrentDate()) {
        return true;
    } else {
        return false;
    }
}
module.exports = { encrypt, decrypt, check }