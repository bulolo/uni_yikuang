import http from './interface'


exports.guides = (data) => {
    return http.request({
        url: 'api/v1/pages/news',
        method: 'GET',
        data,
        // handle:true
    })
}