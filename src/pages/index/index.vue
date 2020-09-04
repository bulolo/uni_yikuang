<template>
  <view id="Index">

    <!--  #ifndef MP-QQ-->
    <view class="region-box">
      <cover-view class="region-search-btn" @tap="searchCheckTap(1)">
        <cover-image class="img-icon" :src="imgData.regionSearch"></cover-image>
      </cover-view>
    </view>
    <!--  #endif -->
    <view class="map-box">
       <!--  #ifndef MP-ALIPAY-->
      <cover-view @tap="typeTap(0)" class="btn-quezhen-view">
        <cover-image :src="type===0?imgData.btn_quezhen:imgData.btn_quezhen_nor" mode="widthFix" class="img"></cover-image>
      </cover-view>
      <cover-view @tap="typeTap(1)" class="btn-hospital-view">
        <cover-image :src="type===1?imgData.btn_hospital:imgData.btn_hospital_nor" mode="widthFix" class="img"></cover-image>
      </cover-view>
       <!--  #endif -->
      <map
        id="map"
        ref="map"
        :longitude="current_area.longitude"
        :latitude="current_area.latitude"
        :show-location="true"
        :show-compass="true"
        :enable-rotate="true"
        :show-scale="true"
        :enable-3D="true"
        :enable-scroll="true"
        :enable-zoom="true"
        :enable-overlooking="true"
        :scale="scale"
        @controltap="controltap"
        :markers="markers"
        @markertap="markertap"
        @regionchange="regionchange"
        style="width: 100%;height:100%;"
      ></map>

      <cover-view @tap="scaleTap" class="map-cover-view">
        <cover-image :src="imgData.mapScale" class="img"></cover-image>
      </cover-view>
      <cover-view @tap="aimTap" class="map-cover-view2">
        <cover-image :src="imgData.aim" class="img"></cover-image>
      </cover-view>
    </view>

    <view class="tips-box" v-if="type===0">
      <view class="item">
        <image :src="icons.danger" class="icon" mode="widthFix" />14 天内确诊
      </view>
      <view class="item">
        <image :src="icons.warning" class="icon" mode="widthFix" />14 - 28 天内确诊
      </view>
      <view class="item">
        <image :src="icons.success" class="icon" mode="widthFix" />确诊超过 28 天
      </view>
    </view>


    <view class="tips-box2" v-if="type===1">
      <view class="item">
        <image :src="icons.icon_hospital" class="icon" mode="widthFix" />
      </view>
      <view class="item">
        医疗救治定点医院/发热门诊医疗机构
      </view>
    </view>
   
   <view class="tips-sub">数据来自当地卫健委或政府发布渠道{{last_update?formatTime(last_update):''}}</view>


    <view class="carousel-box">
      <view class="carousel-main">
        <swiper
          :indicator-dots="indicatorDots"
          :indicator-color="indicatorColor"
          :indicator-active-color="indicatorActiveColor"
          :circular="circular"
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
          class="swiper"
        >
          <swiper-item v-for="(item,index) in banners" :key="index" :index="index" :item="item">
            <image :src="item.url" @tap="openWeb(item)" class="slide-image" mode="aspectFill" />
          </swiper-item>
        </swiper>
      </view>
    </view>
    <view class="title-box">
      <view class="bd">
        <view class="title">
          <view class="titleTxt">
            发现
            <label style="padding: 0 0.25em;">{{shops.length}}</label>
            {{type===0?"处确诊病例逗留地":"处定点医院"}}
          </view>
          <image class="refresh-icon" @tap="refreshNear" :src="imgData.refresh" mode="widthFix" />
        </view>
      </view>
      <button class="share" open-type="share">
        <image class="share-icon" :src="imgData.share" mode="widthFix" />
      </button>
      <!-- #ifdef MP-ALIPAY -->

      <!--  #endif -->
      <!-- #ifdef MP-WEIXIN || MP-QQ -->
      <!-- <button class="share" @click="onClickShare">
        <image class="share-icon" :src="imgData.share" mode="widthFix" />
      </button>-->
      <!--  #endif -->
    </view>
    <view class="title-box-subtitle">
      <image class="icon" src="/static/location_me_small.png" mode="widthFix" />
      {{current_area.name}}
      附近
    </view>
    <view v-if="!shops.length" style="height: 10px; background: #fff;"></view>
    <view class="near-box">
      <view v-for="(item,index) in shops" :key="index" :index="index" :item="item">
        <pd-list :item="item" :index="index"></pd-list>
      </view>
      <view v-if="shops.length===0" class="tip">{{tipTxt}}</view>
    </view>
     <!-- #ifdef MP-WEIXIN -->
    <view style="margin:20rpx 20rpx;position:relative;">
      <official-account></official-account>
    </view>
    <!-- #endif -->
    <uni-popup ref="popup" type="bottom" @change="onChangeSelect">
      <view class="select-share-type">
        <button class="item" open-type="share">分享给好友或群</button>
        <button class="item" open-type="getUserInfo" @getuserinfo="onSharePoster">生成分享海报</button>
        <button class="item popup-cancel" @click="onShareCancel">取消</button>
      </view>
    </uni-popup>

    <cover-view class="fixed" v-if="template" @click="closeCard">
      <painter
        class="painter"
        @imgOK="onImgOK"
        @imgErr="onImgERR"
        :palette="template"
        v-if="!drawFinish"
      />
      <cover-view class="painter-box" @click.stop v-else>
        <cover-image class="painter" @longpress="saveCard" :src="shareImg" mode />
        <cover-view class="tip">长按保存图片</cover-view>
        <cover-image src="/static/icon_close_white.png" class="closeBtn" @tap="closeCard" />
      </cover-view>
    </cover-view>
    <marker-popup :markerInfo="markerInfo" ref="popupMarker"></marker-popup>
   
  </view>
