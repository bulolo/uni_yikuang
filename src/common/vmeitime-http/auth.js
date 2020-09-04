import http from './interface'


exports.loginByOauth = (data) => {
    return http.request({
        url: 'api/v1/auth/loginByOauth',
        method: 'POST',
        data,
    })
}

