
<template>
  <view id="feedSuccess">
    <view class="s-box">
      <image class="s-icon" :src="imgData.about"></image>
      <view class="s-tit">关于疫况</view>
      <view class="s-txt">疫况小程序为公益项目，旨在帮助用户了解身边的疫情信息，由独立开发者@俊瑶先森 和 @少数派sspai
        团队共同志愿维护。数据均采集于卫健委、政府部分官方网站或政府认证公众号，再由各城市志愿者手工审核整理，不采集和接受任何第三方数据信息。
        <!-- #ifndef MP-ALIPAY -->
        如有疑问及合作请联系开发者微信：bulolo
        <!-- #endif -->
      </view>
      <view class="s-tit">免责声明</view>
      <view class="s-txt">
        因信息搜集、录入以及数据转化过程中，存在失误的可能性，地图坐标信息也可能出现技术偏差，因此疫况定位信息仅供参考，最终信息以官方发布文字为准，疫况无法承担相关审查监督责任，敬请谅解。</view>
      <!-- #ifndef MP-ALIPAY -->
      <image class="code-icon" :src="imgData.code"></image>
      <view class="s-btn active" @tap="copyTap">二维码物料下载链接</view>
      <!-- #endif -->
    </view>
  </view>
</template>


<script>
const imgIcon = `/static`;
export default {
  data() {
    return {
      imgData: {
        about: `${imgIcon}/about.png`,
        code: `${imgIcon}/code.jpg`
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
      async copyTap() {
        uni.setClipboardData({
          //准备复制的数据
          data: 'https://files.webhunt.cn/yikuang/promotion.zip',
          success: function (res) {
            uni.getClipboardData({
              success: function (res) {
                uni.showToast({
                  title: '复制成功'
                })
              }
            })
          }
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
      // text-align: center;
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
      .code-icon {
        width: 268rpx;
        height: 268rpx;
        display: block;
        margin: 0 auto 32rpx;
      }
      .s-txt {
        font-size: 25rpx;
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
