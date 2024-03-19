"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  _easycom_uni_dateformat2();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
if (!Math) {
  _easycom_uni_dateformat();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          date: Date.now(),
          format: "yyyy-MM-dd hh:mm:ss"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/armstrong/Desktop/uniapp学习/uniappV3Demo1/pages/notice/detail.vue"]]);
wx.createPage(MiniProgramPage);
