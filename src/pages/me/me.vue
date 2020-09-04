<template>
    <view>
      <view id="user">
        <view class="us-main">
          <image class="us-bg" :src="imgData.userBg"></image>
          <!-- #ifdef MP-WEIXIN -->
          <view class="us-info">
            <view class="us-img">
              <image :src="user.portrait_url||imgData.defaultAuthor"></image>
              <button style='height:144rpx;width:144rpx;opacity:0;position:absolute;z-index: 99999;' v-if="!user"
                open-type="getUserInfo" @getuserinfo="onGotUserInfo">微信授权登录</button>
            </view>
            <view class="us-name">
              <text style="color:white;">{{user.name || '点击头像登录'}}</text>
            </view>
          </view>
          <!-- #endif -->
        </view>
        <view class="us-handle">
          <view class="item" @tap="feedbackTap" style="border-right:none;">
            <image :src="imgData.idea"></image>
            <view class="tit">意见反馈</view>
          </view>
          <view class="item" @tap="supportTap" style="border-right:none;">
            <image :src="imgData.support"></image>
            <view class="tit">赞助支持</view>
          </view>
          <view class="item" @tap="aboutTap" style="border-right:none;">
            <image :src="imgData.about"></image>
            <view class="tit">关于</view>
          </view>
          <!-- #ifdef MP-WEIXIN -->
          <view class="item" @tap="subTap" style="border-right:none;">
            <image :src="imgData.sub"></image>
            <view class="tit">消息订阅</view>
          </view>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <view class="item" @tap="followTap" style="border-right:none;">
            <image :src="imgData.follow"></image>
            <view class="tit">关注公众号</view>
          </view>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <view class="item" @tap="zmTap" style="border-right:none;">
            <image :src="imgData.zm"></image>
            <view class="tit">最美小程序</view>
          </view>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <view class="item" v-if="user" @tap="logout" style="border-right:none;">
            <image :src="imgData.logout"></image>
            <view class="tit">退出登录</view>
          </view>
          <!-- #endif -->
          <!-- #ifdef MP-ALIPAY -->
          <view class="item" @tap="onClickBuy" style="border-right:none;">
            <image :src="imgData.buy"></image>
            <view class="tit">代买代送</view>
          </view>
          <!-- #endif -->
          <!-- #ifdef MP-ALIPAY -->
          <view class="item" @tap="onClickHos" style="border-right:none;">
            <image :src="imgData.hospital_icon"></image>
            <view class="tit">周边医况</view>
          </view>
          <!-- #endif -->
        </view>
      </view>
      <view class="popup-mask" v-show="showFollowTip">
        <view class="bind-box">
          <view class="bind-tit">关注说明</view>
          <view class="take-main">
            <view class="take-money">操作步骤
              <!-- <text>操作步骤</text> -->
            </view>
            <!-- <view class="take-hint">操作步骤</view> -->
            <view class="take-txt">点击“确认”,进入客服模式</view>
            <view class="take-txt">回复：1，获取关注二维码</view>
            <view class="take-txt">扫描二维码关注</view>
          </view>
          <view class="bind-btn">
            <view class="btn no" @tap="closeTap">取消</view>
            <view class="btn yes" @tap="submitTap">
              <button
                style='height:100%;width:100%;opacity:0;position:absolute;z-index: 99999;'
                open-type="contact"></button>
              确定</view>
          </view>
        </view>
      </view>
    </view>
</template>

<script>
const app = getApp()
const imgIcon = `/static`;
  let interstitialAd = null;
