<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="url"></web-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        url: '',
        webviewStyles: {
          progress: {
            color: '#FF3333'
          }
        }
      }
    },
    async onLoad(op) {
      this.url = decodeURIComponent(op.url)
      console.log(this.url)
    },
    onShareAppMessage(res) {
			return {
				title: '虾皮助手-虾皮网址导航',
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
			}
		},
  }
</script>

<style>

</style>
