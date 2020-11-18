import * as types from 'store/mutation-type'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {savePlay,searchHistoryList,saveDeleteSearch,deleteAllSearch} from 'common/js/storage'
import { currentSong } from './getters'


function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const deleteAllQuery=function({commit}){
  commit(types.SET_SEARCH_HISTORY,deleteAllSearch())

}


export const deleteSearchHistory=function({commit},query){
  commit(types.SET_SEARCH_HISTORY,saveDeleteSearch(query))

}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  // 考虑随机播放
  if (state.mode === 2) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    // 找到这首歌在随机列表中的位置
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)

}
export const insertSong=function({commit,state},song){
  let playlist = state.playList.slice() // 修改副本
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_PLAYLIST,playlist)
  commit(types.SET_CURRENT_INDEX,currentIndex)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)

}

export const saveHistorylist=function({commit},song){
  commit(types.SET_HISTORY_LIST,savePlay(song))

}
export const savesearchHistory=function({commit},query){
  commit(types.SET_SEARCH_HISTORY,searchHistoryList(query))

}

export const deleteSongList = function ({commit}) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
}

export const deleteOne=function({commit,state},song){
  let sequenceList=state.sequenceList.slice()
  let playList=state.playList.slice()
  let currentIndex=state.currentIndex

  let pindex=findIndex(playList,song)
  playList.splice(pindex,1)

  let sindex=findIndex(sequenceList,song)
  sequenceList.splice(sindex,1)

  commit(types.SET_PLAYLIST,playList)
  commit(types.SET_PLAYING_STATE,true)
  commit(types.SET_CURRENT_INDEX,currentIndex)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  
}

// 点击随机播放按钮
export const randomPlay=function({commit},{list}){
  commit(types.SET_PLAYLIST,shuffle(list))
  commit(types.SET_SEQUENCE_LIST,list)
  commit(types.SET_PLAYING_STATE,true)
  commit(types.SET_MODE,2)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_CURRENT_INDEX,0)

}