</template>

<script>
const imgIcon = `/static`;
import uniPopup from "@/components/uni-popup/uni-popup";
import PdList from "@/components/index/list.vue";
import dayjs from "dayjs";
import Painter from "@/components/painter/index";
import Card from "@/common/palette/share";
import markerPopup from "@/components/popup/marker";
import openWeb from "@/common/mixins/openWeb";
const card = new Card();
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  mixins: [openWeb],
  components: {
    PdList,
    uniPopup,
    Painter,
    markerPopup
  },
  data() {
    return {
      last_update: "",
      icons: {
        danger: "https://files.webhunt.cn/yikuang/img/red_mark.png",
        warning: "https://files.webhunt.cn/yikuang/img/yellow_mark.png",
        success: "https://files.webhunt.cn/yikuang/img/green_mark.png",
        icon_hospital:"https://files.webhunt.cn/yikuang/img/icon_hospital.png",

      },
      recommendBanners: [],
      markerInfo: null,
      tipTxt: "加载中",
      // #ifdef MP-ALIPAY
      scale: 10,
      // #endif
      // #ifndef MP-ALIPAY
      scale: 12,
      // #endif
      mapCtx: "",
      imgData: {
        icdown: `${imgIcon}/icdown.png`,
        icup: `${imgIcon}/icup.png`,
        regionSearch: `${imgIcon}/icon_search.png`,
        mapScale: `${imgIcon}/icon_zoom.png`,
        refresh: `${imgIcon}/refresh_active.png`,
        aim: `${imgIcon}/icon_location.png`,
        share: `${imgIcon}/btn_share.png`,
        range: `${imgIcon}/range.png`,
        btn_hospital:`${imgIcon}/btn_hospital.png`,
        btn_hospital_nor:`${imgIcon}/btn_hospital_nor.png`,
        btn_quezhen:`${imgIcon}/btn_quezhen.png`,
        btn_quezhen_nor:`${imgIcon}/btn_quezhen_nor.png`
      },
      banners: [],
      shops: [],
      open_area: [
        {
          code: "440000",
          name: "广东省"
        },
        {
          code: "440000",
          name: "广西省"
        }
      ],
      indicatorDots: true, // 是否显示面板指示点
      indicatorColor: "rgba(136,136,136,1)", // 指示点颜色
      indicatorActiveColor: "rgba(78,140,238,1)", // 当前选中的指示点颜色
      circular: true, // 是否采用衔接滑动
      autoplay: true, // 是否自动切换
      interval: 4000, // 自动切换时间间隔
      duration: 800, // 滑动动画时长
      markers: [],
      template: null,
      showPainter: false,
      drawFinish: false,
      shareImg: ""
    };
  },
  computed: {
    ...mapState("app", {
      current_area: state => state.current_area,
      platform: state => state.platform,
      type: state => state.type
    }),
    formatTime() {
      return function(date) {
        return `:${dayjs(date).format("YYYY-MM-DD")}`;
      };
    }
  },
  onShow() {
    // if (this.current_area && !this.current_area.notInit) {
    //   console.log("onShow=> getData");
    //   this.getData();
    // }
  },
  async onLoad() {
    this.mapCtx = uni.createMapContext("map");
    //获取我的当前定位
    console.log("onload=>", this.mapCtx);
    try {
      uni.showLoading({
        title: "加载中"
      });
      await this.getBanners();
      await this.getLocation();
      // await this.getData()
    } catch (error) {
      uni.hideLoading();
    }
    //根据定位获取我的数据
  },
  onShareAppMessage(res) {
    return {
      title: "查查离我最近-“新型肺炎”病人，曾到过的小区！",
      // path: '',
      // imageUrl: '',
      success: function(res) {
        // 转发成功
        uni.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function(res) {
        // 转发失败
      }
    };
  },
  methods: {
    ...mapActions("app", ["updateCurrentArea","updateType"]),
    async typeTap(type){
      console.log(type)
      this.updateType(type)
      await this.getLocation();
    },
    closeCard() {
      this.template = null;
      this.$refs.popup.close();
      this.showPainter = false;
    },
    saveCard() {
      uni.saveImageToPhotosAlbum({
        filePath: this.shareImg,
        success(result) {
          uni.showToast({
            title: "保存成功"
          });
          console.log("result=>", result);
        },
        fail(err) {
          console.log("err=>", err);
          if (
            err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" ||
            err.errMsg === "saveImageToPhotosAlbum:fail auth deny"
          ) {
            uni.showModal({
              title: "提示",
              content: "需要您授权保存相册",
              showCancel: false,
              success: modalSuccess => {
                uni.openSetting({
                  success(settingdata) {
                    console.log("settingdata", settingdata);
                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                      uni.showModal({
                        title: "提示",
                        content: "获取权限成功,再次点击图片即可保存",
                        showCancel: false
                      });
                    } else {
                      uni.showModal({
                        title: "提示",
                        content: "获取权限失败，将无法保存到相册哦~",
                        showCancel: false
                      });
                    }
                  },
                  fail(failData) {
                    console.log("failData", failData);
                  },
                  complete(finishData) {
                    console.log("finishData", finishData);
                  }
                });
              }
            });
          }
        }
      });
    },
    onImgOK(e) {
      console.log("? e img ok", e);
      this.$refs.popup.close();
      this.shareImg = e.target.path;
      this.drawFinish = true;
    },
    onImgERR(e) {
      uni.showToast({
        title: "绘制分享海报失败,请重试",
        icon: "none",
        duration: 2000
      });
    },
    onClickShare() {
      console.log("onClickShare");
      if (this.$refs.popup) {
        this.$refs.popup.open();
      }
    },
    onSharePoster(e) {
      this.$refs.popup.close();
      let qrcode = "https://files.webhunt.cn/yikuang/";
      let mapUrl = qrcode + "shareMap.png?t=111";
      // #ifdef MP-QQ
      qrcode += "qq_code.jpg";
      // #endif
      // #ifdef MP-WEIXIN
      qrcode += "wechat_code.jpg";
      // #endif
      console.log(e);
      let userInfo = e.detail.userInfo;
      this.userInfo = userInfo;
      userInfo.avatar = userInfo.avatarUrl;

      if (!this.template) {
        this.template = card.do(this.userInfo, qrcode, mapUrl);
      }
      this.showPainter = false;
    },
    onShareCancel() {
      this.$refs.popup.close();
      this.showPainter = false;
    },
    onChangeSelect(e) {
      if (!e.show) {
        this.showPainter = false;
      }
    },
    async getBanners() {
      const res = await this.$api.banners({
        type: this.platform,
        tab: 1
      });
      this.banners = res.data.data.list;
      const adRes = await this.$api.banners({
        type: this.platform,
        tab: 0
      });
      this.recommendBanners = adRes.data.data.list || [];
    },
    shareTap() {},

    async aimTap() {
      uni.showLoading({
        title: "加载中"
      });
      await this.getLocation();
      uni.hideLoading();
    },
    scaleTap() {
      uni.navigateTo({
        url: `/pages/index/map?longitude=${this.current_area.longitude}&latitude=${this.current_area.latitude}`
      });
    },
    searchTap() {
      uni.chooseLocation({
        success: res => {
          console.log(res);
        }
      });
    },
    async searchCheckTap() {
      uni.chooseLocation({
        success: async res => {
          console.log("chooseLocation=>", res);
          this.updateCurrentArea({
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude,
            name: res.name
          });
          console.log("this.current_area", this.current_area);
          await this.getData();
        }
      });
    },
    async refreshNear() {
      await this.getData();
      uni.hideLoading();
    },
    markertap(e) {
      uni.showLoading({
        title: "加载中"
      });
      let id = e.markerId;
      this.$api
        .getShopDetail(id, {
          lon: this.current_area.longitude,
          lat: this.current_area.latitude
        }, this.type)
        .then(res => {
          if (this.type === 0) {
            console.log(res, "??res");
            let data = res.data.data || {};
            let recommend = this.recommendBanners[
              Math.floor(Math.random() * this.recommendBanners.length)
            ];
            if (recommend) {
              data.recommend = recommend;
            }
            let time = dayjs(data.created_at).valueOf();
            let now = +new Date();
            let leave = now - time / (3600 * 1000 * 24);
            let date = new Date(time);
            data.leave = leave;
            data.month = date.getUTCMonth() + 1;
            data.day = date.getUTCDate();
            this.markerInfo = data;
            this.$refs.popupMarker.open();
          } else {
            console.log('打开医院导航地图')
            uni.openLocation({
              latitude: parseFloat(res.data.data.location.coordinates[1]),
              longitude: parseFloat(res.data.data.location.coordinates[0]),
              name:res.data.data.name,
              address:res.data.data.address,
              success: function () {
                console.log('打开医院导航地图success');
              }
            })
          }
          uni.hideLoading()
        })
        .catch(err => {
          uni.hideLoading();
          console.log(err, "??err");
        });
    },
    controltap(e) {
      console.log(e);
    },
    async getData() {
      try {
        uni.showLoading({
          title: "加载中"
        });
        const res = await this.$api.homePage({
          lon: this.current_area.longitude,
          lat: this.current_area.latitude
        },this.type);
        console.log("homePageRes=>", res.data.data);
        this.shops = res.data.data.shops;
        this.open_area = res.data.data.open_area;
        this.last_update = res.data.data.last_update;
        this.markers = await this.getMapRegionShop();
        if (this.shops.length === 0) {
          this.tipTxt =
            "当地卫健委或机构未公布，或暂未收录，请尽快联系我们收录防止疫情！";
        }
        uni.hideLoading();
      } catch (error) {
        uni.hideLoading();
      }
    },
    showConfirm() {
      console.log("无法获取地图数据，因为授权");
      uni.showToast({
        title: "访问位置被拒绝,请打开小程序设置位置访问限制",
        icon: "none"
      });
    },
    async regionchange(e) {
      if (e.type === "end") {
        let status = await this.getSetting();
        if (status === 2) {
          this.showConfirm();
          return;
        }
        this.markers = await this.getMapRegionShop();
        const { latitude, longitude } = await this.getCenterLocation();
      }
    },
    getCenterLocation() {
      return new Promise(resolve => {
        this.mapCtx.getCenterLocation({
          success(e) {
            resolve(e);
          }
        });
      });
    },
    getRegion() {
      return new Promise(resolve => {
        if (this.mapCtx.getRegion) {
          this.mapCtx.getRegion({
            success(e) {
              console.log(e, "?e getRegion", JSON.stringify(e));
              resolve(e);
            }
          });
        } else {
          return resolve({
            northeast: {
              latitude: 22.606497275603203,
              longitude: 113.97445052862167
            },
            southwest: {
              latitude: 22.503997084077685,
              longitude: 113.79358917474747
            }
          });
        }
      });
    },
    async getMapRegionShop() {
      const { southwest, northeast } = await this.getRegion();
      const { latitude, longitude } = await this.getCenterLocation();
      let params = {
        southwest,
        northeast,
        centerLongitude: longitude,
        centerLatitude: latitude
      };
      const res = await this.$api.markers(params,this.type);
      console.log("mapDataRes>>", res.data.data);
      return res.data.data.markers || [];
    },
    async getLocation() {
      // #ifdef APP-PLUS
      let status = await this.checkPermission();
      if (status !== 1) {
        return;
      }
      // #endif
      // #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ
      let status = await this.getSetting();
      if (status === 2) {
        this.showConfirm();
        return;
      }
      // #endif
      this.doGetLocation();
    },
    doGetLocation() {
      uni.getLocation({
        type: "gcj02",
        success: res => {
          this.updateCurrentArea({
            address: "当前位置",
            latitude: res.latitude,
            longitude: res.longitude,
            name: "当前位置"
          });
          this.mapCtx.moveToLocation({
            latitude: this.current_area.latitude,
            longitude: this.current_area.longitude
          });
          // this.scale = 12
          this.getData();
        },
        fail: err => {
          // #ifdef MP-BAIDU
          if (err.errCode === 202 || err.errCode === 10003) {
            // 202模拟器 10003真机 user deny
            this.showConfirm();
          }
          // #endif
          // #ifndef MP-BAIDU
          if (err.errMsg.indexOf("auth deny") >= 0) {
            console.log("!!!!访问位置被拒绝,请打开小程序设置位置访问限制");
            uni.showToast({
              title: "访问位置被拒绝,请打开小程序设置位置访问限制",
              icon: "none"
            });
          } else {
            uni.showToast({
              icon: "none",
              title: "访问位置被拒绝,请打开小程序设置位置访问限制"
            });
          }
          // #endif
        }
      });
    },
    getSetting: function() {
      return new Promise((resolve, reject) => {
        uni.getSetting({
          success: res => {
            if (res.authSetting["scope.userLocation"] === undefined) {
              resolve(0);
              return;
            }
            if (res.authSetting["scope.userLocation"]) {
              resolve(1);
            } else {
              resolve(2);
            }
          }
        });
      });
    },
    openSetting: function() {
      this.hideConfirm();
      uni.openSetting({
        success: res => {
          if (res.authSetting && res.authSetting["scope.userLocation"]) {
            this.doGetLocation();
          }
        },
        fail: err => {}
      });
    },
    async checkPermission() {
      let status = permision.isIOS
        ? await permision.requestIOS("location")
        : await permision.requestAndroid(
            "android.permission.ACCESS_FINE_LOCATION"
          );
      if (status === null || status === 1) {
        status = 1;
      } else if (status === 2) {
        uni.showModal({
          content: "系统定位已关闭",
          confirmText: "确定",
          showCancel: false,
          success: function(res) {}
        });
      } else if (status.code) {
        uni.showModal({
          content: status.message
        });
      } else {
        uni.showModal({
          content: "需要定位权限",
          confirmText: "设置",
          success: function(res) {
            if (res.confirm) {
              permision.gotoAppSetting();
            }
          }
        });
      }
      return status;
    }
  }
};
</script>



