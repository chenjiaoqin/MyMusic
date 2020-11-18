<template>
<ul class="playhistory" >
    <li class="switch-item" :key="index" v-for="(item,index) in switches" :class="{'active':currentIndex === index}"
        @click="switchItem(index)">
      <span>{{item.name}} </span>
    </li>
</ul>
</template>

<script>
export default {
  components: {},
  props: {
      switches:{
        type:Array,
        default:[]
      },
      currentIndex:0
  },
  data() {
    return {
    };
  },
  watch: {},
  computed: {},
  methods: {
    switchItem(index){
      this.$emit('switched',index)

    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped>
.playhistory{
    width: 100%;
    margin-left:67px;
}
.switch-item{
    display: inline-block;
    width: 100px ;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 5px;
    border:1px solid #373a3a ; 
}
.active{
    background-color: #333;
    color:#fff

}
</style>