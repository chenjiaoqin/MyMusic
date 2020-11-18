<template>
  <scroll class="suggest-list" 
        :pullup="pullup"
        ref="scroll"
        @scrollToEnd="searchMore">
   <ul >
      <li class="suggest-item" 
          :key="index" v-for="(item,index) in searchList"
          @click="selectItem(item)">
          <svg-icon v-show="showIcon(item)"  icon-class="singer" class-name="icon"></svg-icon>  
          <svg-icon v-show="!showIcon(item)" icon-class="music" class-name="icon" ></svg-icon>             
        <div class="name">
          <p class="text" v-html="getName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" > </loading>
    </ul>     
</scroll>
</template>

<script>
import {searchQuery} from 'api/search'
import {createSong,processSongsUrl} from 'common/js/song'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {debounce} from 'common/js/util'
import { mapActions, mapMutations } from 'vuex'
import Singer from 'common/js/singer'


const SINGER='singer'

export default {
  components: {
    Scroll,
    Loading,
  },
  props: {
    perpage:{
        type:Number,
        default:20
    },
    showSinger:{
        type:Boolean,
        default:false
    },
    query:{
        type:String,
        default:''
    },
  },
  data() {
    return {
        page:1,
        searchList:[],
        pullup:true,
        countpage:Number

    };
  },
  watch: {},
  computed: {
    hasMore(){     
      return this.page<=this.countpage?true:false
    }
  },
  updated(){
    this.$refs.scroll.refresh()   
  },
  methods: {
      selectItem(item){    
         if(item.type===SINGER){
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({path:`/singer/${item.singermid}`})          
          this.SET_SINGER(singer)   
         }else{          
          this.$emit('select',item)
         }this.savesearchHistory(this.query)  
      },
      searchMore(){
        this.page++
        if(!this.hasMore){
          return 
        }
         searchQuery(this.query,this.page,this.perpage,this.showSinger).then((res)=>{
           if(res.code===ERR_OK){
             this._genResult(res.data).then((result) => {
              this.searchList.push(...result)   
            })
          }
        })
      },
       showIcon(item){
         if(item.type===SINGER){
           return true
         }else{
           return false
         }
       },
       getName(item){
         if(item.type===SINGER){
           return item.singername
         }else{
         return `${item.name}-${item.singer}`
         }
       },
       _searchQuery(){
        searchQuery(this.query, this.page, this.perpage, this.showSinger).then((res) => {
          if (res.code === ERR_OK) {
            this.countpage=Math.ceil(res.data.song.totalnum/this.perpage)
             this._genResult(res.data).then((result) => {
              this.searchList =result 
              console.log(this.searchList)            
            })            
          }
        })    
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid && this.page === 1) {
          ret.push({...data.zhida, ...{type: SINGER}})
        }
        return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          ret = ret.concat(songs)
          return ret
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
            ret.push(createSong(item))
        })
        return ret
      },
      ...mapActions(['savesearchHistory',' insertSong']),
      ...mapMutations(['SET_SINGER'])
  },
  created() {
       this.$watch('query',debounce((newQuery)=>{
          if(newQuery.trim().length===0){
              return 
          }
          this._searchQuery()
          },200)                       
        )                  
  },
  mounted() {   
  }
};
</script>
<style scoped >
.suggest-list{
  position: fixed;
  top:100px;
  left:20px;
  right: 20px;
  bottom:0;
  z-index: 100;
  width:334px;
  height: calc(100vh - 100px);
  background-color: #222;
  overflow:hidden;
}
.suggest-item{
  display: flex;
  padding-top:20px;
}
.icon{
  font-size:14px;
  color:dimgrey;
  padding-right:10px;
}
.name{  
  color:#8f8f8f;
}

</style>
