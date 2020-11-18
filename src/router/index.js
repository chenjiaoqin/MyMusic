import Vue from 'vue'
import VueRouter from 'vue-router'
import rank from 'components/rank/rank'
import recommend from 'components/recommend/recommend'
import singer from 'components/singer/singer'
import singerDetail from 'components/singer-detail/singer-detail'
import search from 'components/search/search'
import player from 'base/player/player'

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'recommend',
    component: recommend
  },
  {
    path: '/recommend',
    name: 'recommend',
    component:recommend,
    children:[
      {path:':id'}
    ]
  },
  {
    path: '/rank',
    name: 'rank',
    component:rank
  },
  {
    path: '/singer',
    name: 'singer',
    component:singer,
    children:[
      {
        path:':id',
        name:'singerDetail',
        component:singerDetail
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component:search,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
