<template>
<transition name="slide">
   <music-list
               :songs="songs"
               :title="title"
               :bg-image="bgImage"></music-list>
</transition>
</template>

<script>
import {getSingerDetail} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
import MusicList from 'components/music-list/music-list'
import Song from 'common/js/song.js'
import {mapGetters} from 'vuex'
import {createSong,processSongsUrl} from 'common/js/song'

export default {
  components: {
    MusicList,
  },
  props: {
  },
  computed:{
    ...mapGetters(['singer']),
    title(){
      return this.singer.name
    },
    bgImage(){
      return this.singer.avatar
    }
  },
  data(){
    return {
      songs:[],
    }
  },
  created(){
    this._getSingerDetail()
  
    
  },
  methods:{
    _getSingerDetail(){
      getSingerDetail(this.singer.id).then((res)=>{
        if(res.code===ERR_OK){ 
         processSongsUrl(this._normalizeSongs(res.data.list)).then((songs)=>{
            this.songs = songs
              console.log(this.songs)
          })
        }
      })
    },
   _normalizeSongs(list){
     let ret=[]     
     list.forEach((item)=> {
       let {musicData}=item
       ret.push(createSong(musicData))           
       
     });
    return ret

   }
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~@/common/stylus/variable"


.slide-enter-active, .slide-leave-active
 transition:all 0.3s

 .slide-enter, .slide-leave-to
  transform : translate3d(100%,0,0)
</style>  
