<template>
<div class="hotkey">
  <div class="item" @click="selectItem(item)" v-for="(item,index) in hotKey" :key="index">
    <span>{{item.k}}</span>
  </div>
</div>
</template>

<script>
export default {
  components: {},
  props: {
    hotKey:{
      type:Array,
      default:[]
    },
  },
  data() {
    return {
      
    };
  },
  watch: {},
  computed: {},
  methods: {
    selectItem(item){
      this.$emit('select',item.k)
    }

  },
  created() {

  },
  mounted() {}
};
</script>
<style scoped>

.item{
  color:#8f8f8f;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 10px;
  height: 20px;
  line-height: 20px;
  padding: 5px;
  background-color: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.06);
}


</style>