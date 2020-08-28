import CryptoJS from 'crypto-js'
//收款加密方法
export function Encrypt(word) {
    var key = CryptoJS.enc.Utf8.parse("SynqciFinancial0");   
    //偏移量
    var srcs = CryptoJS.enc.Utf8.parse(word);  
    //算法
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});  
    //替换--防止值为“1”的情况
    var reg = new RegExp('/',"g");
    return encrypted.toString().replace(reg,"#"); 
}
//收款解密方法
export function dEncrypt(word) {
    var key = CryptoJS.enc.Utf8.parse("SynqciFinancial0");   
    //算法
    var encrypted = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});  
    return CryptoJS.enc.Utf8.stringify(encrypted).toString(); 
}