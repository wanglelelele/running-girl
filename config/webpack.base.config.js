const util = require("./util")
const pulblicPath = '/';
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index'
    },
    output: {
        path: util.resolve("../dist"),
        filename: "js/[name].[hash].js",
        publicPath: pulblicPath// 打包后的资源的访问路径前缀
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_moduls/,
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader', // 创建 <style></style>
                    },
                    {
                        loader: 'css-loader',  // 转换css
                    }
                ]
            }, {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'less-loader', // 编译 Less -> CSS
                    },
                ],
            }, 
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                exclude: util.resolve('../src/assets/babylon'),
                options: {
                    limit: 10000, // url-loader 包含file-loader，这里不用file-loader, 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
                    name: 'static/img/[name].[ext]'
                }
            }, 
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000, // 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
                    name: 'static/fonts/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(babylon|fbx|png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                exclude: util.resolve('../src/assets/img'),
                options: {
                    // publicPath: 'assets/',
                    limit: 10000, // 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
                    name: 'static/babylon/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        new CopyPlugin([
          {
            from: "../src/assets/babylon/*",
            to: "../dist/static/babylon/",
          },
        ])
      ],
}