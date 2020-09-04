
<template>
  <view id="feedback">
    <view class="q-box">
      <view class="q-tit">反馈内容</view>
      <view class="q-txt">
        <textarea placeholder="请说出您的建议以便我们更快帮您处理,合作请添加微信:bulolo" placeholder-class="placeholder" @input="inputChange" />
      </view>
      <view class="q-btn active" @tap="submitTap">提交</view>
    </view>
  </view>
</template>

<script>
	const imgIcon = `/static`;
	export default {
		data() {
			return {
      ossConfig: null,
      content: '',
      uploadPhotos: [],
      uploadedUrls: [],
      imgData: {
        uploadImg: `${imgIcon}/uploadImg.png`,
        del: `${imgIcon}/del.png`
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
      inputChange(e) {
        this.content = e.detail.value
        console.log(this.content)
      },
      async submitTap(){
        let params = {
            content: this.content,
            ext: {
              photos: this.uploadedUrls || []
            }
          }
          console.log(params)
        const res = await this.$api.feedback(params)
        console.log('feedbackRes>>', res.data.data)
        
        if (res.data.code === 0) {
          uni.navigateTo({
            url: '/pages/me/feedSuccess'
          })
        } else {
        uni.showToast({
          title: "反馈失败，请联系微信:bulolo"
        })
        }
               
      }
		}
	}
</script>


<style lang="less">

  page {
    min-height: 100%;
    background: rgba(245, 245, 245, 1);
  }
  #feedback {
    padding: 32rpx;
    .q-box {
      padding: 32rpx 32rpx 48rpx;
      background: #fff;
      border-radius: 8rpx;
      .q-handle {
        margin-bottom: 12rpx;
        font-size: 0;
        .img-item {
          width: 140rpx;
          height: 140rpx;
          position: relative;
          display: inline-block;
          margin-right: 20rpx;
          margin-bottom: 20rpx;
          .del-btn {
            position: absolute;
            width: 28rpx;
            height: 28rpx;
            top: -14rpx;
            right: -14rpx;
          }
          .img {
            width: 100%;
            height: 100%;
          }
        }
        .img-item:nth-child(4) {
          margin-right: 0;
        }
      }
      .q-btn {
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
      .q-tit {
        height: 40rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular;
        color: rgba(51, 51, 51, 1);
        line-height: 40rpx;
        margin-bottom: 32rpx;
      }
      .q-txt {
        height: 190rpx;
        background: rgba(245, 249, 255, 1);
        border: 1rpx solid rgba(224, 230, 240, 1);
        box-sizing: border-box;
        margin-bottom: 32rpx;
        .placeholder {
          color: rgba(175, 190, 214, 1);
        }
        textarea {
          color: #333;
          font-size: 28rpx;
          font-family: PingFangSC-Regular;
          line-height: 40rpx;
          padding: 9rpx 13rpx;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }
      }
    }
  }
</style>


