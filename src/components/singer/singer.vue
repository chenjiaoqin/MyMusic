<template>
<div>
  <list-view :data="singerList" @select="singerClick" ></list-view>
  <router-view></router-view>
</div>
</template>

<script>
import {getSingers} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
import ListView from 'base/listView/listView.vue'
import Singer from 'common/js/singer.js'
import {mapMutations} from 'vuex'


export default {
  components: {
    ListView,
  },
  props: {},
  data() {
    return {
      singerList:[],
    }
  },
  created(){
    this._getSingers()
  },

  methods:{
    ...mapMutations(['SET_SINGER']),
    _getSingers(){
      getSingers().then(res=>{
        if(res.code===ERR_OK){
          this.singerList=this._normalizeSinger(res.data.list)
          console.log(this.singerList)
        }
      })
    },
    _normalizeSinger(list){
      let map={
        hot:{
          title:'热门',
          items:[]
        }
      }

      if(list&&list.length){
        list.forEach((item,index) => {
        if(index<10){
          map.hot.items.push(new Singer({
            id:item.Fsinger_mid,
            name:item.Fsinger_name
          }))
        }
        const key=item.Findex
        if(!map[key]){
          map[key]={
            title:key,
            items:[]
          }
        }
        map[key].items.push(new Singer({
          id:item.Fsinger_mid,
          name:item.Fsinger_name
        }))              
        });

        let hot=[]
        let ret=[]
        for (let key in map){
          let value=map[key]
          if(value.title.match(/[a-zA-z]/)){
            ret.push(value)
          }else if (value.title==='热门'){
            hot.push(value)
          }
        }
        ret.sort((a,b)=>{
          return a.title.charCodeAt(0)-b.title.charCodeAt(0)
        })

        return hot.concat(ret)

      }
    },
    singerClick(singer){
        this.$router.push({
        path:`/singer/${singer.id}`
      })
      this.SET_SINGER(singer)
    }
    
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus" type="text/stylus">

</style>