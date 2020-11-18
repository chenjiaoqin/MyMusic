<template>
<div>
    <ul class="search-list">
        <li v-for="(item,index) in searchHistory" class="item" :key="index" @click="selectItem(item)">
            <p class="text">{{item}}</p>
            <div @click.stop="deleteOne(item)">
                <svg-icon icon-class="delete"></svg-icon>
            </div>
        </li>
    </ul>
    <div class="show" v-show="searchHistory.length===0">
      <p>暂无搜索历史~</p>
    </div>
</div>
</template>

<script>
export default {
  components: {},
  props: {
      searchHistory:{
          type:Array,
          default:[]
      }
  },
  data() {
    return {
    };
  },
  watch: {},
  computed: {},
  methods: {
      deleteOne(item){
          this.$emit('delete',item)
      },
      selectItem(item){
          this.$emit('select',item)
      },
  },
  created() {},
  mounted() {}
};
</script>
<style scoped>
.item{
    display: flex;
    margin-bottom: 20px;
    color: #8f8f8f;
    font-size: 18px;
    height: 20px;
}

.text{
    flex:1;
    margin-right: 10px;
}

.show p{
    text-align: center;
    color: #8f8f8f;
}

</style>