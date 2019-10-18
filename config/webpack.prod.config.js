const util = require("./util")
const pulblicPath =  '/';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config")
module.exports = webpackMerge(baseWebpackConfig,{
    mode: 'production',
    plugins:[
        new HtmlWebpackPlugin({
            filename: util.resolve('../dist/index.html'), // html模板的生成路径
            template: 'index.html',//html模板
            inject: true, // true：默认值，script标签位于html文件的 body 底部
            minify: {
                removeComments: true,               //去注释
                collapseWhitespace: true,           //压缩空格
                removeAttributeQuotes: true         //去除属性引用
            }
        })
    ]
})
