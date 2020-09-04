<!-- 商品列表组件 <pd-list :list="xx"></pd-list> -->
<template>
  <view class="pd-list">
    <view v-for="(pd,index) in list" :key="index">
      <view class="loc-item">
        <view class="loc-main">
          <view class="loc-lt">
            <view class="loc-price">
              <image class="img" :src="pd.url" mode="aspectFill"/>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  const imgIcon = `/static`;
  export default {
    props: {
      list: { // 数据列表
        type: Array,
        default () {
          return []
        }
      }
    },
    data() {
      return {
        dangerImg: `${imgIcon}/danger2.png`
      }
    },
    computed: {
      productStatus() {
        return function(status) {
          switch (status) {
            case 'NORMAL':
              return '上架'
              break;
            case 'UNLIST':
              return '下架'
              break;
            case 'BANNED':
              return '禁卖'
              break;
            case 'IN_CANCEL':
              return '取消中'
              break;
            case 'CANCELLED':
              return '已完成'
              break;
            case 'TO_RETURN':
              return '已取消'
              break;
            case 'TO_RETURN':
              return '退款/退货'
              break;
            case 'DELETED':
              return '已删除'
              break;
            default:
              break;
          }
        }
      }
    },
    methods: {
      pdTap(location) {
        uni.navigateTo({
          url: `/pages/index/map?lon=${location[0]}&lat=${location[1]}`
        })
      },
    }
  }
</script>

<style lang="less">
  /*数据列表*/
  .pd-list {
    .loc-item {
      background: white;
      margin: 32rpx 32rpx 32rpx 32rpx;
      // border-bottom: 1rpx solid rgba(240, 240, 240, 1);
      height: 160rpx;
      .loc-main {
        position: relative;
        display: flex;

        .loc-rt {
          text-align: right;
          position: relative;

          .loc-btn {
            width: 160rpx;
            height: 76rpx;
            text-align: center;
            line-height: 76rpx;
            font-size: 32rpx;
            font-family: PingFangSC-Regular;
            color: rgba(255, 255, 255, 1);
            background: rgba(187, 187, 187, 1);
            border-radius: 8rpx;
            position: absolute;
            right: 0;
            bottom: 0;
          }

          .active {
            background: rgba(78, 140, 238, 1);
          }

          .loc-hint {
            height: 36rpx;
            font-size: 26rpx;
            font-family: PingFangSC-Regular;
            color: rgba(78, 140, 238, 1);
            line-height: 36rpx;
          }

          .loc-distance {
            height: 42rpx;
            font-size: 36rpx;
            font-family: HelveticaNeue;
            color: rgba(51, 51, 51, 1);
            line-height: 44rpx;
            margin-bottom: 32rpx;
          }
        }

        .loc-lt {
          flex: 1.5;

          .loc-txt {
            height: 36rpx;
            font-size: 26rpx;
            font-family: PingFangSC-Regular;
            color: rgba(51, 51, 51, 1);
            line-height: 36rpx;
          }

          .loc-tag {
            margin-bottom: 16rpx;

            .tag {
              display: inline-block;
              height: 36rpx;
              font-size: 26rpx;
              padding: 6rpx 12rpx;
              font-family: PingFangSC-Regular;
              color: rgba(136, 136, 136, 1);
              line-height: 36rpx;
              border-radius: 8rpx;
              border: 1rpx solid rgba(136, 136, 136, 1);
            }
          }

          .loc-price {
            display: flex;
            height: 80rpx;
            font-size: 28rpx;
            font-family: PingFangSC-Regular;
            color: rgba(51, 51, 51, 1);
            line-height: 40rpx;
            margin-bottom: 18rpx;


            .loc-tit {
              height: 80rpx;
              font-size: 36rpx;
              font-family: PingFangSC-Medium;
              color: rgba(51, 51, 51, 1);
              line-height: 80rpx;
              margin-bottom: 32rpx;
              margin-left: 20rpx;

            }

            .img {
             margin-bottom: 32rpx;
              height: 180rpx;
              width: 100%;
            }
          }
        }
      }
    }
  }
</style>
