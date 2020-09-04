import http from './interface'

// 反馈
exports.feedback = (data) => {
    return http.request({
        url: 'api/v1/feedbacks',
        method: 'POST',
        data,
        // handle:true
    })
}

//赞助支持 
exports.supports = (data) => {
    return http.request({
        url: 'api/v1/supports',
        method: 'GET',
        data,
        // handle:true
    })
}

//赞助支持 
exports.subscribe = (data) => {
    return http.request({
        url: 'api/v1/subscribes',
        method: 'POST',
        data,
        // handle:true
    })
}

