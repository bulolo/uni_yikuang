import http from './interface'


exports.shops = (data,type=0) => {
    return http.request({
        url: type === 0 ? 'api/v2/shops' : 'api/v1/hospitals',
        method: 'GET',
        data,
        // handle:true
    })
}

exports.getShopDetail = (id, data = {},type=0) => {
    return http.request({
        url: type === 0 ? ('api/v1/shops/' + id) : ('api/v1/hospitals/' + id),
        method: 'GET',
        data
    })
}