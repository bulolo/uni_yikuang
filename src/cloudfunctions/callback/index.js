const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  var params = {}
  if (event.MsgType === 'text') {
    switch (event.Content) {
      case "1":
        let res = await cloud.downloadFile({
          fileID: 'cloud://yikuang-g6lyc.7969-yikuang-g6lyc-1301476030/qrcode.jpg',
        })
        const media = await cloud.openapi.customerServiceMessage.uploadTempMedia({
          type: 'image',
          media: {
            contentType: 'image/jpeg',
            value: res.fileContent,
          },
        })
        params = {
          touser: OPENID,
          msgtype: 'image',
          image: {
            media_id: media.mediaId
          }
        }
        break;
      default:
        param = {
          touser: OPENID,
          msgtype: 'text',
          text: {
            content: event.Content
          }
        }
        break;
    }
  }
  const result = await cloud.openapi.customerServiceMessage.send(params)
  return result
}