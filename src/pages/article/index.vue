<template>
  <div>
    <div class="radius block">
      <div class="tips-list">
        <div class="item" @tap="detailTap(item.id)" v-for="(item, index) in articles" :key="index">
          <div class="body">
            <div class="content">
              <div class="title">{{item.title}}</div>
              <div class="text">
                <ul class="ul">
                  <li class="li">
                    {{item.author}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const imgIcon = `../../static/`;
  export default {
    name: "",

    data() {
      return {
        articles: [{
          question: 'A2N新闻',
          answer: 'A2N新闻'
        }]
      }
    },
    async onLoad() {
        uni.showLoading({
          title: '加载中',
          mask: true
        });
        let res = await this.$api.articles({})
        console.log(res.data)
        this.articles = res.data.data.list
        uni.hideLoading();
    },
    onShareAppMessage(res) {
      return {
        title: '新闻',
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
      detailTap(id) {
        uni.navigateTo({
          url: `/pages/article/detail?id=${id}`
        });
      }
    }
  }
</script>

<style lang="less">
  page {
    background: #FFFFFF;
  }
  .radius {
    border-radius: 8px;
    background: #fff;
  }
  .block>.head {
    text-indent: 10px;
    font-size: 14px;
    line-height: 32px;
    color: #000;
    border-bottom: 1px solid #f5f5f5;
  }
  .tips-list {
    box-sizing: border-box;
    padding: 0 10px;
    .ul>.li {
      position: relative;
      box-sizing: border-box;
      padding-left: 1em;
      &:after {
        position: absolute;
        content: "●";
        top: 0;
        bottom: 0;
        left: 0;
        margin: auto;
      }
    }
    >.item {
      display: flex;
      padding: 15px 0;
      margin-left: 10px;
      border-bottom: 1px solid #f5f5f5;
      .thumb {
        flex: 0 0 40px;
        img,
        image {
          width: 40px;
        }
      }
      .title {
        color: #333;
        font-size: 16px;
        margin-bottom: 10px;
      }
      .text {
        color: #e1914c;
        font-size: 13px;
      }
      .body {
        display: flex;
        height: auto;
        flex: 1;
        .content {
          flex: 1;
        }
      }
    }
    >.item.use {
      opacity: 0.9;
      .title {
        color: #666;
      }
      .text {
        color: #666;
      }
    }
  }
</style>

