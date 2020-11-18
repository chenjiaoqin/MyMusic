<template>
<div class="playlist" v-show="flag" @click="hide">
  <div class="list-wrapper" @click.stop>
        <div  class="list-header"> 
          <div class="left">
            <div @click="modeClick">
              <svg-icon v-show="this.mode===0" icon-class="sequence" class-name="icon"></svg-icon>
              <svg-icon v-show="this.mode===1" icon-class="loop" class-name="icon" ></svg-icon>
              <svg-icon v-show="this.mode===2" icon-class="random"  class-name="icon"></svg-icon>
            </div>            
            <span class="text">{{modeText}}</span>        
            <div  @click="showConfirm">
              <svg-icon icon-class="alldelete" class-name="icon"></svg-icon>
            </div>
          </div> 
      </div>
      <scroll ref="scroll" :data="sequenceList" class="content" :refreshDelay="refreshDelay" >
        <ul>
        <li v-for="(song,index) in sequenceList" :key="index" class="song" @click="songClick(song,index)">
          <div class="current">
            <svg-icon icon-class="play" v-show="currentSong.id===song.id"  ></svg-icon>
          </div>
          <span class="name" >{{song.name}}</span>
          <div class="choose">
            <span>
              <svg-icon icon-class="love" class-name="icon-mini"></svg-icon>
            </span>
            <span @click.stop="deleteOne(song)">
              <svg-icon icon-class="delete" class-name="icon-mini"></svg-icon> 
            </span>         
          </div>
        </li>
      </ul>
      </scroll>
      <div  class="add">
          <div class="addlist" @click="add">
            <span >+添加歌曲到列队</span>
          </div>
          <div class="bottom" @click="hide">关闭</div>
      </div>
  </div>
  <add-song ref="addsong"></add-song>
  <confirm ref="confirm" @confirm="confirmClear" 
           text="是否清空播放列表" confirmBtnText="清空"></confirm>
</div>
</template>

<script>
import {playMode} from 'common/js/config'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import AddSong from 'components/addSong/addSong'

export default {
  components: {
    Confirm,
    Scroll,
    AddSong
  },
  props: {},
  data() {
    return {
      flag:false,  
      refreshDelay:120,    
    };
  },
  watch: {},
  computed: {
    ...mapGetters(['mode','sequenceList','currentSong','playList','currentIndex']),
    modeText(){
      return this.mode===2?'随机播放':this.mode===1?'循环播放':'顺序播放'
    },       
  },
  methods: {
    add(){
      this.$refs.addsong.show()
    },
    deleteOne(song){
      this.deleteOne(song)  

    },
    showConfirm(){
      this.$refs.confirm.show()
    },
    confirmClear(){
      this.deleteSongList()
      this.hide()
          
    },
    hide(){
      this.flag=false
    },
    songClick(song,index){ 
      this.selectPlay({
        list:this.sequenceList,
        index
      })


    },
    show(){
      this.flag=true
      this.refreshList()
    },   
    refreshList(){
      setTimeout(()=>this.$refs.scroll.refresh(),20)
    }, 
    modeClick (){ 
    let mode = this.mode   
      if(mode===2){
        mode=0
      }else{
        mode++ }  
      this.SET_MODE(mode)
    }, 
    ...mapMutations([
      'SET_MODE',
      'SET_CURRENT_INDEX',
      'SET_SEQUENCE_LIST',
       ]),
    ...mapActions([
      'selectPlay',
      'deleteSongList',
      'deleteOne'
    ])

  },
  created() {},
  mounted() {}
};
</script>
<style scoped>
.playlist{
    position: fixed;
    z-index: 200;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);    
}
.list-wrapper{
    position: absolute;
    top:240px;
    bottom: 0;
    width: 100%;
    background-color: #333;
}
.list-header{
  position: relative;
  padding: 15px 30px 10px 20px;
}
.left{
  display: flex;
  align-items: center;
}
.icon{
  margin-right: 10px;
  font-size: 40px;
  color: rgba(255, 205, 49, 0.5);
}
.list-wrapper .content{
  position: absolute;
  top:65px;
  right: 0;
  bottom: 0;
  overflow: hidden;
  height: calc( 100vh - 440px );
}
.text{
  flex:1;
  color:rgba(255, 255, 255, 0.5);
  font-size:14px
}

.song{
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.5);
}
.choose{
  position: absolute;
  display:inline-block;
  right: 30px;
}
.current{
  width: 20px;
  margin-left:15px;
  font-size:15px;
}
.icon-mini{
  font-size: 20px;
  color: #8a8a8a;
  margin-left: 12px;
  
}
.add{
  position: absolute;
  top:317px;
  height: 110px;
  width: 100%;
}
.addlist{
  width: 150px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
  text-align: center;
  border: 1px solid #8a8a8a;
  border-radius: 50px;
  margin-bottom: 20px;
}
.bottom{
  height: 50px;
  color: #8a8a8a;
  font-size: 20px;
  text-align: center;
  line-height:50px;
  background-color:#191818;

}
</style>