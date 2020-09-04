import http from './interface'
import store from '@/store'
// const type = store.state.app.type

//search页面菜单
exports.searchPage = (data) => {
    return http.request({
        url: 'api/v1/pages/search',
        method: 'GET',
        data
    })
}
//首页数据
exports.homePage = (data,type=0) => {
    return http.request({
        url: type === 0 ? 'api/v1/pages/home' : 'api/v1/pages/homeHospital',
        method: 'GET',
        data,

    })
}
//　banner
exports.banners = (data) => {
    return http.request({
        url: 'api/v1/banners',
        method: 'GET',
        data
    })
}

/*  #ifdef  MP-QQ  */
exports.markers = (data, type = 0) => {
    data.type = 'qq'
    return http.request({
        url: type === 0 ? 'api/v2/pages/home/mapData' : 'api/v2/pages/home/mapDataHospital',
        method: 'POST',
        data
    })
}
/*  #endif  */

/*  #ifndef  MP-QQ  */
exports.markers = (data, type = 0) => {
    return http.request({
        url: type === 0 ? 'api/v2/pages/home/mapData' : 'api/v2/pages/home/mapDataHospital',
        method: 'POST',
        data
    })
}
/*  #endif  */