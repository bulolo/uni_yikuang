import api from '@/common/vmeitime-http/'

const state = {
  type: 0, //0 逗留地数据  1 医院数据
  current_area: {
    address: '',
    latitude: 23.21229,
    longitude: 113.324520,
    name: '当前位置',
    notInit: true
  }
  // #ifdef MP-WEIXIN
  ,
  platform: 1
    // #endif
    // #ifdef MP-ALIPAY
    ,
  platform: 2
    // #endif
    // #ifdef MP-QQ
    ,
  platform: 3
  // #endif
}
const getters = {}
const mutations = {
  UPDATE_CURRENT_AREA(state, currentArea) {
    state.current_area = currentArea
  },
  UPDATE_TYPE(state, type) {
    state.type = type
  }
}
const actions = {
  updateCurrentArea({
    commit
  }, currentArea) {
    commit('UPDATE_CURRENT_AREA', currentArea)
  },
  updateType({
    commit
  }, type) {
    commit('UPDATE_TYPE', type)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}