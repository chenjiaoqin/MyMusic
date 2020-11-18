<template>
<div v-show="showFlag" class="addtolist" @click.stop>
    <div class="header">
        <div>添加歌曲到列表</div>
        <div @click="close"><svg-icon  icon-class="close" class-name="close" ></svg-icon></div>
    </div>
    <div class="history">
        <svg-icon icon-class="search" class-name="search"></svg-icon>
        <suggest v-show="query.length>0" :showSinger='false' :perpage="25" :query="query" @select="selectSuggest" ></suggest>        
        <input ref="input" v-model="query" :placeholder="placeholder" type="text">
        <div @click="clear"><svg-icon  v-show="query" icon-class="close" class-name="dismiss"></svg-icon></div>
    </div>
    <div v-show="query.length===0">
        <switches @switched="switched" :switches="switches" :currentIndex="currentIndex"></switches>
        <div class="list-wrapper">
           <scroll v-if="currentIndex===0" ref="songlist" :data="historyList" class="historylist"  >
              <song-list :songs="historyList"  @select="selectSong" ></song-list>
          </scroll>
          <scroll v-if="currentIndex===1" ref="search" class="historylist" :data="searchHistory" >
            <search-list @delete="deleteSearch" @select="addQuery"  :searchHistory="searchHistory"></search-list>
          </scroll>
        </div>
    </div>
    <top-tip ref="toptip">
        <div class="tip-title">
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
    </top-tip>
</div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import {mapGetters,mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import Song from 'common/js/song'
import Switches from 'base/switches/switches'
import Suggest from 'base/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import TopTip from 'base/top-tip/top-tip'



export default {
  components: {
      SongList,
      Scroll,
      Switches,
      Suggest,
      SearchList,
      TopTip
  },
  props: {
      placeholder:{
          type:String,
          default:'搜索歌曲',

      }
  },
  data() {
    return {
        showFlag:false,
        query:'',
        currentIndex:0,
        switches: [{name:'最近播放'},{name:'搜索历史'} ],
    };
  },

  computed: {
      ...mapGetters(['historyList','searchHistory'])
  },
  methods: {
      ...mapActions(['insertSong','deleteSearchHistory','savesearchHistory']),
      addQuery(query){
          this.query=query
      },
      deleteSearch(query){
          this.deleteSearchHistory(query)
      },
      selectSong(song){       
          this.insertSong(song)
          this.$refs.toptip.show()
      },
      switched(index){
          this.currentIndex=index
      },
      close(){
          this.showFlag=false
      },
      clear(){
          this.query=''
      },
      show(){
          this.showFlag=true        
      },
      selectSuggest(item){
          this.$refs.toptip.show()
          this.insertSong(item)
      },
      refreshList() { // 重新计算，列表的滚动
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songlist.refresh()
          } else {
            this.$refs.search.refresh()
          }
        }, 30)
      },
  },
  updated(){
      this.refreshList()
  },
  created() {

  },
  mounted() {
      
  }
};
</script>
<style scoped>
.addtolist{
    position: absolute;
    z-index: 400;
    height: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: #191818;
    padding: 10px 20px 0 20px;

}
.header{
    display: flex;
    font-size: 20px;
    justify-content: center;
    margin-bottom: 15px;
}
.close{
    position: absolute;
    right: 15px;
} 
.history{
    display: flex;
    align-items: center;
    height: 40px;
    width: 100%;   
    border-radius: 6px;
    box-sizing: border-box;
    background-color: #333;
    margin:30px 0 20px 0;
}

.search{
    font-size: 24px;
    color: #222;
}
input{
    flex: 1;
    margin: 0 5px;
    background-color: #333;
    color:#fff ;
    font-size:14px ;
    outline: 0;
}
.dismiss{
    font-size: 16px;
    color: #222;
}
.playhistory{
    width: 100%;
    margin-left:67px;
}
.playhistory span{
    display: inline-block;
    width: 100px ;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 5px;
    border:1px solid #373a3a ; 
}
.list-wrapper{
    position: relative;
    height: calc( 100vh - 80px) ;
}
.historylist{
    top: 20px;
}
.tip-title{
    text-align:center;
    line-height: 30px;   
}
.tip-title .text{
    font-size:16px;
    color:#222;
}
</style>