<style lang="less" scoped>
cover-view {
  background: none;
}
.select-share-type {
  border-radius: 10px 10px 0px 0px;
  overflow: hidden;
  padding: 0 32rpx;
  box-sizing: border-box;
  background: #fff;
}
.select-share-type > .item {
  height: 128rpx;
  line-height: 128rpx;
  text-align: center;
  font-size: 32rpx;
  color: #3767c7;
  background: none;
  border: none;
  border-bottom: 2rpx solid rgba(244, 244, 244, 1);
  &:after {
    border: none;
  }
  &.popup-cancel {
    color: #b8b8b8;
  }
}

.fixed {
  position: fixed;
  z-index: 6;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  .painter-box {
    position: absolute;
    width: 640rpx;
    height: 1020rpx;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    .painter {
      margin: 0;
    }
  }
  .painter {
    position: absolute;
    width: 640rpx;
    height: 800rpx;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .tip {
    position: absolute;
    width: 100%;
    font-size: 32rpx;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: #ffffff;
    line-height: 48rpx;
    bottom: 118rpx;
    text-align: center;
  }
  .closeBtn {
    position: absolute;
    width: 78rpx;
    height: 78rpx;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
}
</style>

<style lang="less">
#Index {
  background-color: #f2f2f2;
  height: auto;
  min-height: calc(100vh - var(--window-top) - var(--window-bottom));
}
#Index {
  .region-search-btn {
    width: 84rpx;
    height: 84rpx;
    position: fixed;
    top: 40rpx;
    // #ifdef MP-ALIPAY
    left: 32rpx;
    // #endif
    // #ifndef MP-ALIPAY
    right: 32rpx;
    // #endif

    z-index: 4;
    .txt-loc {
      font-size: 28rpx;
      line-height: 68rpx;
      font-family: PingFangSC-Regular;
      color: white;
      position: relative;
      margin-left: 60rpx;
    }
    .img-icon {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  /* 轮播图 */
  .carousel-box {
    position: relative;
    z-index: 2;
    padding: 0 30rpx;
    margin: 40rpx auto;
    .carousel-main {
      box-shadow: 0 12rpx 20rpx #ccc;
      border-radius: 8rpx;
      overflow: hidden;
    }
    .swiper {
      height: 200rpx;
      border-radius: 8rpx;
      overflow: hidden;
    }
    .slide-image {
      width: 100%;
      height: 100%;
      min-height: 200rpx;
      border-radius: 8rpx;
    }
  }
  .near-box {
    .tip {
      font-size: 30rpx;
      color: gray;
      width: 100%;
      text-align: center;
      padding: 0 32rpx;
      box-sizing: border-box;
    }
  }
  .title-box {
    background: white;
    display: flex;
    align-items: center;
    padding-top: 30rpx;
    > .bd {
      flex: 1;
      padding-left: 25rpx;
      box-sizing: border-box;
    }
    .title {
      width: 100%;
      display: flex;
      color: #2a2a2a;
      font-weight: bold;
      align-items: center;
      .titleTxt {
        height: auto;
        font-size: 32rpx;
        line-height: 48rpx;
        border-bottom: thin dotted grya;
      }
      .refresh-icon {
        height: 100%;
        width: 32rpx;
        text-align: right;
        margin-left: 8rpx;
      }
    }
    .share {
      margin-right: 18rpx;
      margin-top: 22rpx;
      background-color: burlywood;
      color: white;
      border-radius: 30rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0;
      outline: none;
      border: none;
      background: none;
      &::before,
      &::after {
        outline: none;
        border: none;
      }
      // background: rgba(78, 140, 238, 1);
      .share-icon {
        width: 140rpx;
        height: 56rpx;
        margin-right: 30rpx;
      }
      .text {
        font-size: 22rpx;
        font-family: PingFangSC-Regular;
      }
    }
  }
  .title-box-subtitle {
    display: flex;
    font-size: 24rpx;
    color: #2a2a2a;
    align-items: center;
    padding: 0 25rpx;
    box-sizing: border-box;
    background: #fff;
    > .distance {
      color: #0d72ff;
      padding: 0 4rpx;
    }
    > .icon {
      width: 36rpx;
    }
  }
  /* 地图 */
  .map-box {
    height: 460rpx;
    position: relative;
    background: #f5f5f5;
    .btn-hospital-view {
      height: auto;
      width: 200rpx;;
      position: absolute;
      left: 232rpx;
      top: 32rpx;
      z-index: 4;
      .img {
        width: 100%;
        height: auto;
      }
    }
    .btn-quezhen-view {
      height: auto;
      width: 200rpx;;
      position: absolute;
      left: 32rpx;
      top: 32rpx;
      z-index: 4;

      .img {
        width: 100%;
        height: auto;
      }
    }
    .map-cover-view {
      height: 84rpx;
      width: 84rpx;
      position: absolute;
      right: 32rpx;
      bottom: 32rpx;
      z-index: 4;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .map-cover-view2 {
      height: 84rpx;
      width: 84rpx;
      position: absolute;
      left: 32rpx;
      bottom: 32rpx;
      z-index: 4;
      .img {
        width: 100%;
        height: 100%;
      }
    }
  }
 .tips-box2 {
    display: flex;
    box-sizing: border-box;
    padding: 20rpx 20rpx 0;
    background: #fff;
    justify-content: center;
    height: 100rpx;
    > .item {
      display: flex;
      flex: 0 0 auto;
      color: #494949;
      font-size: 24rpx;
      align-items: center;
      > .icon {
        width: 48rpx;
        margin-right: 4rpx;
      }
    }
  }
  .tips-box {
    display: flex;
    box-sizing: border-box;
    padding: 20rpx 20rpx 0;
    background: #fff;
    justify-content: space-between;
    height: 100rpx;
    > .item {
      display: flex;
      flex: 0 0 auto;
      color: #494949;
      font-size: 24rpx;
      align-items: center;
      > .icon {
        width: 48rpx;
        margin-right: 4rpx;
      }
    }
  }
  .tips-sub {
    text-align: center;
    color: #797979;
    font-size: 22rpx;
    line-height: 34rpx;
    padding-bottom: 22rpx;
    background: #fff;
    padding-top: 6rpx;
  }
}
</style>
