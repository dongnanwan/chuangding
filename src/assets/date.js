export default function dateFormat (value, fmt) {
    if (!value) {
      return ''
    }
    var date
    if (value instanceof Date) {
      date = value
    } else {
      date = new Date(value)
    }
    var dv = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S+': date.getMilliseconds()
    }
    if (/(y+)/i.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (var k in dv) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? dv[k]
            : ('00' + dv[k]).substr(('' + dv[k]).length)
        )
      }
    }
    return fmt
  }
  