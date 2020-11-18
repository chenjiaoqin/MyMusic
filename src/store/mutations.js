import * as types from 'store/mutation-type.js'

const mutations={
  [types.SET_SINGER](state,singer){
    state.singer=singer
  },
  [types.SET_PLAYING_STATE](state,flag){
    state.playing=flag
  },
  [types.SET_PLAYLIST](state,list){
    state.playList=list
  },
  [types.SET_CURRENT_INDEX](state,index){
    state.currentIndex=index
  },
  [types.SET_FAVORITE_LIST](state,list){
    state.favoriteList=list
  },
  [types.SET_FULL_SCREEN](state,flag){
    state.fullScreen=flag
  },
  [types.SET_MODE](state,mode){
    state.mode=mode
  },
  [types.SET_LOVE](state,flag){
    state.love=flag
  },
  [types.SET_SEQUENCE_LIST](state,list){
    state.sequenceList=list
  },
  [types.SET_HISTORY_LIST](state,list){
    state.historyList=list
  },
  [types.SET_SEARCH_HISTORY](state,list){
    state.searchHistory=list
  }
}
export default mutations