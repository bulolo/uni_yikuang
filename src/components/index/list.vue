<template>
  <view class="loc-item" @tap="pdTap(item)">
    <view class="loc-main">
      <view class="loc-lt">
        <view class="name_position">
          <image class="img" mode="widthFix" :src="item.iconPath || red_mark" />
          <text class="shop_name">{{type===0?item.shop_name:item.name}}</text>
        </view>
        <view class="loc-tag" v-if="type===0">
          <view class="address">{{item.address}}</view>
        </view>
        <view class="loc-tag2" v-if="type===1">
          <view>
            <image class="img" v-if="item.is_core===true" :src="hospital_type1" />
          </view>
          <view>
            <image class="img2" v-if="item.is_fever===true" :src="hospital_type2" />
          </view>
        </view>
        <view class="detail_address">{{type===0?item.detail_address:item.address}}</view>
      </view>
      <view class="loc-rt">
        <view class="loc-distance">{{item.distance}}</view>
        <view class="loc-hint" v-if="index===0 && hideNearTip===false">离你最近</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
const imgIcon = `/static`;
export default {
  props: {
    item: {
      // 数据列表
      type: Object,
      default() {
        return {};
      }
    },
    index: {
      // 数据列表
      type: Number,
      default() {
        return 0;
      }
    },
    hideNearTip: {
      // 数据列表
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      red_mark: `${imgIcon}/red_mark.png`,
      hospital_type1: `${imgIcon}/hospital_type1.png`,
      hospital_type2: `${imgIcon}/hospital_type2.png`
    };
  },
  computed: {
    ...mapState("app", {
      current_area: state => state.current_area,
      type: state => state.type
    })
  },
  methods: {
    ...mapActions("app", ["updateCurrentArea","updateType"]),
    pdTap(item) {
      uni.navigateTo({
        url: `/pages/index/map?id=${item.id}&latitude=${item.location.coordinates[1]}&longitude=${item.location.coordinates[0]}`
      });
      // uni.navigateTo({
      //   url: `/pages/index/map?longitude=${this.current_area.longitude}&latitude=${this.current_area.latitude}`
      // });
    }
  }
};
</script>


<style lang="less">
.loc-item {
  background: white;
  padding: 22rpx;
  border-bottom: 1rpx solid rgba(240, 240, 240, 1);

  .loc-main {
    position: relative;
    display: flex;
    .loc-rt {
      text-align: right;
      position: relative;
      flex: 0 0 auto;
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
      display: flex;
      flex: 1;
      flex-direction: column;
      .detail_address {
        width: 400rpx;
        margin-left: 60rpx;
        height: auto;
        font-size: 26rpx;
        font-family: PingFangSC-Regular;
        color: rgba(51, 51, 51, 1);
        line-height: 36rpx;
        margin-bottom: 16rpx;
        width: inherit;
        display: block;
        white-space: normal;
      }
      .loc-tag2 {
        margin-left: 60rpx;
        margin-bottom: 16rpx;
        display: flex;
        height: 40rpx;
        // background: red;
        width: 100%;
        .img{
          width: 220rpx;    
          height: 44rpx;    
        }
        .img2{
          margin-left: 10rpx;
          width: 132rpx;
          height: 44rpx; 
        }
        .address {
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
      .loc-tag {
        margin-left: 60rpx;
        margin-bottom: 16rpx;
        .address {
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
      .name_position {
        display: flex;
        height: 80rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular;
        color: rgba(51, 51, 51, 1);
        line-height: 40rpx;
        // margin-bottom: 8rpx;
        .shop_name {
          height: 80rpx;
          font-size: 36rpx;
          font-family: PingFangSC-Medium;
          color: rgba(51, 51, 51, 1);
          line-height: 80rpx;
          margin-bottom: 32rpx;
          width: 460rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
          // background: red;
        }

        .img {
          // height: 80rpx;
          width: 60rpx;
          height: auto;
        }

        text {
          margin-right: 16rpx;
        }
      }
    }
  }
}
</style>
