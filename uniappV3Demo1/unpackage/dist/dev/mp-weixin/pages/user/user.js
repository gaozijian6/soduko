"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_system = require("../../utils/system.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_parent = common_vendor.resolveComponent("parent");
  (_easycom_uni_icons2 + _component_parent)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "user",
  setup(__props) {
    let userInfo = common_vendor.ref();
    api_apis.getData("/userInfo").then((res) => {
      userInfo.value = res.data.data;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(userInfo)
      }, common_vendor.unref(userInfo) ? {
        b: common_vendor.unref(utils_system.getNavBarHeight)() + "px",
        c: common_vendor.t(common_vendor.unref(userInfo).IP),
        d: common_vendor.t(common_vendor.unref(userInfo).address.province || common_vendor.unref(userInfo).address.city || common_vendor.unref(userInfo).address.country),
        e: common_vendor.p({
          type: "download-filled",
          size: "20"
        }),
        f: common_vendor.t(common_vendor.unref(userInfo).downloadSize),
        g: common_vendor.p({
          type: "right"
        }),
        h: common_vendor.p({
          type: "star-filled",
          size: "20"
        }),
        i: common_vendor.t(common_vendor.unref(userInfo).scoreSize),
        j: common_vendor.p({
          type: "right"
        }),
        k: common_vendor.p({
          type: "chatboxes-filled",
          size: "20"
        }),
        l: common_vendor.p({
          type: "right"
        }),
        m: common_vendor.p({
          type: "notification-filled",
          size: "20"
        }),
        n: common_vendor.p({
          type: "right"
        }),
        o: common_vendor.p({
          type: "flag-filled",
          size: "20"
        }),
        p: common_vendor.p({
          type: "right"
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f7520f0"], ["__file", "C:/Users/armstrong/Desktop/uniapp学习/uniappV3Demo1/pages/user/user.vue"]]);
wx.createPage(MiniProgramPage);
