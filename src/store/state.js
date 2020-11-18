import {playMode} from 'base/song-list/config'

const state={
  singer:{},
  playing:false,
  playList:[],
  favoriteList:[],
  currentIndex: -1,
  fullScreen:false,
  mode:playMode.loop,
  love:false,
  sequenceList:[],
  historyList:[],
  searchHistory:[],

}

export default state