import {
  mapState,
  mapActions,
  mapGetters
} from 'vuex'
export default {
  name: "",
  data() {
    return {
      showFollowTip:false,
      imgData: {
        userBg: `${imgIcon}/myBg.jpg`,
        defaultAuthor: `${imgIcon}/defaultAuthor.png`,
        order: `${imgIcon}/order.png`,
        idea: `${imgIcon}/idea.png`,
        about: `${imgIcon}/about2.png`,
        isz: `${imgIcon}/isz.jpg`,
        support: `${imgIcon}/support.png`,
        buy: `${imgIcon}/buy.png`,
        hospital_icon: `${imgIcon}/hospital_icon.png`,
        sub: `${imgIcon}/sub.png`,
        logout: `${imgIcon}/logout.png`,
        follow:`${imgIcon}/follow.png`,
        zm:`${imgIcon}/zm.png`,
      }
    }
  },
  async onLoad() {
    // #ifdef MP-WEIXIN
    await uni.login({
      provider: 'weixin'
    });
    // #endif;
    // #ifdef MP-WEIXIN
    if (uni.createInterstitialAd) {
      interstitialAd = uni.createInterstitialAd({
        adUnitId: 'adunit-2a86ad0498f74f38'
      })
      interstitialAd.onLoad(() => {
        console.log('插屏 广告加载成功')
      })
      interstitialAd.onError((err) => {
        console.log('onError event emit', err)
      })
      interstitialAd.onClose((res) => {
        console.log('onClose event emit', res)
      })
    }
    // #endif
  },
  async onShow() {
    await this.updateUser()
    console.log('this.user', this.user)
    if (interstitialAd) {
      console.log('展示广告')
      interstitialAd.show().catch((err) => {
        console.error('err', err)
      })
    }
  },
  onShareAppMessage(res) {
    return {
      title: '查查离我最近-“新型肺炎”病人，曾到过的小区！',
      // path: '',
      // imageUrl: '',
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
  computed: {
    ...mapState('user', {
      user: state => state.user,
    }),
  },
  methods: {
    ...mapActions('user', ['updateUser']),

    async onGotUserInfo(e) {
      console.log('e>>', e)
      let [error, res] = await uni.login({
        provider: 'weixin'
      });
      if (error) {
        uni.showToast({
          title: '登陆失败',
          icon: 'none'
        });
      } else {
        let code = res.code
        uni.showLoading({
          title: '加载中',
          mask: true
        });
        const playload = {
          code: res.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }
        console.log(playload)
        try {
          const loginRes = await this.$api.loginByOauth(playload)
          uni.setStorageSync('user', loginRes.data.data);
          await this.updateUser()
          uni.hideLoading()
        } catch (error) {
          uni.showToast({
            title: '登陆失败,请稍后尝试',
            icon: 'none'
          });
          uni.hideLoading()
        }
      }
    },
    async zmTap(){
      uni.navigateToMiniProgram({
						appId: 'wxb036cafe2994d7d0',
						path: `/portal/group-profile/group-profile?group_id=13104376024469214&invite_ticket=BgAAks2FLXLUJS-17-p9Ndvp6A&fromScene=bizArticle`,
						envVersion: 'release',
						success(res) {
							// 打开成功
						}
					})
    },
    async followTap() {
      this.showFollowTip = true
    },
    async submitTap(){
      this.showFollowTip = false
    },
    async closeTap(){
      this.showFollowTip = false
    },
    async subTap() {
      uni.requestSubscribeMessage({
        tmplIds: ['d8HL9Jb3XgOOnuSEytTR2o9ThntiGXD2fzRQShCfJRw'],
        success: async (res) => {
          if (this.user) {
            try {
              const params = {
                type: 1,
                template_id: 'd8HL9Jb3XgOOnuSEytTR2o9ThntiGXD2fzRQShCfJRw',
                open_id: this.user.open_id
              }
              console.log('params', params)
              const subscribeRes = await this.$api.subscribe(params)
              console.log('subscribeRes>>', subscribeRes.data)
              if (subscribeRes.data.code === 0) {
                uni.showToast({
                  title: `订阅成功`,
                  icon: 'none'
                })
              } else {
                uni.showToast({
                  title: `已经订阅`,
                  icon: 'none'
                })
              }
            } catch (error) {
              uni.showToast({
                  title: `*订阅成功`,
                  icon: 'none'
                })
            }
            
          } else {
            uni.showToast({
              title: `*订阅成功`,
              icon: 'none'
            })
          }
        }
      })
    },
    async logout() {
      uni.removeStorageSync('user');
      await this.updateUser()
      console.log('this.user', this.user)
    },
    supportTap() {
      uni.navigateTo({
        url: '/pages/me/support'
      });
    },
    feedbackTap() {
      uni.navigateTo({
        url: `/pages/webview?url=${encodeURIComponent('https://poll.sspai.com/f/pA4J0c')}`
      });
      // uni.navigateTo({
      // 			url: '/pages/me/feedback'
      // 		});
    },
    aboutTap() {
      uni.navigateTo({
        url: '/pages/me/about'
      });
    },
    onClickHos() {
      uni.navigateToMiniProgram({
        path: "pages/index/index",
        appId: "2021001118617822"
      })
    },
    onClickBuy() {
      // #ifdef MP-ALIPAY
      uni.navigateToMiniProgram({
        appId: '2021001118604221',
      });
      // #endif;
    }
  }
}
</script>
<style lang="less">
page {
    background: #FFFFFF;
}
  .popup-mask {
      background: rgba(0, 0, 0, 0.5);
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
      .bind-box {
        width: 686rpx;
        position: relative;
        margin: 242rpx auto;
        background: rgba(255, 255, 255, 1);
        border-radius: 8rpx;
        padding-bottom: 104rpx;
        overflow: hidden;
        .take-main {
          padding: 32rpx;
          text-align: center;
          border-top: 1rpx solid rgba(240, 240, 240, 1);
          .take-money {
            line-height: 84rpx;
            font-size: 36rpx;
            font-family: HelveticaNeue;
            color: rgba(78, 140, 238, 1);
            text {
              font-size: 72rpx;
            }
          }
          .take-txt {
            font-size: 28rpx;
            font-family: PingFangSC-Regular;
            color: rgba(136, 136, 136, 1);
            line-height: 40rpx;
          }
          .take-hint {
            font-size: 28rpx;
            font-family: PingFangSC-Regular;
            color: rgba(78, 140, 238, 1);
            line-height: 40rpx;
            margin-bottom: 22rpx;
          }
        }
        .bind-btn {
          height: 104rpx;
          line-height: 104rpx;
          width: 100%;
          position: absolute;
          left: 0;
          bottom: 0;
          text-align: center;
          display: flex;
          .btn {
            flex: 1;
            display: flex;
            align-items:center;
            text-align: center;
            justify-content: center;
            font-size: 36rpx;
            font-family: PingFangSC-Regular;
          }
          .yes {
            color: rgba(255, 255, 255, 1);
            background: rgba(78, 140, 238, 1);
          }
          .no {
            background: rgba(224, 230, 240, 1);
            color: rgba(51, 51, 51, 1);
          }
        }
        .bind-tit {
          height: 44rpx;
          font-size: 32rpx;
          font-family: PingFangSC-Regular;
          color: rgba(51, 51, 51, 1);
          line-height: 44rpx;
          text-align: center;
          padding: 32rpx;
        }
      }
    }
#user {
    .popup-mask {
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        .bind-box {
            width: 686rpx;
            position: relative;
            margin: 242rpx auto;
            background: rgba(255, 255, 255, 1);
            border-radius: 8rpx;
            padding-bottom: 104rpx;
            overflow: hidden;
            .bind-main {
                margin: 8rpx 16rpx 38rpx;
                .bind-item {
                    position: relative;
                    margin-bottom: 16rpx;
                    box-sizing: border-box;
                    height: 92rpx;
                    background: rgba(245, 249, 255, 1);
                    border-radius: 8rpx;
                    input {
                        margin: 0 32rpx;
                        padding: 20rpx 0;
                        font-size: 16px;
                        font-family: PingFangSC-Regular;
                        color: #666;
                        line-height: 22px;
                    }
                }
                .code-box {
                    padding-right: 224rpx;
                    .code-btn {
                        width: 224rpx;
                        height: 96rpx;
                        line-height: 96rpx;
                        background: rgba(78, 140, 238, 1);
                        border-radius: 0 8rpx 8rpx 0;
                        text-align: center;
                        position: absolute;
                        right: 0;
                        top: 0;
                        font-size: 32rpx;
                        font-family: PingFangSC-Regular;
                        color: rgba(255, 255, 255, 1);
                    }
                }
            }
            .bind-btn {
                height: 104rpx;
                line-height: 104rpx;
                width: 100%;
                position: absolute;
                left: 0;
                bottom: 0;
                text-align: center;
                display: flex;
                .btn {
                    flex: 1;
                    font-size: 36rpx;
                    font-family: PingFangSC-Regular;
                }
                .yes {
                    color: rgba(255, 255, 255, 1);
                    background: rgba(78, 140, 238, 1);
                }
                .no {
                    background: rgba(224, 230, 240, 1);
                    color: rgba(51, 51, 51, 1);
                }
            }
            .bind-tit {
                height: 44rpx;
                font-size: 32rpx;
                font-family: PingFangSC-Regular;
                color: rgba(51, 51, 51, 1);
                line-height: 44rpx;
                text-align: center;
                padding: 32rpx;
            }
        }
    }
    .bor-bom {
        border-bottom: 16rpx solid rgba(245, 245, 245, 1);
    }
    .service-tit {
        height: 56rpx;
        font-size: 40rpx;
        font-family: PingFangSC-Medium;
        color: rgba(51, 51, 51, 1);
        line-height: 56rpx;
        padding: 32rpx;
    }
    .us-handle {
        display: flex;
        flex-wrap: wrap;
        .item {
            flex: 0 0 33.33%;
            text-align: center;
            border-bottom: 1rpx solid rgba(240, 240, 240, 1);
            border-right: 1rpx solid rgba(240, 240, 240, 1);
            padding: 40rpx 0;
            image {
                width: 72rpx;
                height: 72rpx;
                display: block;
                margin: 0 auto 40rpx;
            }
            .tit {
                height: 40rpx;
                font-size: 28rpx;
                font-family: PingFangSC-Regular;
                color: rgba(78, 140, 238, 1);
                line-height: 40rpx;
            }
        }
    }
    .us-main {
        width: 750rpx;
        height: 368rpx;
        position: relative;
        .us-info {
            position: relative;
            z-index: 2;
            text-align: center;
            padding-top: 78rpx;
            .us-name {
                height: 34rpx;
                font-size: 24rpx;
                font-family: PingFangSC-Regular;
                line-height: 34rpx;
                .tel {
                    color: #fff;
                    margin-right: 16rpx;
                }
                .oth {
                    color: rgba(229, 0, 59, 1);
                }
            }
            .us-img {
                overflow: hidden;
                display: flex;
                width: 144rpx;
                height: 144rpx;
                margin: auto;
                margin-bottom: 16px;
                border-radius: 50%;
                border: 2px solid #fff;
                box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
                image {
                    width: 100%;
                    height: 100%;
                    border-right: 50%;
                    border-radius: 50%;
                }
            }
        }
        .us-bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
    }
}
</style>



