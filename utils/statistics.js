var request = require("./request.js");

function uploadData(start_time, end_time, page, params, successCallback) {
  request.httpsPostRequest('/weapp/product/reportActivity', {
    start_time: start_time,
    end_time: end_time,
    page: page,
    params: params
  }, function (response) {
    if (successCallback) {
      successCallback()
    }
    // do nothing
  })
}

function uploadShareData(title, content) {
  request.httpsPostRequest('/weapp/product/feedback', {
    title: title,
    content: content
  }, function (res_data) {
    // do nothing
  });
}

module.exports = {
  uploadData: uploadData,
  uploadShareData: uploadShareData
}
