/*
 * @Description: 工具
 * @Author: your name
 * @Date: 2019-08-13 10:02:56
 * @LastEditTime: 2019-08-20 16:59:38
 * @LastEditors: Please set LastEditors
 */
/**
 * 时间戳
 * @param {*} date  时间
 */
export const timestampToTime = (date,type)  => {
  if(!date) return '--';
  let time
  if(typeof date == 'object'){
    time = new Date(date)
  }else if(date.indexOf('T') > -1){
    // 转换格式
    let arr = date.split("T");
    let left = arr[0].replace(/-/g, '/');
    let right = arr[1].split('.')[0]
    let  newDate = `${left} ${right}`;
    time = new Date(Date.parse(newDate));
    time.setTime(time.setHours(time.getHours()));
  }else{
    return data
  }
  let Y = time.getFullYear() + '-';
  let M = addZero(time.getMonth() + 1) + '-';
  let D = addZero(time.getDate()) + ' ';
  let h = addZero(time.getHours()) + ':';
  let m = addZero(time.getMinutes()) + ':';
  let s = addZero(time.getSeconds());
  if(type == 'ymd'){
    return Y + M + D;
  }else{
      return Y + M + D + h + m + s;
  }
}
/**
 * 时间戳
 * @param {*} date  时间(只有年月日)
 */
export const timestampToTimeNoDate = date => {
  if(!date) return '--';
  let time
  if(typeof date == 'object'){
    time = new Date(date)
  }else if(date.indexOf('T') > -1){
    // 转换格式
    let arr = date.split("T");
    let left = arr[0].replace(/-/g, '/');
    let right = arr[1].split('.')[0]
    let  newDate = `${left} ${right}`;
    time = new Date(Date.parse(newDate));
    time.setTime(time.setHours(time.getHours() + 8));
  }else{
    return data
  }
  let Y = time.getFullYear() + '-';
  let M = addZero(time.getMonth() + 1) + '-';
  let D = addZero(time.getDate()) + ' ';
  return Y + M + D;
}
/**
 * 时间戳
 * @param {*} date  时间(财务系统-启用状态-开启时间)
 */
export const timestampToTimeOfSwitchToStart = date => {
  if(!date) return '--';
  let time
  if(typeof date == 'object'){
    time = new Date(date)
  }else if(date.indexOf('T') > -1){
    // 转换格式
    let arr = date.split("T");
    let left = arr[0].replace(/-/g, '/');
    let right = arr[1].split('.')[0]
    let  newDate = `${left} ${right}`;
    time = new Date(Date.parse(newDate));
    time.setTime(time.setHours(time.getHours() + 8));
  }else{
    return data
  }
  let Y = time.getFullYear() + '/';
  let M = addZero(time.getMonth() + 1) + '/';
  let D = addZero(time.getDate()) + ' ';
  return Y + M + D+'00:00:00';
}
/**
 * 时间戳
 * @param {*} date  时间(财务系统-启用状态-停用时间)
 */
export const timestampToTimeOfSwitchToEnd = date => {
  if(!date) return '--';
  let time
  if(typeof date == 'object'){
    time = new Date(date)
  }else if(date.indexOf('T') > -1){
    // 转换格式
    let arr = date.split("T");
    let left = arr[0].replace(/-/g, '/');
    let right = arr[1].split('.')[0]
    let  newDate = `${left} ${right}`;
    time = new Date(Date.parse(newDate));
    time.setTime(time.setHours(time.getHours() + 8));
  }else{
    return data
  }
  let Y = time.getFullYear() + '/';
  let M = addZero(time.getMonth() + 1) + '/';
  let D = addZero(time.getDate()-1) + ' ';
  return Y + M + D+'23:59:59';
}
// 数字补0操作
function addZero(num) {
    return num < 10 ? '0' + num : num;
}
