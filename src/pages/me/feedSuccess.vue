
<template>
  <view id="feedSuccess">
    <view class="s-box">
      <image class="s-icon" :src="imgData.evaluateSuccess"></image>
      <view class="s-tit">反馈成功</view>
      <view class="s-txt">感谢您宝贵的建议</view>
      <view class="s-btn active" @tap="backTap">返回</view>
    </view>
  </view>
</template>


<script>
const imgIcon = `/static`;
export default {
  data() {
    return {
      imgData: {
        evaluateSuccess: `${imgIcon}/evaluateSuccess.png`
      }
    }
  },
  async onLoad() {

  },
  onShareAppMessage(res) {
    return {
      title: '疫况',
      success: function (res) {
        // 转发成功
        uni.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  methods: {
    async backTap() {
      await uni.navigateBack({
        delta: 2 // 返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      })

    }
  }
}
</script>

<style lang="less">
  page {
    min-height: 100%;
    background: rgba(245, 245, 245, 1);
  }
  #feedSuccess {
    .s-box {
      padding: 48rpx 64rpx 64rpx;
      background: #fff;
      text-align: center;
      .s-btn {
        height: 76rpx;
        line-height: 76rpx;
        background: rgba(187, 187, 187, 1);
        border-radius: 8rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Regular;
        color: rgba(255, 255, 255, 1);
        text-align: center;
      }
      .active {
        background: rgba(78, 140, 238, 1);
      }
      .s-icon {
        width: 128rpx;
        height: 128rpx;
        display: block;
        margin: 0 auto 32rpx;
      }
      .s-txt {
        font-size: 28rpx;
        font-family: PingFangSC-Regular;
        color: rgba(51, 51, 51, 1);
        line-height: 40rpx;
        margin-bottom: 24rpx;
      }
      .s-tit {
        font-size: 36rpx;
        font-family: PingFangSC-Regular;
        color: rgba(51, 51, 51, 1);
        line-height: 50rpx;
        margin-bottom: 16rpx;
      }
    }
  }
</style>
