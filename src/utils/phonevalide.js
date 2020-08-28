//手机号验证
export function isvalidPhone(str) {
    const reg = /^1[0-9][0-9]\d{8}$/
    return reg.test(str)
  }
