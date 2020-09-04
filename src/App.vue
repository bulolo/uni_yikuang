<script>
  import {
    mapState,
    mapActions,
    mapGetters
  } from 'vuex'
  export default {
    globalData: {
      statusBarHeight: '20',
    },
    computed: {

    },
    methods: {

    },
    onLaunch: function (options) {
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      } else {
        console.log('启动云开发')
        wx.cloud.init({
          traceUser: true
        });
      }
      console.log(options.scene)
      uni.getSystemInfo({
        success: (res) => {
          this.$options.globalData.statusBarHeight = res.statusBarHeight
          console.log('statusBarHeight', this.$options.globalData.statusBarHeight)
        }
      })
    },
    async onShow() {
      const updateManager = uni.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
      })
      updateManager.onUpdateReady(function() {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function() {
        // 新版本下载失败
        console.log('新版本下载失败')
      })
      console.log('App Show')
    },
    onHide() {
      console.log('App Hide')
    }
  }
</script>

<style>
  /* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
  @import './common/uni.css';
  /* 以下样式用于 hello uni-app 演示所需 */
  page {
    background-color: #F4F5F6;
    height: 100%;
    font-size: 28upx;
    line-height: 1.8;
  }
  cover-view {
    background: none;
  }
</style>
