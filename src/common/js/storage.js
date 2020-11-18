import storage from 'good-storage'


const PLAY_KEY='__play__'
const PLAY_MAX_LEN=200
const SEARCH_KEY='__search__'
const SEARCH_MAX_LEN=20

function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare)
    if (index >=0) {
      arr.splice(index, 1)
    }   
    arr.unshift(val)
    if (maxLen && arr.length > maxLen) {
      arr.pop()
    }
  }

  export function saveDeleteSearch(query){
    let searchHistory=storage.get(SEARCH_KEY,[])
    const index=searchHistory.findIndex((item)=>{
      return item===query
    })
    searchHistory.splice(index,1)
    storage.set(SEARCH_KEY,searchHistory)
    return searchHistory
  }

  export function searchHistoryList(query){
    let searchHistory=storage.get(SEARCH_KEY,[])
    insertArray(searchHistory,query,(item)=>{
      return query===item
    },SEARCH_MAX_LEN)
    storage.set(SEARCH_KEY,searchHistory)
    return searchHistory
  }
  
  export function savePlay(song) {
    let songs = storage.get(PLAY_KEY, [])
    insertArray(songs, song, (item) => {
      return song.id === item.id
    }, PLAY_MAX_LEN)
    storage.set(PLAY_KEY, songs)
    return songs
  }

  export function deleteAllSearch(){
    storage.clear(SEARCH_KEY)
    return []
  }


