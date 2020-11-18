<template>
<div>
  <scroll  :data="discList">
    <ul class="recommend-content">
    <li v-for="(item,index) in discList" :key="index" class="item" 
        @click="itemClick(item)">
      <div class="icon">
        <img  width="60" height="60" :src='item.imgurl' alt="">
      </div>
      <div class="text">
        <h2 class="name">{{item.creator.name}}</h2>
        <p class="desc">{{item.dissname}}</p>
      </div>
    </li>
    </ul>
    <div class="loading-container" v-if="!discList.length">
      <loading></loading>
    </div>
  </scroll>
</div>
</template>

<script>
import {getDiscList} from 'api/recommend.js'
import {ERR_OK} from 'api/config.js'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

export default {
  components: {
    Scroll,
    Loading
  },
  props: {},
  data() {
    return {
      discList:[]
    };
  },
  created(){
    this._getDiscList()
  },
  methods:{
    _getDiscList(){
        getDiscList().then((res)=>{
          if(res.code===ERR_OK){
            console.log(res.data.list)
            this.discList=res.data.list
          }
        })
      }
    },
    itemClick(item){
     this.$router.push({
       path:`/recommend/${item.dissid}`
     })
    }
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus" type="text/stylus">
  @import "~@/common/stylus/variable"
     
      .recommend-content
        overflow: hidden
        .item
          display: flex
          box-sizing: border-box
          align-items: center /*垂直居中*/
          padding: 0 20px 20px 20px
          .icon
            /*flex-grow 一个数字，规定项目将相对于其他灵活的项目进行扩展的量。*/
            /*flex-shrink 一个数字，规定项目将相对于其他灵活的项目进行收缩的量。*/
            /*flex-basis 项目的长度。合法值："auto"、"inherit" 或一个后跟 "%"、"px"、"em" 或任何其他长度单位的数字。*/
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center /*水平方向的对齐方式*/
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
