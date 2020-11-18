<template>
<div class="addtolist">
   <div class="history">
        <svg-icon icon-class="search" class-name="search"></svg-icon>
        <suggest class="suggest" v-show="query.length>0" :showSinger='true' :perpage="25" :query="query" @select="selectSuggest" ></suggest>        
        <input ref="input" v-model="query" :placeholder="placeholder" type="text">
        <div @click="clear"><svg-icon  v-show="query" icon-class="close" class-name="dismiss"></svg-icon></div>
    </div>
    <div class="hot">
      <p>热门搜索</p>
      <search-hot :hotKey="hotKey" @select="addQuery"></search-hot>
    </div>

    <div class="head">
      <p>搜索历史</p>
      <div @click="allDelete"><svg-icon icon-class="alldelete" ></svg-icon></div>
    </div>
    <scroll  ref="search" class="historylist" :data= "searchHistory" :refreshDelay="refreshDelay">
        <search-list @delete="deleteSearch" @select="addQuery"  :searchHistory="searchHistory"></search-list>
    </scroll>
    <top-tip ref="toptip">
        <div class="tip-title">
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
    </top-tip> 
    <div>
      <confirm ref="confirm" @confirm='confirm' text="确定是否删除吗"></confirm>  
    </div>
</div>
</template>

<script>
import Suggest from 'base/suggest/suggest'
import SearchHot from 'base/search-hot/search-hot'
import SearchList from 'base/search-list/search-list'
import TopTip from 'base/top-tip/top-tip'
import {mapGetters,mapActions, mapMutations} from 'vuex'
import {searchHot} from 'api/search'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import storage from 'good-storage'



export default {
  components: {
    Suggest,
    SearchHot,
    SearchList,
    TopTip,
    Scroll,
    Confirm
  },
  created(){
    this._searchHot()
  },
  computed:{
    ...mapGetters(['searchHistory'])
  },
  methods:{
     ...mapActions(['insertSong','deleteSearchHistory','deleteAllQuery','insetSong']),  
      confirm(){
        this.deleteAllQuery()
      },
      allDelete(){
        console.log(this.searchHistory)
        this.$refs.confirm.show()
      }, 
      deleteSearch(query){
          this.deleteSearchHistory(query)
      },
      selectSuggest(song){
          this.insertSong(song)
      }, 
      clear(){
          this.query=''
      },  
      deleteSearch(query){
          this.deleteSearchHistory(query)
      },
      addQuery(query){
        console.log(2)
          this.query=query
      },
      _searchHot(){
        searchHot().then((res)=>{
          if(res.code===ERR_OK){
            this.hotKey = res.data.hotkey.slice(0, 10)          }
        })
      }      
  },
  props: {
      placeholder:{
          type:String,
          default:'搜索歌曲、歌手',
      },
  },
  data() {
    return {
      query:'',
      hotKey:[],
      refreshDelay:100,
      //  searchHistory:storage.get('__search__')
    };
  },
  watch:{
    // query(newQuery){
    //   this.searchHistory=storage.get('__search__')
    // }
  }
};
</script>
<style scoped>
.addtolist{
    position: relative;
    left: 0;
    right: 0;
    bottom: 0;
    top:0;
    background-color: #222;
    padding: 10px 20px  0 20px;

}
.history{
    display: flex;
    align-items: center;
    height: 40px;
    width: 100%;   
    border-radius: 6px;
    box-sizing: border-box;
    background-color: #333;
    margin:10px 0 20px 0;
}

.search{
    font-size: 24px;
    color: #222;
}
.suggest{
  top:150px;
  font-size: 16px;
  color:rgba(255,255,255,0.3);
  padding:0 10px;
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
.head{
  display: flex;
  padding: 20px 0;
}
.head p{
  color: #8f8f8f;
  flex: 1;
}
.hot p{
  color: #8f8f8f;
  padding: 20px 0;
}
.historylist{
    position: absolute;
    top: 360px;
    left:20px;
    height: 190px;
    width:334px ;
    margin-right: 20px;
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