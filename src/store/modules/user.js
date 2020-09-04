import api from '@/common/vmeitime-http/'

const state = {
  user: null,
}
const mutations = {
  UPDATE_USER(state, user) {
    state.user = user
  }
}
const actions = {
  async updateUser({
    commit,
    dispatch
  }) {
    commit('UPDATE_USER', uni.getStorageSync('user') || null)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}