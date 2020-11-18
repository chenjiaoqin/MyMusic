<template>
<scroll :data="data" 
        class="listview" 
        :probe-type="probeType"
        @scroll="scroll" 
        ref="listview">
<ul>
  <li v-for="(group,index) in data" :key="index" 
      class="list-group"
      ref="listGroup"
      >
    <h2 class="list-group-title">{{group.title}}</h2>
    <ul>
      <li class="list-group-item" 
          v-for="(item,indey) in group.items" 
          :key="indey"
          @click="singerClick(item)">
        <img :src="item.avatar" class="avatar" alt="">
        <span class="name">{{item.name}}</span>
      </li>
    </ul>
  </li>
</ul>
<div class="list-shortcut">
  <ul>
    <li v-for="(item,indez) in shortcutList" 
       :key="indez" 
       @click="shortClick(indez)"
       class="item"
       :class="{'active':currentIndex===indez}">
      {{item}}
    </li>
  </ul>
</div>
<div class="list-fixed" ref="fixed" v-show="fixedTitle">
  <div class="fixed-title">{{fixedTitle}}</div>
</div>
</scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'

export default {
  created(){
    this.probeType=3,
    this.ListHeight=[],
    this.currentIndex=0
  },
  data(){
    return {
      currentIndex:{
        type:Number,
        default:0
      }
 
    }
  },
  components: {
    Scroll,
  },
  props: {
    data:{
      type:Array,
      default:function(){
        return []
      }
    }
  },
  computed:{
    shortcutList(){
      let cut=[]
      this.data.forEach((item) => { 
        cut.push(item.title.substr(0,1))        
      });
      return cut
    },
    groupHeight(){
      this.ListHeight=[]
      let height=0
      this.ListHeight.push(height)
      const doms=this.$refs.listGroup
      doms.forEach((item)=>{
        height+=item.clientHeight
        this.ListHeight.push(height)
      })
      console.log(this.ListHeight)

    },
    fixedTitle(){
      return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
    }
  },
  methods:{
    shortClick(indez){
      this.$refs.listview.scrollToElement(this.$refs.listGroup[indez],0)
      this.currentIndex=indez
      console.log(this.currentIndex)
      this.groupHeight
    },
    scroll(position){
      this.groupHeight
     for(let i=0;i<this.ListHeight.length-1;i++){
       if(this.ListHeight[i]<(-position.y) && this.ListHeight[i+1]>(-position.y)){
         this.currentIndex=i   
         this.diff=this.ListHeight[i+1]+position.y
         return  
       }      
     }
    },
    singerClick(item){ 
     this.$emit('select',item)
    }           
  },
  watch:{
    diff(newY){
      let fixedTop =newY>0&&newY<44?-44+newy:0     
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~@/common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.active
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>