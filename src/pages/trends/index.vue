<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="url"></web-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        url: 'https://yikuang.webhunt.cn/',
        webviewStyles: {
          progress: {
            color: '#FF3333'
          }
        }
      }
    },
    async onTabItemTap() {
      this.url = `https://yikuang.webhunt.cn/`
    },
    onShareAppMessage(res) {
			return {
				title: '疫况',
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
  methods: {
  }
  }
</script>

<style>

</style>
