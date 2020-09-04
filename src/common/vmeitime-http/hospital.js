import http from './interface'


exports.hospitals = (data) => {
    return http.request({
        url: 'api/v1/hospitals',
        method: 'GET',
        data,
        // handle:true
    })
}
