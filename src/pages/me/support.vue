<template>
  <view>
    <mescroll-uni :top="meScrollTop" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @init="mescrollInit" :fixed="true">
      <!-- <view class="title">【疫况】支持</view> -->
      <support-list :list="pdList"></support-list>
    </mescroll-uni>
  </view>
</template>

<script>
  import {
    mapState,
    mapActions,
    mapGetters
  } from 'vuex'
  const imgIcon = `/static`;
  import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
  import supportList from "@/components/me/pd-list2.vue";
  let interstitialAd = null;
  export default {
    components: {
      MescrollUni,
      supportList,
    },
    data() {
      return {
        mescroll: null,
        hasNext: true,
        district_code: '',
        downOption: {
          auto: true,
          textLoading: 'Tips:',
          textInOffset: '下拉刷新'
        },
        upOption: {
          auto: false,
          page: {
            num: 0,
            size: 10
          },
          noMoreSize: 3,
          empty: {
            tip: "~ 空空如也T T,赞助微信:bulolo ~",
            btnText: ""
          }
        },
        pdList: [],
        isInit: false,
        scrollY: 0,
        keyword: '',
      };
    },
    computed: {

    },
    async onShow() {
      // #ifdef MP-WEIXIN
      console.log('!!!!!!!!interstitialAd', interstitialAd)
      if (interstitialAd) {
        console.log('展示广告')
        interstitialAd.show().catch((err) => {
          console.error('err', err)
        })
      }
      // #endif
    },
    async onLoad() {
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
    methods: {
      mescrollInit(mescroll) {
        console.log('mescrollInit')
        this.mescroll = mescroll;
      },
      downCallback(mescroll) {
        mescroll.resetUpScroll();
      },
      async upCallback(mescroll) {
        try {
          let rows = mescroll.size; // 页长, 默认每页10条
          let page = mescroll.num; // 页码, 默认从1开始
          console.log('rows', rows)
          console.log('page', page)
          const res = await this.$api.supports({
            page,
            rows
          });
          console.log('shpsRes=>', res.data.data)
          this.hasNext = page * rows < res.data.data.totalCount;
          console.log('this.hasNext', this.hasNext)
          const curPageData = res.data.data.list || [];
          console.log(
            "i=" +
            this.i +
            ", mescroll.num=" +
            mescroll.num +
            ", mescroll.size=" +
            mescroll.size +
            ", curPageData.length=" +
            curPageData.length
          );
          mescroll.endSuccess(curPageData.length, this.hasNext);
          //设置列表数据
          if (mescroll.num == 1) this.pdList = []; //如果是第一页需手动制空列表
          this.pdList = this.pdList.concat(curPageData); //追加新数据
          console.log('this.pdList', this.pdList)
        } catch (error) {
          mescroll.endErr();
        }
      }
    }
  };
</script>

<style lang="less">
  page {
    background: #ffffff;
  }
  .title {
    margin-top:20rpx;
    font-size: 30rpx;
    // margin-left:20rpx;
    text-align: center;
    width:100%;
  }
</style>

