<template>
  <cover-view class="marker-fixed" :class="{active}" :animation="animationData">
    <cover-view class="cover-marker" v-if="markerInfo">
      <cover-view class="head">
        <cover-view class="icon">
          <cover-image class="img" :src="markerInfo.iconPath" mode="widthFix" />
        </cover-view>
        <cover-view class="bd">
          <cover-view class="title">{{markerInfo.shop_name}}</cover-view>
          <cover-view class="subtitle">
            距离你
            <cover-view class="distance">{{markerInfo.distance}}</cover-view>
          </cover-view>
        </cover-view>
        <cover-view class="close">
          <cover-image class="img" src="/static/icon_close_black.png" @click="onCloseMarker" />
        </cover-view>
      </cover-view>
      <cover-view class="body">
        <cover-view class="recovery" @click="onClickError">
          信息纠错
          <cover-view class="icon-right">></cover-view>
        </cover-view>
        <cover-view class="content">
          <cover-view class="title">已过去 {{markerInfo.dura}} 天</cover-view>
          <cover-view class="subtitle">{{markerInfo.month}}月{{markerInfo.day}}日发现该确诊病例逗留地</cover-view>
        </cover-view>
        <cover-view class="origin">官方信源：{{markerInfo.source_url || ''}}</cover-view>
        <cover-view class="recommend" v-if="markerInfo.recommend">
          <cover-view class="title">推荐你看:</cover-view>
          <!-- <ad class="img" unit-id="adunit-d2a4114191afc6df"></ad> -->
          <cover-image
           :src="markerInfo.recommend.url"
            mode="widthFix"
            class="img"
            @click="openWeb(markerInfo.recommend)"
          ></cover-image>
        </cover-view>
      </cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup";
import openWeb from "@/common/mixins/openWeb";
import { debounce } from "@/common/util";
export default {
  mixins: [openWeb],
  components: {
    uniPopup
  },
  props: {
    markerInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      active: false,
      animationData: {},
      height: 0
    };
  },
  methods: {
    async open() {
      // #ifndef MP-ALIPAY
      setTimeout(async () => {
        await this.computedHeight();
        let animate = this.animate;
        console.log(this.$refs, "?this.$refs", this.height);
        animate.translate3d(0, -this.height, 0).step();
        this.animationData = animate.export();
        console.log("this.animationData=>", this.animationData, this.height);
      }, 100);
      // #endif
      // #ifdef MP-ALIPAY
      this.active = true;
      // #endif
    },
    close() {
      let animate = this.animate;
      animate.translate3d(0, 0, 0).step();
      this.animationData = animate.export();
      this.active = false;
    },
    onCloseMarker() {
      this.close();
    },
    onChangeMarker() {},
    onClickError() {
      uni.navigateTo({
        url: `/pages/webview?url=${encodeURIComponent(
          "https://poll.sspai.com/f/pA4J0c"
        )}`
      });
    },
    async computedHeight() {
      await this.getNode();
    },
    getNode() {
      // #ifndef MP-ALIPAY
      let q = uni.createSelectorQuery().in(this);
      // #endif
      // #ifdef MP-ALIPAY
      let q = uni.createSelectorQuery();
      // #endif
      q.select(".marker-fixed").boundingClientRect();
      return new Promise(resolve => {
        q.exec(res => {
          let node = res[0];
          console.log(node, "??node", res);
          if (node) {
            this.height = node.height;
            resolve(node.height);
          } else {
            resolve(0);
          }
        });
      });
    }
  },
  created() {
    this.animate = uni.createAnimation({
      duration: 300,
      timingFunction: "ease",
      delay: 0
    }); //官方文档https://uniapp.dcloud.io/api/ui/animation?id=createanimation
    this.computedHeight();
  },
  watch: {
    markerInfo: debounce(function() {
      this.computedHeight();
    }, 100)
  }
};
</script>

<style lang="less" scoped>
.cover-marker {
  position: relative;
  padding: 30rpx;
  box-sizing: border-box;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
  box-shadow: 0 0 4px #ccc;
  .title {
    color: #2a2a2a;
    font-size: 32rpx;
    font-family: ourceHanSansSC-Bold, SourceHanSansSC;
    line-height: 48rpx;
    font-weight: bold;
  }
  .subtitle {
    font-size: 28rpx;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #2a2a2a;
    line-height: 40rpx;
    .distance {
      display: inline;
      color: #0d72ff;
      padding-left: 4rpx;
    }
  }
  .head {
    display: flex;
    padding: 30rpx 0 50rpx;
    border-bottom: 2rpx solid #f4f4f4;
    .icon {
      flex: 0 0 48rpx;
      .img {
        display: block;
        width: 100%;
        height: 58rpx;
      }
    }
    .bd {
      flex: 1;
    }
    .close {
      position: relative;
      flex: 0 0 100rpx;
      transform: translate3d(0, -14rpx, 0);
      .img {
        display: block;
        width: 100%;
        height: 100rpx;
      }
    }
  }
  .body {
    position: relative;
    padding: 60rpx 10rpx 0;
    .recovery {
      position: absolute;
      top: 44rpx;
      right: 0;
      color: #797979;
      font-size: 24rpx;
      .icon-right {
        display: inline;
        padding: 0 4rpx;
        color: #414141;
      }
    }

    .origin {
      height: 78rpx;
      line-height: 78rpx;
      font-size: 24rpx;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: rgba(121, 121, 121, 1);
      text-align: center;
      background: rgba(248, 248, 248, 1);
      border-radius: 4rpx;
      margin: 54rpx 0 44rpx;
    }
    .recommend {
      line-height: 1!important;
      .title {
        color: #b8b8b8;
        font-size: 28rpx;
        line-height: 40rpx;
      }
      .img {
        margin: 24rpx 0;
        height: 200rpx;
        width: 100%;
        border-radius: 12rpx;
      }
    }
  }
}

.marker-fixed {
  position: fixed;
  z-index: 99;
  left: 0;
  top: 100vh;
  width: 100%;
  transition: transform 0.3s;
  transform: translate3d(0, 0, 0);
  // transform: translateY(0);
  &.active {
    transform: translate3d(0, -100%, 0);
    // transform: translateY(-100%);
  }
}
</style>