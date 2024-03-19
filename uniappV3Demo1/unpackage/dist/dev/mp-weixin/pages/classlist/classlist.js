"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  _easycom_uni_load_more();
}
const _sfc_main = {
  __name: "classlist",
  setup(__props) {
    let queryParams = {
      pageNum: 1,
      pageSize: 12
    };
    let classList = common_vendor.ref([]);
    let noData = common_vendor.ref(false);
    let pageNamer;
    common_vendor.onLoad((e) => {
      let {
        id,
        name,
        type
      } = e;
      if (type) {
        queryParams.type = type;
        noData.value = true;
      }
      if (id)
        queryParams.classid = id;
      pageNamer = name;
      common_vendor.index.setNavigationBarTitle({
        title: name
      });
      if (queryParams.classid) {
        api_apis.getData("/wallList", queryParams).then((res) => {
          classList.value = res.data.data;
          common_vendor.index.setStorageSync("classList", classList.value);
        });
      }
      if (queryParams.type) {
        api_apis.getData("/userWallList", queryParams).then((res) => {
          classList.value = res.data.data;
          common_vendor.index.setStorageSync("classList", classList.value);
        });
      }
    });
    common_vendor.onReachBottom(() => {
      if (noData.value)
        return;
      queryParams.pageNum++;
      api_apis.getData("/wallList", queryParams).then((res) => {
        classList.value = [...classList.value, ...res.data.data];
        if (res.data.data.length == 0)
          noData.value = true;
        common_vendor.index.setStorageSync("classList", classList.value);
      });
    });
    common_vendor.onShareAppMessage((e) => {
      return {
        title: "我",
        path: `pages/classlist/classlist?id=${queryParams.classid}&name=${pageNamer}`
      };
    });
    common_vendor.onShareTimeline((e) => {
      return {
        title: "我的壁纸",
        query: `id=${queryParams.classid}&name=${pageNamer}`
      };
    });
    common_vendor.onUnload(() => {
      common_vendor.index.removeStorageSync("classList");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !common_vendor.unref(classList).length
      }, !common_vendor.unref(classList).length ? {
        b: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        c: common_vendor.f(common_vendor.unref(classList), (item, k0, i0) => {
          return {
            a: item.smallPicurl,
            b: `/pages/preview/preview?id=${item._id}`,
            c: item._id
          };
        }),
        d: common_vendor.unref(classList).length
      }, common_vendor.unref(classList).length ? {
        e: common_vendor.p({
          status: common_vendor.unref(noData) ? "noMore" : "loading"
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bd381383"], ["__file", "C:/Users/armstrong/Desktop/uniapp学习/uniappV3Demo1/pages/classlist/classlist.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
