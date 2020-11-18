// vue.config.js
const path =  require('path');
const express=require('express')
const axios=require('axios')
const app=express();
const bodyParser = require('body-parser')

var apiRoutes=express.Router()

app.use('/api',apiRoutes)


const CompressionWebpackPlugin = require("compression-webpack-plugin"); // 开启gzip压缩， 按需引用
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; // 打包分析

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/site/vue-demo/' : '/',  // 公共路径
    indexPath: 'index.html' , // 相对于打包路径index.html的路径
    outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
    assetsDir: 'static', // 相对于outputDir的静态资源(js、css、img、fonts)目录
    lintOnSave: false, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
    runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: !IS_PROD, // 生产环境的 source map
    parallel: require("os").cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
    pwa: {}, // 向 PWA 插件传递选项。

    chainWebpack: config => {
      const svgRule = config.module.rule('svg');
         // 清除已有的所有 loader。
        // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
        svgRule.uses.clear();
        svgRule
          .test(/\.svg$/)
          .include.add(path.resolve(__dirname, 'src/icons/svg'))
          .end()
          .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
          .options({
            symbolId: 'icon-[name]'
          });
        const fileRule = config.module.rule('file');
        fileRule.uses.clear();
        fileRule
          .test(/\.svg$/)
          .exclude.add(path.resolve(__dirname, 'src/icons/svg'))
          .end()
          .use('file-loader')
          .loader('file-loader');
        config.resolve.symlinks(true); // 修复热更新失效
        // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
        config.plugin("html").tap(args => {
            // 修复 Lazy loading routes Error
            args[0].chunksSortMode = "none";
            return args;
        });
        config.resolve.alias // 添加别名
            .set('@', resolve('src'))
            .set('api', resolve('src/api'))
            .set('base',resolve('src/base'))
            .set('common', resolve('src/common'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('views', resolve('src/views'))
            .set('store', resolve('src/store'));
        // 压缩图片
        // 需要 npm i -D image-webpack-loader
        // 打包分析
        // 打包之后自动生成一个名叫report.html文件(可忽视)
        if (IS_PROD) {
            config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
                {
                    analyzerMode: "static"
                }
            ]);
        }
    },
    configureWebpack: config => {
        // 开启 gzip 压缩
        // 需要 npm i -D compression-webpack-plugin
        const plugins = [];
        if (IS_PROD) {
            plugins.push(
                new CompressionWebpackPlugin({
                    filename: "[path].gz[query]",
                    algorithm: "gzip",
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8
                })
            );
        }
        config.plugins = [...config.plugins, ...plugins];
    },
    css: {
        extract: IS_PROD,
        requireModuleExtension: false,// 去掉文件名中的 .module
        loaderOptions: {
                // 给 less-loader 传递 Less.js 相关选项
                less: {
                    // `globalVars` 定义全局对象，可加入全局变量
                    globalVars: {
                        primary: '#333'
                    }
                }
        }
    },
    
    devServer: {
        before(app) {
          // 后端代理   
          app.use(bodyParser.urlencoded({extended: true}))

          app.get('/api/getDiscList', function (req, res) {
            const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
            axios.get(url, {
              headers: {
                referer: 'https://c.y.qq.com/', // 源地址
                host: 'c.y.qq.com' // 域名
              },
              params: req.query
            }).then((response) => {
              res.json(response.data)
            }).catch((e) => {
              console.log(e)
            })
          })
        app.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
            const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
            axios.post(url,req.body,{
              headers: {
                referer: 'https://y.qq.com/', // 源地址
                origin: 'https://y.qq.com',// 域名
                'Content-type': 'application/x-www-form-urlencoded'
              },
            }).then((response) => {
              res.json(response.data)
            }).catch((e) => {
              console.log(e)
            })
          })
        app.get('/api/search',function(req,res){
          const url ='https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
          axios.get(url,{
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params:req.query
          }).then((response)=>{
            res.json(response.data)
          }).catch((e)=>{
            console.log(e)
            })
        })
        app.get('/api/lyric', function (req, res) {
          const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  
          axios.get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          }).then((response) => {
            let ret = response.data
            if (typeof ret === 'string') {
              const reg = /^\w+\(({.+})\)$/
              const matches = ret.match(reg)
              if (matches) {
                ret = JSON.parse(matches[1])
              }
            }
            res.json(ret)
          }).catch((e) => {
            console.log(e)
          })
        })

        },     
      
    }
}

