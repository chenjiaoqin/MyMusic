<template>
<scroll :data="topList" ref="toplist">
<div class="list">
  <ul>
    <li v-for="(group,index) in topList" 
        :key="index"
        class="toplist">
      <div>
        <img v-lazy="group.picUrl" alt="" class="img">
      </div>
      <div class="songlist">
        <ul >
          <li v-for="(item,indey) in group.songList" :key="indey" >
            {{indey+1}} {{item.songname}}-{{item.singername}}
          </li>
        </ul>
      </div>

    </li>
  </ul>
</div>
</scroll>
</template>

<script>
import {getRank} from 'api/rank.js'
import {ERR_OK} from 'api/config.js'
import Scroll from 'base/scroll/scroll'


export default {
  components: {
    Scroll,
  },
  props: {},
  data() {
    return {
      topList:[]
    };
  },
  created(){
    this._getRank()
  },
  methods:{
    _getRank(){
      getRank().then((res)=>{
        if(res.code===ERR_OK){
          console.log(res.data.topList)
          this.topList=res.data.topList
        }

      })
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
 @import "~@/common/stylus/variable"
@import "~@/common/stylus/mixin"
.list{
  padding: 20px 20px
}
.toplist{
  display: flex;
  height: 100px;
  width: 100%;
  margin-bottom: 20px;
}
.img{
  flex:1
  height: 100px;
  width: 100px;
}
.songlist{
  flex:1;
  display :flex;
  padding-left:20px;
  overflow: hidden;
  flex-direction :column;
  justify-content: center;
  height: 100px;
  background: $color-highlight-background
}
.songlist li{
  width :200px
  line-height: 26px;
  color: $color-text-d;
  font-size:$font-size-small;
  no-wrap()

}
</style>