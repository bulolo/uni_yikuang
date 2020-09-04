<template>
	<view>
		<jyf-parser @parse="parse" @ready="ready" @imgtap="imgtap" @linkpress="linkpress" @error="error" gesture-zoom
		 show-with-animation lazy-load use-anchor ref="article" domain="https://6874-html-foe72-1259071903.tcb.qcloud.la">加载中...</jyf-parser>
	</view>
</template>
<script>
	import parser from "@/components/jyf-parser/jyf-parser"; 
	export default {
		components: {
			"jyf-parser": parser
    },
    data() {
      return {
        id: null
      }
    },
    onLoad(op){
      console.log('op',op)
      this.id = op.id
    },
		async onReady() {
		  uni.showLoading({
		    title: '加载中',
		    mask: true
		  });
		  let res = await this.$api.articlesDetail(this.id, {})
		  this.$refs.article.setContent(res.data.data.context);
		  uni.hideLoading();
		},
		methods: {
			parse(res) {
				console.log("parse finish", res);
			},
			ready(res) {
				console.log("ready", res);
				//console.log("api: getText\n" + this.$refs.article.getText());
				console.log("imgList", this.$refs.article.imgList);
			},
			imgtap(res) {
				console.log("imgtap", res);
			},
			linkpress(res) {
				console.log("linkpress", res);

			},
			error(res) {
				console.error(res);
			}
		}
	}
</script>

<style>
</style>
