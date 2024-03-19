"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_custom_nav_bar2 = common_vendor.resolveComponent("custom-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_common_title2 = common_vendor.resolveComponent("common-title");
  const _easycom_theme_item2 = common_vendor.resolveComponent("theme-item");
  (_easycom_custom_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_dateformat2 + _easycom_common_title2 + _easycom_theme_item2)();
}
const _easycom_custom_nav_bar = () => "../../components/custom-nav-bar/custom-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_common_title = () => "../../components/common-title/common-title.js";
const _easycom_theme_item = () => "../../components/theme-item/theme-item.js";
if (!Math) {
  (_easycom_custom_nav_bar + _easycom_uni_icons + _easycom_uni_dateformat + _easycom_common_title + _easycom_theme_item)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    function goPreview(id) {
      common_vendor.index.setStorageSync("classList", randomList.value);
      common_vendor.index.navigateTo({
        url: "/pages/preview/preview?id=" + id
      });
    }
    let bannerList = common_vendor.ref();
    api_apis.getData("/homeBanner").then((res) => {
      bannerList.value = res.data.data;
    });
    let randomList = common_vendor.ref();
    api_apis.getData("/randomWall").then((res) => {
      randomList.value = res.data.data;
    });
    let noticeList = common_vendor.ref();
    api_apis.getData("/wallNewsList").then((res) => {
      noticeList.value = res.data.data;
    });
    let classifyList = common_vendor.ref();
    api_apis.getData("/classify", { select: true }).then((res) => {
      classifyList.value = res.data.data;
      console.log(res);
    });
    common_vendor.onShareAppMessage((e) => {
      return {
        title: "我的壁纸",
        path: "pages/index/index"
      };
    });
    common_vendor.onShareTimeline((e) => {
      return {
        title: "我的壁纸",
        imageUrl: bannerList.value[0].picurl
      };
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "推荐"
        }),
        b: common_vendor.f(common_vendor.unref(bannerList), (item, k0, i0) => {
          return {
            a: item.picurl,
            b: item._id
          };
        }),
        c: common_vendor.p({
          type: "sound-filled",
          size: "20"
        }),
        d: common_vendor.f(common_vendor.unref(noticeList), (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: item._id
          };
        }),
        e: common_vendor.p({
          type: "right"
        }),
        f: common_vendor.p({
          type: "calendar",
          size: "18"
        }),
        g: common_vendor.p({
          date: Date.now(),
          format: "dd日"
        }),
        h: common_vendor.f(common_vendor.unref(randomList), (item, k0, i0) => {
          return {
            a: item.smallPicurl,
            b: item._id,
            c: common_vendor.o(($event) => goPreview(item._id), item._id)
          };
        }),
        i: common_vendor.f(common_vendor.unref(classifyList), (item, k0, i0) => {
          return {
            a: item._id,
            b: "1cf27b2a-7-" + i0,
            c: common_vendor.p({
              item
            })
          };
        }),
        j: common_vendor.p({
          isMore: true
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "C:/Users/armstrong/Desktop/uniapp学习/uniappV3Demo1/pages/index/index.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
