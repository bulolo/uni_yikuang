
<template>
  <view class="_page_map_map-box">
    <map
      id="map3"
      ref="map3"
      class="_page_map_map"
      :longitude="current_area.longitude"
      :latitude="current_area.latitude"
      :show-location="true"
      :show-compass="true"
      :enable-rotate="true"
      :enable-3D="true"
      :enable-scroll="true"
      :enable-zoom="true "
      :enable-overlooking="true"
      :scale="scale"
      @controltap="controltap"
      :markers="markers"
      @markertap="markertap"
      @regionchange="regionchange"
      style="width: 100%;height:100%;"
    ></map>
    <!--  #ifndef MP-QQ-->
    <cover-view @tap="searchCheckTap(1)" class="map-cover-view4">
      <cover-image :src="imgData.regionSearch" class="_page_map_img"></cover-image>
    </cover-view>
    <!--  #endif -->
    <cover-view @tap="scaleTap" class="map-cover-view">
      <cover-image :src="imgData.mapScale" class="_page_map_img"></cover-image>
    </cover-view>
    <cover-view @tap="aimTap" class="map-cover-view2">
      <cover-image :src="imgData.aim" class="_page_map_img"></cover-image>
    </cover-view>
    <cover-view class="map-cover-view3">
      <cover-image :src="imgData.nahan" class="_page_map_img"></cover-image>
    </cover-view>
    <marker-popup :markerInfo="markerInfo" ref="popupMarker"></marker-popup>
  </view>
</template>
<script>
import {
  mapState,
  mapActions,
  mapGetters
} from "vuex";
const imgIcon = `/static`;
import dayjs from "dayjs";
import markerPopup from "@/components/popup/marker";
export default {
  components: {
    markerPopup
  },
  data() {
    return {
      imgData: {
        mapScale: `${imgIcon}/icon_lessen.png`,
        aim: `${imgIcon}/icon_location.png`,
        nahan: `${imgIcon}/nahan.png`,
        regionSearch: `${imgIcon}/icon_search.png`
      },
      recommendBanners: [],
      mapCtx: "",
      scale: 12,
      markers: [],
      markerInfo: null,
      current_area: {}
    };
  },
  async onLoad(op) {
    this.mapCtx = uni.createMapContext("map3");
    console.log(op, "??op");
    this.current_area.latitude = op.latitude;
    this.current_area.longitude = op.longitude;
    console.log("this.current_area", this.current_area);
    uni.showLoading({
      title: "加载中"
    });
    const res = await this.$api.banners({
      type: this.platform,
      tab: 0
    });
    this.recommendBanners = res.data.data.list;
    console.log("this.recommendBanners", this.recommendBanners);
    if (op.id&&this.type===0) {
      await this.showMarkerDetail(op.id)
    }
    uni.hideLoading();
  },
  onShareAppMessage(res) {
    return {
      title: "疫况",
      success: function (res) {
        uni.showShareMenu({
          withShareTicket: true
        });
      },
      fail: function (res) {}
    };
  },
  computed: {
    ...mapState("app", {
      global_current_area: state => state.current_area,
      platform: state => state.platform,
      type: state => state.type
    })
  },
  methods: {
    async showMarkerDetail(id) {
      this.$api
        .getShopDetail(id, {
          lon: this.global_current_area.longitude,
          lat: this.global_current_area.latitude
        },this.type)
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
          uni.hideLoading();
        })
        .catch(err => {
          uni.hideLoading();
          console.log(err, "??err");
        });
    },
    async searchCheckTap() {
      uni.chooseLocation({
        success: async res => {
          this.current_area = res;
        }
      });
    },
    async getMapRegionShop() {
      // 获取当前地图的视野范围
      const {
        southwest,
        northeast
      } = await this.getRegion();
      const {
        latitude,
        longitude
      } = await this.getCenterLocation();
      let params = {
        southwest,
        northeast,
        centerLongitude: longitude,
        centerLatitude: latitude
      };
      // console.log('mapDataparamsRes>>', params)
      const res = await this.$api.markers(params, this.type);
      console.log("mapDataRes>>", res.data.data);
      return res.data.data.markers || [];
    },
    async scaleTap() {
      uni.navigateBack({
        delta: 1
      });
    },
    async aimTap() {
      uni.getLocation({
        type: "gcj02",
        success: async res => {
          this.mapCtx.moveToLocation({
            latitude: this.current_area.latitude,
            longitude: this.current_area.longitude
          });
          this.scale = 12;
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
            uni.showToast({
              title: "访问位置被拒绝"
            });
          } else {
            uni.showToast({
              title: err.errMsg
            });
          }
          // #endif
        }
      });
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
      // 获取当前地图的视野范围
      const {
        southwest,
        northeast
      } = await this.getRegion();
      const {
        latitude,
        longitude
      } = await this.getCenterLocation();
      let params = {
        southwest,
        northeast,
        centerLongitude: longitude,
        centerLatitude: latitude
      };
      // console.log('mapDataparamsRes>>', params)
      const res = await this.$api.markers(params, this.type);
      console.log("mapDataRes>>", res.data.data);
      return res.data.data.markers || [];
    },
    getSetting: function () {
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
    async regionchange(e) {
      if (e.type === "end") {
        console.log("~~~~", e);
        let status = await this.getSetting();
        if (status === 2) {
          this.showConfirm();
          return;
        }
        this.markers = await this.getMapRegionShop();
      }
    },
    async markertap(e) {
      uni.showLoading({
        title: "加载中"
      });
      let id = e.markerId;
      await this.showMarkerDetail(id)
    },
    controltap(e) {
      // console.log(e.controlId)
    }
  }
};
</script>
<style lang="less" scoped>
cover-view {
  background: none;
}
._page_map_img {
  width: 100%;
  height: 100%;
}
</style>
<style lang="less">
page {
  min-height: 100%;
  background: rgba(245, 245, 245, 1);
}

._page_map_img {
  width: 100%;
  height: 100%;
}

._page_map_map-box {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - var(--window-top));
}

._page_map_map {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - var(--window-top));
}

.map-cover-view4 {
  height: 84rpx;
  width: 84rpx;
  position: absolute;
  // #ifdef MP-ALIPAY
  left: 32rpx;
  // #endif
  // #ifndef MP-ALIPAY
  right: 32rpx;
  // #endif
  top: 32rpx;
  z-index: 4;
}

.map-cover-view {
  height: 84rpx;
  width: 84rpx;
  position: absolute;
  right: 32rpx;
  bottom: 32rpx;
  z-index: 4;
}

.map-cover-view2 {
  height: 84rpx;
  width: 84rpx;
  position: absolute;
  left: 32rpx;
  bottom: 32rpx;
  z-index: 4;
}

.map-cover-view3 {
  height: auto;
  width: 200rpx;
  position: absolute;
  left: 0;
  right: 0;
  top: 32rpx;
  margin: auto;
  z-index: 4;
}
</style>
