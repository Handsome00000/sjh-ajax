# sjh-ajax （uni-app）
  1. sjh-ajax 使用了 u-ajax 插件，使用时 需要安装 u-ajax 不会安装的可直接 导入本项目 uni_modules 下的u-ajax;
  2. 本示例 基于 h5 封装了一个反向代理的 请求接口示例 （app与小程序没有跨域） 需在manifest.json 参考本示例配置；
  3. 如没有跨域 需求 直接在 libs/ajax.js 把url 换成自己的  http：//地址 即可
  4. 本示例在 ajax 下封装了 常用的 get 、 post 、delete 请求 包含 formData 格式 和json 格式 可以自己根据需求参考这几个方法自行封 
     装所需的请求方法
  5. ajax.js 封装好方法以后 即可创建一个api文件夹 写自己请求js 类似本示例 api/login.js,
  6. 调用api 参考 login.vue
  7. 有任何问题请在下方留言！（vue项目也可参考此封装模式，直接拿过去使用）
