"use strict";
const common_vendor = require("../common/vendor.js");
function getData(url, data = {}) {
  url = "https://tea.qingnian8.com/api/bizhi" + url;
  return common_vendor.index.request({
    url,
    header: {
      "access-key": "gzj666666"
    },
    data
  });
}
exports.getData = getData;
