"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_system = require("../../utils/system.js");
const _sfc_main = {
  __name: "custom-nav-bar",
  props: {
    title: {
      type: String,
      default: "壁纸"
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(utils_system.getStatusBarHeight)() + "px",
        b: common_vendor.t(__props.title),
        c: common_vendor.unref(utils_system.getTitleBarHeight)() + "px",
        d: common_vendor.unref(utils_system.getNavBarHeight)() + "px"
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-412fc155"], ["__file", "C:/Users/armstrong/Desktop/uniapp学习/uniappV3Demo1/components/custom-nav-bar/custom-nav-bar.vue"]]);
wx.createComponent(Component);
