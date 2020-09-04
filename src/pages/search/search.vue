<template>
  <view>
    <view v-if="type===0">
      <HMfilterDropdown
        :filterData="filterData"
        :defaultSelected="filterDropdownValue"
        :updateMenuName="true"
        @confirm="confirm"
      ></HMfilterDropdown>
    </view>
    <mescroll-uni
      :top="meScrollTop"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
      @init="mescrollInit"
      :fixed="true"
    >
      <pd-list
        v-for="(item, index) in pdList"
        :item="item"
        :index="index"
        :key="index"
        :hideNearTip="true"
      ></pd-list>
    </mescroll-uni>
     <!--  #ifndef MP-QQ-->
    <cover-view class="search-btn" @tap="searchCheckTap()">
      <cover-image class="img-icon" :src="imgData.icon_search2"></cover-image>
    </cover-view>
     <!--  #endif -->
    <cover-view class="aim-btn" @tap="aimTap()">
      <cover-image class="img-icon" :src="imgData.icon_location2"></cover-image>
    </cover-view>
  </view>
</template>

<script>
import {
  mapState,
  mapActions,
  mapGetters
} from "vuex";
const imgIcon = `/static`;
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
import PdList from "@/components/index/list.vue";
import HMfilterDropdown from "@/components/HM-filterDropdown/HM-filterDropdown.vue";
import menu from '@/common/menu.js'
export default {
  components: {
    MescrollUni,
    PdList,
    HMfilterDropdown: HMfilterDropdown
  },
  data() {
    return {
      province_code: "",
      city_code: '',
      radius: '50000',
      sortby: 'ASC',
      order: 'distance',
      indexArr: "",
      valueArr: "",
      filterDropdownValue: [],
      filterData: [],
      imgData: {
        icon_search2: `${imgIcon}/icon_search2.png`,
        icon_location2: `${imgIcon}/icon_location2.png`,
        icon_zoom2: `${imgIcon}/icon_zoom2.png`
      },
      themeColor: "#000000",
      mescroll: null,
      hasNext: true,
      downOption: {
        auto: true,
        textLoading: "Tips:",
        textInOffset: "下拉刷新"
      },
      upOption: {
        auto: false,
        page: {
          num: 0,
          size: 10
        },
        noMoreSize: 3,
        empty: {
          tip: "~ 空空如也,加紧收录中,请联系我们 ~",
          btnText: ""
        },
        toTop: {
          src: ""
        }
      },
      pdList: [],
      current_area: {}
    };
  },
  filters: {
    outData(value) {
      return JSON.stringify(value);
    }
  },
  computed: {
    ...mapState("app", {
      global_current_area: state => state.current_area,
      type: state => state.type
    }),
    meScrollTop() {
      return this.type === 0 ? "44px" : 0
    }
  },
  async onShow() {
    if (this.mescroll) {
      this.mescroll.triggerDownScroll()
    }
  },
  async onTabItemTap() {
   
  },
  async onLoad() {
    this.current_area = {
      latitude: this.global_current_area.latitude,
      longitude: this.global_current_area.longitude
    };
    this.filterDropdownValue = [
      [0, 4],
      [1]
    ];
    const res = await this.$api.searchPage();
    this.filterData = res.data.data
  },
  onShareAppMessage(res) {
    return {
      title: "查查离我最近-“新型肺炎”病人，曾到过的小区！",
      // path: '',
      // imageUrl: '',
      success: function (res) {
        uni.showShareMenu({
          withShareTicket: true
        });
      },
      fail: function (res) {}
    };
  },
  methods: {
    confirm(e) {
      this.indexArr = e.index
      this.valueArr = e.value
      console.log('地区', this.valueArr[0])
      console.log('index', this.indexArr[0])
      if (this.valueArr[0][0] === 'nearby') {
        console.log('附近')
        this.radius = this.valueArr[0][1]
        this.city_code = ''
        this.province_code = ''
      } else if (this.valueArr[0][0] === 'province') {
        console.log('各省')
        if (this.indexArr[0][1] === 0) {
          console.log('全省')
          this.province_code = this.valueArr[0][1]
          this.city_code = ''
          this.radius = ''
        } else {
          console.log('某个市')
          this.radius = ''
          this.city_code = this.valueArr[0][1]
          this.province_code = ''
        }
      } else if (this.valueArr[0][0] === 'hotArea') {
        console.log('热门地区')
        this.radius = ''
        this.city_code = this.valueArr[0][1]
        this.province_code = ''
      }
      //设置排序
      // console.log('排序', this.valueArr[1])
      // console.log('index', this.indexArr[1])
      this.order = this.valueArr[1][0]
      //刷新
      this.mescroll.triggerDownScroll();
    },
    async aimTap() {
      uni.getLocation({
        type: "gcj02",
        success: async res => {
          this.current_area = {
            latitude: res.latitude,
            longitude: res.longitude
          };
          this.city_code = ''
          this.radius = 50000
          this.province_code = ''
          console.log("this.current_area", this.current_area);
          this.mescroll.triggerDownScroll();
        },
        fail: err => {
          // #ifdef MP-BAIDU
          if (err.errCode === 202 || err.errCode === 10003) {
            // 202模拟器 10003真机 user deny
            this.showConfirm();
          }
          // #endif
          // #ifndef MP-BAIDU
          if (err.errMsg.indexOf("auth deny") >= 0) {
            uni.showToast({
              title: "访问位置被拒绝"
            });
          } else {
            uni.showToast({
              title: err.errMsg
            });
          }
          // #endif
        }
      });
    },
    async searchCheckTap() {
      uni.chooseLocation({
        success: async res => {
          console.log("chooseLocation=>", res);
          this.current_area = {
            latitude: res.latitude,
            longitude: res.longitude
          };
          this.mescroll.triggerDownScroll();
        }
      });
    },
    mescrollInit(mescroll) {
      console.log("mescrollInit");
      this.mescroll = mescroll;
    },
    downCallback(mescroll) {
      mescroll.resetUpScroll();
    },
    async upCallback(mescroll) {
      try {
        let rows = mescroll.size; // 页长, 默认每页10条
        let page = mescroll.num; // 页码, 默认从1开始
        console.log("rows", rows);
        console.log("page", page);
        const res = await this.$api.shops({
          page,
          rows,
          lon: this.current_area.longitude,
          lat: this.current_area.latitude,
          order: this.order,
          sortby: this.order === 'distance' ? 'ASC' : 'DESC',
          radius: this.radius,
          'district.city_code': this.city_code,
          'district.city.province_code': this.province_code
        }, this.type);
        console.log("shpsRes=>", res.data.data);
        this.hasNext = page * rows < res.data.data.totalCount;
        console.log("this.hasNext", this.hasNext);
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
        console.log("this.pdList", this.pdList);
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
.search-btn {
  width: 84rpx;
  height: 84rpx;
  position: fixed;
  bottom: 120rpx;
  right: 32rpx;
  z-index: 4;
  .img-icon {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
}
.aim-btn {
  width: 84rpx;
  height: 84rpx;
  position: fixed;
  bottom: 30rpx;
  right: 32rpx;
  z-index: 4;
  .img-icon {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
}
.search-box {
  width: 95%;
  background-color: rgb(242, 242, 242);
  padding: 15rpx 2.5%;
  display: flex;
  justify-content: space-between;

  .mSearch-input-box {
    width: 100%;
  }

  .input-box > input {
    width: 100%;
    height: 60upx;
    font-size: 32upx;
    border: 0;
    border-radius: 60upx;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 0 3%;
    margin: 0;
    background-color: #ffffff;
  }
}

.addShop {
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  color: #ec633b;
  font-size: 32rpx;
  text-align: center; // background: #EC633B;
  border: 1px solid #ec633b;
  bottom: 60rpx;
  width: 200rpx;
  margin: auto;
  left: 0;
  right: 0;
  bottom: 80rpx;
}

/* 底部分享 */
.uni-share {
  background: #fff;
}

.uni-share-title {
  line-height: 60upx;
  font-size: 24upx;
  padding: 15upx 0;
  text-align: center;
}

.uni-share-content {
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
}

.uni-share-content-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  box-sizing: border-box;

  .member {
    position: absolute;
    width: 30rpx;
    height: 30rpx;
    background: #ec633b;
    border-radius: 15rpx;
    font-size: 20rpx;
    color: white;
    margin-left: 25rpx;
    margin-top: -10rpx;
    text-align: center;
    vertical-align: middle;
  }
}

.uni-share-content-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60upx;
  height: 60upx;
  overflow: hidden;
  border-radius: 10upx;
}

.uni-share-content-image .image {
  width: 100%;
  height: 100%;
}

.uni-share-content-text {
  font-size: 26upx;
  color: #333;
  padding-top: 5px;
  padding-bottom: 10px;
}

.uni-share-btn {
  height: 90upx;
  line-height: 90upx;
  border-top: 1px #f5f5f5 solid;
  text-align: center;
  color: #666;
}
</style>

