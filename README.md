## 动态导入 (懒加载)

webpack4默认是允许import语法动态导入的，但是需要babel的插件支持，最新版babel的插件包为：`@babel/plugin-syntax-dynamic-import`，以前老版本不是`@babel`开头，已经无法使用，需要注意

动态导入最大的好处是实现了懒加载，用到哪个模块才会加载哪个模块，可以提高SPA应用程序的首屏加载速度，Vue、React、Angular框架的路由懒加载原理一样

1. 安装babel插件

   `npm install -D @babel/plugin-syntax-dynamic-import`

2. 修改.babelrc配置文件，添加`@babel/plugin-syntax-dynamic-import`插件

   ```json
   {
     "presets": ["@babel/env"],
     "plugins": [
       "@babel/plugin-proposal-class-properties",
       "@babel/plugin-syntax-dynamic-import"
     ]
   }
   ```
3. 将jQuery模块进行动态导入

   ```js
   function getComponent() {
     return import('jquery').then(({ default: $ }) => {
       return $('<div></div>').html('main')
     })
   }
   ```

4. 给某个按钮添加点击事件，点击后调用getComponent函数创建元素并添加到页面

   ```js
   window.onload = function () {
     document.getElementById('btn').onclick = function () {
       getComponent().then(item => {
         item.appendTo('body')
       })
     }
   }
   ```
### Prefetching和Preloading

在优化访问性能时，除了充分利用浏览器缓存之外，还需要涉及一个性能指标：coverage rate（覆盖率）

可以在Chrome浏览器的控制台中按：ctrl  + shift + p，查找coverage，打开覆盖率面板

开始录制后刷新网页，即可看到每个js文件的覆盖率，以及总的覆盖率

想提高覆盖率，需要尽可能多的使用动态导入，也就是懒加载功能，将一切能使用懒加载的地方都是用懒加载，这样可以大大提高覆盖率

但有时候使用懒加载会影响用户体验，所以可以在懒加载时使用魔法注释：Prefetching，是指在首页资源加载完毕后，空闲时间时，将动态导入的资源加载进来，这样即可以提高首屏加载速度，也可以解决懒加载可能会影响用户体验的问题，一举两得！

```js
function getComponent() {
  return import(/* webpackPrefetch: true */ 'jquery').then(({ default: $ }) => {
    return $('<div></div>').html('我是main')
  })
}
```
## nginx配置浏览器缓存

可以利用服务器缓存实现第一次加载资源，第二次从缓存中取出就不需要再次请求

```nginx
location ~.*\.(js|css|html|png|jpg)$
{
    expires 3d;
}
````

## 浏览器缓存

重新发布上线不重启服务器，用户再次访问服务器就不需要再次加载第三方模块了

但此时会遇到一个新的问题，如果再次打包上线不重启服务器，客户端会把以前的业务代码和第三方模块同时缓存，再次访问时依旧会访问缓存中的业务代码，所以会导致业务代码也无法更新

需要在output节点的filename中使用placeholder语法，根据代码内容生成文件名的hash：

```js
output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[contenthash:8].bundle.js',
    publicPath: '/'
  },
```

之后每次打包业务代码时，如果有改变，会生成新的hash作为文件名，浏览器就不会使用缓存了，而第三方模块不会重新打包生成新的名字，则会继续使用缓存