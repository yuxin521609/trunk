import axios from 'axios';
import { getToken } from './auth'
/**
 * 时间戳
 * @param {*} date  时间
 */
const timestampToTime = date => {
  if (!date) return
  let time
  if (typeof date == 'object') {
    time = new Date(date)
  } else if (date.indexOf('T') > -1) {
    // 转换格式
    let arr = date.split("T");
    let left = arr[0].replace(/-/g, '/');
    let right = arr[1].split('.')[0]
    let newDate = `${left} ${right}`;
    time = new Date(Date.parse(newDate));
    time.setTime(time.setHours(time.getHours()));
  } else {
    return data
  }
  let Y = time.getFullYear() + '-';
  let M = addZero(time.getMonth() + 1) + '-';
  let D = addZero(time.getDate()) + ' ';
  let h = addZero(time.getHours()) + ':';
  let m = addZero(time.getMinutes()) + ':';
  let s = addZero(time.getSeconds());
  return Y + M + D + h + m + s;
}
// 数字补0操作
function addZero(num) {
  return num < 10 ? '0' + num : num;
}
/*const timestampToTime = (timestamp) => {
    let date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-'
    let M =
        (date.getMonth() + 1 < 10 ?
            '0' + (date.getMonth() + 1) :
            date.getMonth() + 1) + '-'
    let D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    let h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    let m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
    let s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D + h + m + s
};*/
/**
 * 存储localStorage
 */
const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}

/**
 * 设置cookie
 **/
function setCookie(name, value, day) {
  let date = new Date();
  date.setDate(date.getDate() + day);
  document.cookie = name + '=' + value + ';expires=' + date;
};

/**
 * 获取cookie
 **/
function getCookie(name) {
  let reg = RegExp(name + '=([^;]+)');
  let arr = document.cookie.match(reg);
  if (arr) {
    return arr[1];
  } else {
    return '';
  }
};

/**
 * 删除cookie
 **/
function delCookie(name) {
  setCookie(name, null, -1);
};
/**
 * 导出
 * @param {*} url 
 * @param {*} data 
 * @param {*} title 
 */
function exportExcelAll(url, data, title) {
  axios({
    url,
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accessToken: getToken()
    },
    responseType: 'blob' // 设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
  })
    .then((response) => {
      const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
      const fileName = title;
      const linkNode = document.createElement('a');
      linkNode.download = fileName; // a标签的download属性规定下载文件的名称
      linkNode.style.display = 'none';
      linkNode.href = window.URL.createObjectURL(blob); // 生成一个Blob URL
      document.body.appendChild(linkNode);
      linkNode.click(); // 模拟在按钮上的一次鼠标单击
      URL.revokeObjectURL(linkNode.href); // 释放URL 对象
      document.body.removeChild(linkNode);
    })
    .catch((error) => {
      console.log(error);
    });
}
/**
 * 导出
 * @param {*} url 
 * @param {*} data 
 * @param {*} title 
 */
function exportExcelCSV(url, data, title) {
  axios({
    url,
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accessToken: getToken()
    },
    responseType: 'blob' // 设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
  })
    .then((response) => {
      const blob = new Blob([response.data], { type: 'application/csv' });
      const fileName = title;
      const linkNode = document.createElement('a');
      linkNode.download = fileName; // a标签的download属性规定下载文件的名称
      linkNode.style.display = 'none';
      linkNode.href = window.URL.createObjectURL(blob); // 生成一个Blob URL
      document.body.appendChild(linkNode);
      linkNode.click(); // 模拟在按钮上的一次鼠标单击
      URL.revokeObjectURL(linkNode.href); // 释放URL 对象
      document.body.removeChild(linkNode);
    })
    .catch((error) => {
      console.log(error);
    });
}
import { deepCopy } from "./clone";
/**
 * 导出
 **/
export {
  timestampToTime,
  setStore,
  getStore,
  removeStore,
  setCookie,
  getCookie,
  delCookie,
  deepCopy,
  exportExcelAll,
  exportExcelCSV
}
