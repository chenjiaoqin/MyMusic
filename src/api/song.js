import axios from 'axios'
import {getUid} from 'common/js/uid'
import {commonParams,ERR_OK} from './config'

const debug = process.env.NODE_ENV !== 'production'

export function getLyric(mid){
    const url=debug ? '/api/lyric' : 'http://ustbhuangyi.com/music/api/lyric'
    const data=Object.assign({},commonParams,{
        songmid: mid,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date(),
        format: 'json'    
    })

    return axios.get(url, {
        params: data
      }).then((res) => {
        return Promise.resolve(res.data)
      })
}

export function getSongsUrl(songs){
    const url='/api/getPurlUrl'

    let mids=[]
    let types=[]

    songs.forEach((item)=> {
        mids.push(item.mid)
        types.push(0)
    })
    const urlMid = getUrlMid(mids,types)

    const data=Object.assign({},commonParams,{
        g_tk: 5381,
        format: 'json',
        platform: 'h5',
        needNewCode: 1,
        uin: 0,
    })

    return new Promise((resolve,reject)=>{
        let tryTime=3

        function request(){
            return axios.post(url,{
                common:data,
                url_mid:urlMid
            }).then((response)=>{
                const res=response.data
                if(res.code===ERR_OK){
                    let urlMid=res.url_mid
                    if(urlMid.code===ERR_OK){
                        const url=urlMid.data.midurlinfo[0].purl
                        resolve(res)
                    } else {
                        retry()
                    }

                }else{
                    retry()
                }
                
            })
        }
        function retry(){
            if (--tryTime >= 0) {
                request()
              } else {
                reject(new Error('Can not get the songs url'))
              }
        }

        request()
    })
}

function getUrlMid(mids, types) {
    const guid = getUid()
    return {
      module: 'vkey.GetVkeyServer',
      method: "CgiGetVkey",
      param: {
        guid,
        songmid: mids,
        songtype: types,
        uin: '0',
        loginflag: 0,
        platform: '23'
      }
    }
  }