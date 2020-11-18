<template>
    <div class="player" v-if="playList.length>0">
      <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
      <div class="background">
          <img :src="currentSong.image" width="100%" height="100%" alt="">
      </div>
      <div class="top">
          <div class="back" @click="back">
            <svg-icon icon-class="back" class-name="icon-back" ></svg-icon>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
      </div>
      <div class="middle" @touchstart.prevent="touchStart"
                         @touchmove.prevent="touchMove"
                         @touchend.prevent="touchEnd">
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper" ref="cdWrapper">
            <div class="cd">
              <img :class="cdCls"  :src="currentSong.image" alt="" class="image">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric"></div>
          </div>        
        </div>
         <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text"
                   :class="{'current': currentLineNum === index}"
                   v-for="(line, index) in currentLyric.lines"
                   ref="lyricLine"
                   :key="index">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
      </div>
      <div class="bottom">
          <!-- 歌词和唱片图片切换 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}" ></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <!-- 播放时间 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent"
              @barClick="barClick"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="modeClick" >
              <svg-icon v-show="this.mode===0" icon-class="sequence" class-name="i" ></svg-icon>
              <svg-icon v-show="this.mode===1" icon-class="loop" class-name="i" ></svg-icon>
              <svg-icon v-show="this.mode===2" icon-class="random" class-name="i" ></svg-icon>
            </div>
            <div class="icon i-left" @click="preClick">
              <svg-icon icon-class="pre" class-name="i"></svg-icon>
            </div>
            <div class="icon i-center" @click="orClick">
              <svg-icon v-show="playIcon" icon-class="pause" class-name="i"></svg-icon>
              <svg-icon v-show="!playIcon" icon-class="play" class-name="i"></svg-icon>
            </div>
            <div class="icon i-right" @click="nextClick" >
              <svg-icon icon-class="next" class-name="i"></svg-icon>
            </div>
            <div class="icon i-right" @click="loveClick">
              <svg-icon ref="svgicon" icon-class="love" class-name="i" ></svg-icon>
            </div>
          </div>
        </div>
      </div> 
      </transition>

      <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper" ref="miniWrapper">
            <img  ref="miniImage" width="40" height="40" :src="currentSong.image">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop="miniClick">
           <svg-icon v-show="!playIcon" icon-class="play" class-name="icon-play-mini"></svg-icon>
           <svg-icon v-show="playIcon" icon-class="pause" class-name="icon-pause-mini"></svg-icon>
        </div>
        <div class="control" @click="showList">
          <svg-icon icon-class="playlist" class-name="icon-playlist"></svg-icon>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio :src="currentSong.url" 
           ref="audio"
           @timeupdate="updateTime"
           @ended="end"></audio>
</div>
</template>

<script>
import {mapGetters, mapMutations,mapActions} from 'vuex'
import {prefixStyle} from 'common/js/dom'
import animations from 'create-keyframe-animation'
import ProgressBar from 'base/progress-bar/progress-bar'
import Scroll from 'base/scroll/scroll'
import Playlist from 'components/playlist/playlist'
import Song from 'common/js/song'
import Lyric from 'lyric-parser'


const transform=prefixStyle('transform')
 const transitionDuration = prefixStyle('transitionDuration')

export default {
  components: {
    ProgressBar,
    Scroll,
    Playlist
  },
  props: {},
  data() {
    return {
      songReady:false,
      currentTime:0,
      lyric:'',
      currentLyric:null,
      currentLineNum:0,
      currentShow:'cd'
    };
  },
  watch: {
    currentSong(newSong){
      this.$nextTick(()=>{
        this.$refs.audio.play()
        this._getLyric()
      }),
      this.saveHistorylist(newSong)

    },
    playing(newPlaying){  
      const audio=this.$refs.audio
      if(audio){
        this.$nextTick(()=>{
        newPlaying?audio.play():audio.pause()
      })
      }

    }
  },
  computed: {
    percent(){
      return this.currentTime/this.currentSong.duration
    },
    cdCls(){
      return this.playing?'play':'play pause'
    },

      playIcon(){
        return this.playing? true : false
      },
      ...mapGetters([
        'playList',
        'playing',
        'fullScreen',
        'currentIndex',
        'currentSong',
        'mode',
        'love'
        ]),
       
  },
  methods: {
    ...mapActions([
      'saveHistorylist',
    ]),
    _getLyric(){
      this.currentSong.getSongLyric().then((lyric)=>{
        this.currentLyric=new Lyric(lyric,this.handleLyric)
        console.log(this.currentLyric)     
        if(this.playing){
          this.currentLyric.play() 
        }          
      })
    },
    handleLyric(lineNum,txt){
      this.currentLineNum=lineNum
    },
    touchStart(e){
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
    touchMove(e){
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        if (!this.touch.moved) {
          this.touch.moved = true
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
    touchEnd(){
        if (!this.touch.moved) {
          return
        }
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.touch.initiated = false
    },
    end(){
      if(this.mode===1){
        this.$refs.audio.currentTime=0
        this.$refs.audio.play()

      }else{
        this.nextClick()
      }     
    },
    barClick(newPercent){
      const currentTime=newPercent*this.currentSong.duration
      this.$refs.audio.currentTime=currentTime

    },
    format(interval){
        interval=interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`

    },
    _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      updateTime(e){
        this.currentTime=e.target.currentTime
      },
      loveClick(){                  
        this.SET_LOVE(!this.love)
         
      },
      preClick(){
      if(this.playList.length===1){
        if(this.mode===1){
        this.$refs.audio.currentTime=0
        this.$refs.audio.play()          
       }
      }
        let index=this.currentIndex
        if(index===0){
          index=this.playList.length-1          
        }else {
          index--
        } 
        this.SET_CURRENT_INDEX(index)
        this.SET_PLAYING_STATE(true)
       },
       orClick(){
         this.togglePlay()
       },
       miniClick(){
         this.togglePlay()     
       },
       showList(){
         this.$refs.playlist.show()
       },
       togglePlay(){
         this.SET_PLAYING_STATE(!this.playing)
       },
       nextClick(){
         let index=this.currentIndex
         if(index===this.playList.length-1){
           index=0
         }else{
           index++
         }
         this.SET_CURRENT_INDEX(index)
         this.SET_PLAYING_STATE(true)
       },

       modeClick (){ 
        let mode = this.mode   
        if(mode===2){
          mode=0
        }else{
          mode++
        }  
        this.SET_MODE(mode)

       },
       ...mapMutations([
         'SET_MODE',
         'SET_CURRENT_INDEX',
         'SET_PLAYING_STATE',
         'SET_LOVE',
         'SET_FULL_SCREEN',
       ]),
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
        // js 调用的动画库
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
       this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        const timer = setTimeout(done, 400)
        this.$refs.cdWrapper.addEventListener('transitionend', () => {
          clearTimeout(timer)
          done()
        })
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },  
      _getPosAndScale() {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      }, 
    back(){
      this.SET_FULL_SCREEN(false)     
    },
    open(){
      this.SET_FULL_SCREEN(true) 
    },
  

  },
  created() {
    this.touch={}
    
  },
  mounted() {}
    
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
              .play
                animation: rotate 20s linear infinite
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          top:0
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            .i
              font-size: 40px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            .i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme 
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 50%
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
