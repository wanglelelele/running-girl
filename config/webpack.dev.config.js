const util = require("./util")
const pulblicPath =  '/';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config")
module.exports = webpackMerge(baseWebpackConfig,{
    mode: 'development',
    devServer: {
        historyApiFallback: true, // 当找不到路径的时候，默认加载index.html文件
        hot: true,
        contentBase: false, // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
        compress: true, // 一切服务都启用gzip 压缩：
        port: "8081", // 指定段靠谱
        publicPath: pulblicPath, // 访问资源加前缀
        proxy: {
            // 接口请求代理
        },
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename: util.resolve('../dist/index.html'), // html模板的生成路径
            template: 'index.html',//html模板
            inject: true, // true：默认值，script标签位于html文件的 body 底部
        })
    ]
})
