function formatTime(date, formatHour = true) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  var formatDate = [year, month, day].map(formatNumber).join('-')
  if (formatHour) {
    formatDate = formatDate + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  return formatDate
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function countDown(that, second) {
  if (second <= 0) {
    that.setData({
      sendCodeLabel: "重新发送",
      disabledSendPhoneCode: false
    });
    // timeout则跳出递归
    return;
  }

  // 渲染倒计时时钟
  that.setData({
    sendCodeLabel: second + " 秒"
  });

  setTimeout(function () {
    // 放在最后--
    second -= 1;
    countDown(that, second);
  }, 1000)
}

function parseUrl(href) {
  var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
  return match && {
    href: href,
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    pathname: match[5],
    search: match[6],
    hash: match[7]
  }
}

function http_build_query (data) {
  var _result = [];
  for (var key in data){
    var value = data[key];

    if (key === 'url') {
      value = encodeURIComponent(value)
    }

    if (value.constructor === Array){
      value.forEach(function(_value){
        _result.push(key + "=" + _value);
      });
    }else{
      _result.push(key + '=' + value);
    }
  }

  return _result.join('&');
}

module.exports = {
  formatTime: formatTime,
  countDown: countDown,
  parseUrl: parseUrl,
  http_build_query: http_build_query
}
