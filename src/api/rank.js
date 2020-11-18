 import {commonParams,options} from 'api/config.js'

import jsonp from 'common/js/jsonp.js'

export function getRank(){
  const url="https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg"
  const data=Object.assign({},commonParams,{
    needNewCode: 1,
    uin: 0,
    platform: 'h5'
  })
  
  return jsonp(url,data,options)
}