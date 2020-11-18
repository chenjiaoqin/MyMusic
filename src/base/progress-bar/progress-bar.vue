<template>
  <div class="progress-bar" ref="progressBar" @click="barClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" 
           @touchstart.prevent="processTouchStart"
           @touchmove.prevent="processTouchMove"
           @touchend="processTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
 import {prefixStyle} from 'common/js/dom'

 const progressBtnWidth = 16
 const transform = prefixStyle('transform')

export default {
  components: {},
  props: {
    percent:Number,
  },
  data() {
    return {
    };
  },
  watch: {
    percent(newVal){
      if(newVal>=0&& !this.touch.initiated){
        const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
        const offsetWidth=newVal*barWidth
        this.offset(offsetWidth)

      }
    
    }
  },
  computed: {},
  methods: {
    processTouchStart(e){
      this.touch.initiated=true
      this.touch.startX=e.touches[0].pageX
      this.touch.left=this.$refs.progress.clientWidth

    },
    processTouchMove(e){
      if(!this.touch.initiated){
        return        
      }
      this.touch.deltaX=e.touches[0].pageX-this.touch.startX
      const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
      const offsetWidth=Math.min(barWidth,Math.max(0,this.touch.deltaX+this.touch.left))
      this.offset(offsetWidth)

    },
    offset(offsetWidth){
      this.$refs.progress.style.width=`${offsetWidth}px`
      this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`

    },
    processTouchEnd(){
      this.touch.initiated=false
      const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
      const newPercent=this.$refs.progress.clientWidth/barWidth
      this.$emit('barClick',newPercent)
    },
    barClick(e){
      const x= e.pageX-this.$refs.progressBar.offsetLeft
      this.offset(x)
      const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
      const newPercent=x/barWidth
      this.$emit('barClick',newPercent)
    }
  },
  created() {
    this.touch={}
  },
  mounted() {}
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~@/common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
