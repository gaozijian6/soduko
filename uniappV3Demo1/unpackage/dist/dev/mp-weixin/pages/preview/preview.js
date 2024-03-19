"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_system = require("../../utils/system.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_rate2 = common_vendor.resolveComponent("uni-rate");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_dateformat2 + _easycom_uni_rate2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_rate = () => "../../uni_modules/uni-rate/components/uni-rate/uni-rate.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_dateformat + _easycom_uni_rate + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "preview",
  setup(__props) {
    let maskState = common_vendor.ref(true);
    function maskChange() {
      maskState.value = !maskState.value;
    }
    let infoPopup = common_vendor.ref(null);
    let isScore = common_vendor.ref(false);
    function clickInfo() {
      infoPopup.value.open();
    }
    function clickInfoClose() {
      infoPopup.value.close();
    }
    let scorePopup = common_vendor.ref();
    let userScore = common_vendor.ref(3);
    function clickScore() {
      if (currentInfo.value.userScore) {
        isScore.value = true;
        userScore.value = currentInfo.value.userScore;
      }
      scorePopup.value.open();
    }
    function clickScoreClose() {
      scorePopup.value.close();
      userScore.value = 0;
      isScore.value = false;
    }
    function submitScore() {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      let {
        classid,
        _id: wallId
      } = currentInfo.value;
      api_apis.getData("/setupScore", {
        classid,
        wallId,
        userScore: userScore.value
      }).then((res) => {
        if (res.data.errCode == 0) {
          common_vendor.index.showToast({
            title: "评分成功",
            icon: "none"
          });
          classList.value[currentIndex.value].userScore = userScore.value;
          common_vendor.index.setStorageSync("classList", classList.value);
          clickScoreClose();
          common_vendor.index.hideLoading();
        }
      });
    }
    function goBack() {
      common_vendor.index.navigateBack({
        success() {
        },
        fail() {
          console.log("no");
          common_vendor.index.reLaunch({
            url: "/pages/index/index"
          });
        }
      });
    }
    let classList = common_vendor.ref([]);
    if (common_vendor.index.getStorageSync("classList")) {
      classList.value = common_vendor.index.getStorageSync("classList").map((item) => {
        return {
          ...item,
          picurl: item.smallPicurl.replace("_small.webp", ".jpg")
        };
      });
    }
    let currentId = common_vendor.ref();
    let currentIndex = common_vendor.ref(0);
    let readImgs = common_vendor.ref(/* @__PURE__ */ new Set());
    let currentInfo = common_vendor.ref();
    common_vendor.onLoad((e) => {
      currentId.value = e.id;
      if (e.type == "share") {
        api_apis.getData("/detailWall", {
          id: e.id
        }).then((res) => {
          classList.value = res.data.data.map((item) => {
            return {
              ...item,
              picurl: item.smallPicurl.replace("_small.webp", ".jpg")
            };
          });
        });
      }
      currentIndex.value = classList.value.findIndex((item) => item._id == currentId.value);
      readImgs.value.add(currentIndex.value - 1 == -1 ? classList.value.length - 1 : currentIndex.value - 1);
      readImgs.value.add(currentIndex.value);
      readImgs.value.add(currentIndex.value + 1 == classList.value.length ? 0 : currentIndex.value + 1);
      currentInfo.value = classList.value[currentIndex.value];
    });
    function swiperChange(e) {
      currentIndex.value = e.detail.current;
      readImgs.value.add(currentIndex.value - 1 == -1 ? classList.value.length - 1 : currentIndex.value - 1);
      readImgs.value.add(currentIndex.value);
      readImgs.value.add(currentIndex.value + 1 == classList.value.length ? 0 : currentIndex.value + 1);
      currentInfo.value = classList.value[currentIndex.value];
      console.log(currentInfo.value);
    }
    function clickDownload() {
      common_vendor.index.showLoading({
        title: "下载中...",
        mask: "true"
      });
      let {
        classid,
        _id: wallId
      } = currentInfo.value;
      api_apis.getData("/downloadWall", {
        classid,
        wallId
      }).then((res) => {
        common_vendor.index.getImageInfo({
          src: currentInfo.value.picurl,
          success: (res2) => {
            common_vendor.index.saveImageToPhotosAlbum({
              filePath: res2.path,
              success(res3) {
                console.log(res3);
              },
              fail(err) {
                if (err.errMsg == "saveImageToPhotosAlbum:fail cancel") {
                  common_vendor.index.showToast({
                    title: "保存失败，请重新点击下载",
                    icon: "none"
                  });
                  return;
                }
                common_vendor.index.showModal({
                  title: "提示",
                  content: "需要授权保存相册",
                  success(res3) {
                    if (res3.confirm) {
                      common_vendor.index.openSetting({
                        success(setting) {
                          if (setting.authSetting["scope.writePhotoAlbum"]) {
                            common_vendor.index.showToast({
                              title: "获取授权成功",
                              icon: "none"
                            });
                          } else {
                            common_vendor.index.showToast({
                              title: "获取授权失败",
                              icon: "none"
                            });
                          }
                        }
                      });
                    }
                  }
                });
              },
              complete() {
                common_vendor.index.hideLoading();
              }
            });
          }
        });
      });
    }
    common_vendor.onShareAppMessage((e) => {
      return {
        title: "我",
        path: `pages/preview/preview?id=${currentId.value}&type=share`
      };
    });
    common_vendor.onShareTimeline((e) => {
      return {
        title: "我的壁纸",
        query: `id=${queryParams.classid}&type=share`
      };
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(currentInfo)
      }, common_vendor.unref(currentInfo) ? common_vendor.e({
        b: common_vendor.f(common_vendor.unref(classList), (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.unref(readImgs).has(index)
          }, common_vendor.unref(readImgs).has(index) ? {
            b: common_vendor.o(maskChange, item._id),
            c: item.picurl
          } : {}, {
            d: item._id
          });
        }),
        c: common_vendor.unref(currentIndex),
        d: common_vendor.o(swiperChange),
        e: common_vendor.unref(maskState)
      }, common_vendor.unref(maskState) ? {
        f: common_vendor.p({
          type: "back",
          color: "#fff",
          size: "20"
        }),
        g: common_vendor.o(goBack),
        h: common_vendor.unref(utils_system.getStatusBarHeight)() + "px",
        i: common_vendor.t(common_vendor.unref(currentIndex) + 1),
        j: common_vendor.t(common_vendor.unref(classList).length),
        k: common_vendor.p({
          date: Date.now(),
          format: "hh:mm"
        }),
        l: common_vendor.p({
          date: Date.now(),
          format: "MM月dd日"
        }),
        m: common_vendor.p({
          type: "info",
          size: "28"
        }),
        n: common_vendor.o(clickInfo),
        o: common_vendor.p({
          type: "star",
          size: "28"
        }),
        p: common_vendor.t(common_vendor.unref(currentInfo).score),
        q: common_vendor.o(clickScore),
        r: common_vendor.p({
          type: "download",
          size: "28"
        }),
        s: common_vendor.o(clickDownload)
      } : {}, {
        t: common_vendor.p({
          type: "closeempty",
          size: "18",
          color: "#999"
        }),
        v: common_vendor.o(clickInfoClose),
        w: common_vendor.t(common_vendor.unref(currentInfo)._id),
        x: common_vendor.t(common_vendor.unref(currentInfo).nickname),
        y: common_vendor.p({
          readonly: true,
          touchable: true,
          value: common_vendor.unref(currentInfo).score
        }),
        z: common_vendor.t(common_vendor.unref(currentInfo).description),
        A: common_vendor.f(common_vendor.unref(currentInfo).tabs, (tab, k0, i0) => {
          return {
            a: common_vendor.t(tab),
            b: tab
          };
        }),
        B: common_vendor.sr(infoPopup, "2dad6c07-6", {
          "k": "infoPopup"
        }),
        C: common_vendor.p({
          type: "bottom"
        }),
        D: common_vendor.t(common_vendor.unref(isScore) ? "评分过了~" : "壁纸评分"),
        E: common_vendor.p({
          type: "closeempty",
          size: "18",
          color: "#999"
        }),
        F: common_vendor.o(clickScoreClose),
        G: common_vendor.o(($event) => common_vendor.isRef(userScore) ? userScore.value = $event : userScore = $event),
        H: common_vendor.p({
          ["allow-half"]: "",
          disabled: common_vendor.unref(isScore),
          ["disabled-color"]: "#ffca3e",
          modelValue: common_vendor.unref(userScore)
        }),
        I: common_vendor.t(common_vendor.unref(userScore)),
        J: common_vendor.o(submitScore),
        K: !common_vendor.unref(userScore) || common_vendor.unref(isScore),
        L: common_vendor.sr(scorePopup, "2dad6c07-9", {
          "k": "scorePopup"
        }),
        M: common_vendor.p({
          ["is-mask-click"]: false
        })
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2dad6c07"], ["__file", "C:/Users/armstrong/Desktop/uniapp学习/uniappV3Demo1/pages/preview/preview.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
