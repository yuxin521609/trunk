export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}
/**
 * @Date: null
 * @description: 时间戳转日期  使用人很多    列 卡券使用
 * @author: elephant ==
 * @param {type} 
 * @return: 
 */
export function timesTampConvertsDate (date, dateFlag = false) {
  if (!date) return
  let time
  if (typeof date == 'object') {
    time = new Date(date)
  } else if (typeof date == 'string' && date.indexOf('T') > -1) {
    // 转换格式
    let arr = date.split("T");
    let left = arr[0].replace(/-/g, '/');
    let right = arr[1].split('.')[0]
    let newDate = `${left} ${right}`;
    time = new Date(Date.parse(newDate));
    time.setTime(time.setHours(time.getHours() + 8));
  } else {
    time = new Date(date)
  }
  let Y = time.getFullYear();
  let M = addZero(time.getMonth() + 1);
  let D = addZero(time.getDate());
  let h = addZero(time.getHours());
  let m = addZero(time.getMinutes());
  let s = addZero(time.getSeconds());
  if(dateFlag){
    return Y + '.' + M + '.' + D;
  }else{
    return Y + '年' + M + '月' + D + '日';
  }
}
// 数字补0操作
function addZero(num) {
  return num < 10 ? '0' + num : num;
}