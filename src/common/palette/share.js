class Share {
    userInfo = {}
    qrcode = ''
    do(userInfo, url, mapUrl) {
        this.userInfo = JSON.parse(JSON.stringify(userInfo))
        this.qrcode = url
        this.mapUrl = mapUrl
        return this._template()
    }
    _template() {
        let userInfo = this.userInfo || {};
        console.log(userInfo, "???userInfo")
        let obj = {
            background: '#ffffff',
            width: '640rpx',
            height: '800rpx',
            borderRadius: '4rpx',
            views: []
        }
        let textGenerator = ({ top, left, fontSize, color, text, ...data }) => {
            return {
                type: 'text',
                text,
                css: {
                    top,
                    left,
                    fontSize,
                    color,
                    ...data
                }
            }
        }

        let rectGenerator = ({
            top,
            left,
            width,
            height,
            color,
            borderRadius = 0
        }) => {
            return {
                type: 'rect',
                css: {
                    top,
                    left,
                    width,
                    height,
                    color,
                    borderRadius
                }
            }
        }

        let imgGenerator = ({ top, left, url, width, height, ...data }) => {
            return {
                type: 'image',
                url,
                css: {
                    top,
                    left,
                    width,
                    height,
                    ...data
                }
            }
        }

        let textList = [
            {
                top: '52rpx',
                left: '160rpx',
                fontSize: '32rpx',
                fontWeight: 'bold',
                lineHeight: '48rpx',
                width: '380rpx',
                maxLines: 1,
                color: '#2A2A2A',
                text: userInfo.nickName
            },
            {
                top: '100rpx',
                left: '160rpx',
                fontSize: '32rpx',
                maxLines: 2,
                lineHeight: '48rpx',
                width: '380rpx',
                color: '#2A2A2A',
                text: `附近的确诊病例逗留情况`
            },
            {
                top: '624rpx',
                left: '220rpx',
                fontSize: '32rpx',
                maxLines: 2,
                lineHeight: '48rpx',
                width: '380rpx',
                color: '#2A2A2A',
                text: `长按前往「疫况」小程序 查看你身边的实时疫情`
            },

        ]

        let rectList = [
           
        ]
        let imgList = [
            {
                top: '50rpx',
                left: '40rpx',
                width: '100rpx',
                height: '100rpx',
                url: userInfo.avatar
            },
            {
                top: '202rpx',
                left: '0rpx',
                width: '640rpx',
                height: '332rpx',
                url: this.mapUrl
            },
            {
                top: '586rpx',
                left: '32rpx',
                width: 'auto',
                height: '170rpx',
                url: this.qrcode,
            }
        ]
        textList.forEach(i => {
            obj.views.push(textGenerator(i))
        })
        rectList.forEach(i => {
            obj.views.push(rectGenerator(i))
        })
        imgList.forEach(i => {
            obj.views.push(imgGenerator(i))
        })
        return obj
    }
}
export default Share;
