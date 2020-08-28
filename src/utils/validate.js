

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
/** 版本号 */
export function validatVersion(rule, value, callback) {
  const reg = /^\d+\.\d+\.\d+$/
  if (!reg.test(value)) { callback(new Error('请输入正确的版本号')); }
  callback();
}
/** 版本升级URL */
export function validatDwnloadUrl(rule, value, callback) {
  const reg =  /(http|https|ftp):\/\/([\w.]+\/?)\S*/
  if (!reg.test(value)) { callback(new Error('请输入正确的下载地址')); }
  callback();
}
/* 大小写英文字母+数字组合 6位到18位 支持下划线 */
export function validatePass(rule, value, callback) {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d_]{6,18}$/;
  if ((rule.skipAdmin == undefined || rule.skipAdmin == false) && value === 'admin') { callback(); return; }
  if (value.trim() === '') { callback(new Error('不能为空')); return; }
  if (value.trim().length < 6) { callback(new Error('长度最小6位')); return; }
  if (!reg.test(value)) { callback(new Error('必须包含大小写英文字母+数字组合 6位到18位 支持下划线')); return; }
  callback();
}
/** 账号规则  */
export function validateUserName(rule, value, callback) {
  const reg = /^[0-9a-zA-Z]{1,35}$/;
  if ((rule.skipAdmin == undefined || rule.skipAdmin == false) && value === 'admin') { callback(); return; }
  if (value.trim() === '') { callback(new Error('不能为空')); return; }
  if (!reg.test(value)) { callback(new Error('账号必须是大小写英文字母或数字')); return; }
  callback();
}
/** 规格规则验证 */
export function validateSpecificationCode(rule, value, callback) {
  const reg = /^[0-9A-Z]{1,2}$/;
  const regTwo = /^[0-9A-Z]{2,2}$/;
  if (value.trim() === '') { callback(new Error('不能为空')); return; }
  if (!reg.test(value)) { callback(new Error('必须是大写英文字母或数字')); return; }
  if (!regTwo.test(value)) { callback(new Error('必须两位')); return; }
  callback();
}
/**
 * @Date: 2019-11-07 17:30:14
 * @description: 商品中心=>商品颜色编码验证只能是两位数字
 * @author: elephant
 * @param {type} 
 * @return: callback
 */
export function validateColorCode(rule, value, callback) {
  const reg = /^[0-9]{1,2}$/;
  const regTwo = /^[0-9]{2,2}$/;
  if (value.trim() === '') { callback(new Error('不能为空')); return; }
  if (!reg.test(value)) { callback(new Error('必须是数字')); return; }
  if (!regTwo.test(value)) { callback(new Error('必须两位')); return; }
  callback();
}
/**
 * @description: 卡券 => 面额验证   自然数 大于0 小于10000
 * @author: elephant
 * @param {type} 
 * @return: callback
 * @Date: 2019-10-12 16:27:30
 */
export function validateNaturalNumber(rule, value, callback) {
  const reg = /^[0-9]*$/;
  if (value <= 0 ) { callback(new Error('不能输入小于0')); return; }
  if(rule.field == "validityPeriod"){
    if (value > 100 ) { callback(new Error('不能输入大于100')); return; }
  }else{
    if (value > 10000 ) { callback(new Error('不能输入大于10000')); return; }
  }
  if (!reg.test(value)) { callback(new Error('请输入自然数')); return; }
  callback();
}
/**
 * @description: 卡券 => 折扣验证   0.1> str <9.9
 * @author: elephant
 * @param {type} 
 * @return: callback
 * @Date: 2019-10-12 16:27:30
 */
export function validateDiscount(rule, value, callback) {
  //const reg =/^(?=0\.[1-9]|[1-9]\.\d).{3}$|^([2-9])$/;
  const reg =/^\d(\.\d?)?$/g;
  if (value <= 0 ) { callback(new Error('不能输入小于0')); return; }
  if (!reg.test(value)) { callback(new Error('不能大于9.9或小于0.1')); return; }
  callback();
}
/**正数 */
export function validatePositiveNumber(rule, value, callback) {
  if (value <= 0 ) { callback(new Error('不能输入小于0')); return; }
  callback();
}
/** 小数点 */
export function numberPrice(e) {
  // 通过正则过滤小数点后两位
  e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
}
/** 纯数字 */
export function inputNumber(e) {
  // 通过正则过滤小数点后两位
  e.target.value = (e.target.value.match(/^[0-9]*/g)[0]) || null
}
//手机号验证
export function isvalidPhone(str) {
  const reg = /^1[0-9][0-9]\d{8}$/
  return reg.test(str)
}
/** 正数  验证可用库存限制 */
export function validatePositiveValNumber(rule, value, callback, val) {
  const reg = /^[0-9]*$/;
  if (value <= 0) { callback(new Error('不能输入小于0')); return; }
  if (!val) {
    callback(new Error('无可用库存！')); return;
  }
  if (value > val) {
    callback(new Error('计划出库不可大于可用库存')); return;
  }
  if (value > 100000) { callback(new Error('不能输入大于100000')); return; }
  if (!reg.test(value)) { callback(new Error('请输入自然数')); return; }
  callback();
}
//银行账号验证
export function isBankAccount(str) {
  const reg =/(\d{4}\s){4}\d{3}/
  return reg.test(str)
}
// 验证纯数字
export function validateNumber(rule, value, callback) {
  const reg = /^[0-9]*$/
  if (!value) {
    callback(new Error('必录'));
    return;
  }
  if (!reg.test(value)) {
    callback(new Error('必须是数字组成'));
    return;
  }
  callback();
}
