import state from "./state"
import storage from 'good-storage'

export const singer=state=>state.singer
export const playing=state=>state.playing
export const playList=state=>state.playList
export const favoriteList=state=>state.favoriteList
export const currentIndex=state=>state.currentIndex
export const currentSong=state=>{
    return state.playList[state.currentIndex]}
   
export const fullScreen=state=>state.fullScreen
export const mode=state=>state.mode
export const love=state=>state.love
export const sequenceList=state=>state.sequenceList
export const historyList=state=>state.historyList
export const searchHistory=state=>{
    return storage.get('__search__')||state.searchHistory
}