import http from './interface'


exports.articles = (data) => {
    return http.request({
        url: 'api/v1/articles',
        method: 'GET',
        data
    })
}

exports.articlesDetail = (id,data) => {
    return http.request({
        url: `api/v1/articles/${id}`,
        method: 'GET',
        data
    })
}