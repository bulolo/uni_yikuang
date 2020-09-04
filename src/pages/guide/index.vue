<template>
  <view class="news">
    <!-- #ifdef MP-WEIXIN -->
    <view style="margin:20rpx 20rpx;position:relative;">
      <official-account @error="adError" @load="adLoad"></official-account>
    </view>
    <!-- #endif -->
    <view class="swiper-box">
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
        <swiper-item v-for="(item, index) in banners" :key="index" class="swiper-item">
          <image :src="item.url" mode="scaleToFill" class="img" @click="openWeb(item)" />
        </swiper-item>
      </swiper>
    </view>
    <view class="news-box">
      <view class="news-list" v-for="(item, index) in news" :key="index">
        <view class="title">
          <text>{{item.title}}</text>
        </view>

        <view class="list" v-if="item.list && item.list.length">
          <view
            class="item"
            v-for="(child, nIndex) in item.list"
            :key="nIndex"
            @click="openArticle(child)"
          >
            <view class="thumb" :style="{backgroundImage: 'url('+ (child.pic) +')'}"></view>

            <view class="news-title">
              <text>{{child.title}}</text>
            </view>

            <view class="zone">
              <view class="name">{{child.author}}</view>
              <view class="time" v-if="child.time">{{child.time}}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="article-origin">内容来自少数派</view>
  </view>
</template>

<script>
import openWeb from "@/common/mixins/openWeb";
import { mapState } from "vuex";
let interstitialAd = null;
export default {
  mixins: [openWeb],
  data() {
    return {
      indicatorDots: true, // 是否显示面板指示点
      indicatorColor: "rgba(136,136,136,1)", // 指示点颜色
      indicatorActiveColor: "rgba(78,140,238,1)", // 当前选中的指示点颜色
      circular: true, // 是否采用衔接滑动
      autoplay: true, // 是否自动切换
      interval: 4000, // 自动切换时间间隔
      duration: 800, // 滑动动画时长·
      banners: [],
      news: [],
    };
  },
  computed: {
    ...mapState("app", ["platform"]),
  },
  async onLoad() {
    // #ifdef MP-WEIXIN
    if (uni.createInterstitialAd) {
      interstitialAd = uni.createInterstitialAd({
        adUnitId: "adunit-2a86ad0498f74f38",
      });
      interstitialAd.onLoad(() => {
        console.log("插屏 广告加载成功");
      });
      interstitialAd.onError((err) => {
        console.log("onError event emit", err);
      });
      interstitialAd.onClose((res) => {
        console.log("onClose event emit", res);
      });
    }
    // #endif
  },
  async onShow() {
    let res2 = await this.$api.banners({
      type: this.platform,
      tab: 3,
    });

    this.banners = res2.data.data.list || [];
    let res = await this.$api.guides();
    console.log(res.data.data.news, "?res articles");

    // #ifdef  MP-WEIXIN
    this.news = res.data.data.news;
    console.log("微信");
    // #endif
    // #ifdef  MP-QQ
    this.news = res.data.data.qq_news;
    console.log("QQ");
    // #endif
    // #ifdef  MP-ALIPAY
    this.news = res.data.data.alipay_news;
    console.log("支付宝");
    // #endif

    if (interstitialAd) {
      console.log("展示广告");
      interstitialAd.show().catch((err) => {
        console.error("err", err);
      });
    }
  },
  methods: {
    adError() {
      console.log("关注组件加载失败");
    },
    adLoad() {
      console.log("关注组件加载完成");
    },
    openArticle(item) {
      uni.navigateTo({
        url: `/pages/webview?url=${encodeURIComponent(item.link)}`,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.news {
  min-height: calc(100vh - var(--window-top) - var(--window-bottom));
  background: #f8f8f8;
}

.swiper-box {
  // padding: 25rpx 0;
  padding-top: 30rpx;
  box-sizing: border-box;

  .swiper {
    height: 410rpx;
    position: relative;
    width: 100%;
    padding-bottom: 8rpx;
    box-sizing: border-box;
    background: #fff;

    .swiper-item {
      height: 410rpx;
      padding: 0 25rpx;
      border-radius: 16rpx;
      box-sizing: border-box;
      overflow: hidden;

      .img {
        display: block;
        width: 100%;
        height: 350rpx;
        border-radius: 16rpx;
        margin: 0 auto;
        overflow: hidden;
      }
    }
  }
}

.news-box {
  position: relative;
  > .news-list {
    background: #fff;
    padding: 10rpx 36rpx 20rpx;
    margin-bottom: 20rpx;
    > .title {
      padding: 20rpx 0;
      color: #2a2a2a;
      font-size: 36rpx;
      font-weight: bold;
      line-height: 52rpx;
    }
    > .list {
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      justify-content: space-between;
      > .item {
        flex: 0 0 320rpx;
        margin-bottom: 40rpx;
        > .thumb {
          width: 320rpx;
          height: 160rpx;
          background-size: cover;
          background-position: center center;
          border-radius: 8rpx;
        }

        > .news-title {
          color: #2a2a2a;
          font-size: 24rpx;
          line-height: 36rpx;
          padding: 12rpx 0 6rpx;
        }

        > .zone {
          display: flex;
          color: #b2b2b2;
          font-size: 20rpx;
          line-height: 24rpx;

          > .name {
            flex: 1;
            font-size: 20rpx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          > .time {
            flex: 0 0 auto;
            font-size: 20rpx;
          }
        }
      }
    }
  }
}

.article-origin {
  text-align: center;
  padding: 40rpx 30rpx 60rpx;
  box-sizing: border-box;
}
</style>