"use strict";
const common_vendor = require("../common/vendor.js");
let system = common_vendor.index.getSystemInfoSync();
let getStatusBarHeight = () => system.statusBarHeight || 15;
let getTitleBarHeight = () => {
  if (common_vendor.index.getMenuButtonBoundingClientRect) {
    let { top, height } = common_vendor.index.getMenuButtonBoundingClientRect();
    return height + (top - getStatusBarHeight()) * 2;
  } else {
    return 40;
  }
};
let getNavBarHeight = () => getStatusBarHeight() + getTitleBarHeight();
exports.getNavBarHeight = getNavBarHeight;
exports.getStatusBarHeight = getStatusBarHeight;
exports.getTitleBarHeight = getTitleBarHeight;
