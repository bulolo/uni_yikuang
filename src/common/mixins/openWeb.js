export default {
    methods: {
        openWeb(item) {
            console.log("clickBanner=>", item);
            if (item.jump_type == "mini") {
                return uni.navigateToMiniProgram({
                    ...(item.mini_url || {}),
                    fail(err) {
                        console.log(err, "??er");
                    }
                });
            } else if (item.link) {
                if (item.jump_type == "url") {
                    uni.navigateTo({
                        url: `/pages/webview?url=${encodeURIComponent(item.link)}`
                    });
                } else {
                    uni.navigateTo({
                        url: item.link
                    });
                }
            }
        },
    }
}