[uniapp云函数教程一]登录篇

JenK
发布于 刚刚
编辑
uniapp云函数教程之登录篇
今天我们使用uniapp提供的云函数以及云数据库来实现一个简单的登录、注册的功能。
学习本教程之前你需要简单了解一下：

vue的相关知识
uniapp的相关api
云函数的基本操作
云数据库的基本操作
当然，不会也没有关系，我会慢慢阐述。

1、起步
我们先简单介绍下实现一个登录注册功能需要那些前置东西

一个前端模板
数据库
后端代码
前端模板
如果你不会前端我们可以找一个模板。本文使用的模板为amo***@qq.com提供的插件极简登录注册模板

数据库
常规的开发我们会使用mysql来进行开发，今天我们使用uniapp提供的JSON 格式的文档型数据库,顾名思义，数据库中的每条记录都是一个 JSON 格式的文档。

这里就不在一一阐述，详情可参考云数据库基本概念

后端代码
这里我们使用uniapp提供的云函数，云函数是运行在云端的 JavaScript 代码，和普通的Node.js开发一样，熟悉Node.js的开发者可以直接上手。

2、准备
编辑器：hbuilderx
dcloud账号：注册地址。用于登录编辑器和dcloud，注册完成后需要进行验证激活,已有账号的同学可以跳过
dcloud开发者实名认证
3、前端项目
3.1 导入前端模板
打开插件库极简登录注册模板,点击使用 HBuilderX 导入插件,如下图3.1

图3.1
image.png
之后会打开编辑器进行导入，切记勾选启用uniCloud,如下图3.2

图3.2
image.png
导入成功后你会得到如下目录

image.png

这样，前端模板就创建完成了，接下来我们先把前端逻辑写好

3.2 修改前端代码
3.2.1 删除其他登录的代码
image.png

写入登录的请求接口的方法(完整代码可查看demo代码)

uni.showLoading({
    title: '登录中'
});
uni.request({
    url: 'xxxxxxxxxxx',
    data: {
        phoneData: this.phoneData,
        passData: this.passData
    },
    success: (res) => {
        console.log('res', res)
        // uni.showToast({
        //     icon: 'error',
        //     position: 'bottom',
        //     title: '账号或密码错误，账号admin密码admin'
        // });
    },
    complete: () => {
        uni.hideLoading();
        this.isRotate=false
    }
})
3.2.2 注册改为仅需要账号和密码注册
image.png

写入注册代码(完整代码可查看demo代码)

_this.isRotate = true
uni.showLoading({
    title: '注册中'
});
uni.request({
    url: 'xxxxxxxxxxx',
    data: {
        phoneData: this.phoneData,
        passData: this.passData
    },
    success: (res) => {
        console.log('res', res)
    },
    complete: () => {
        uni.hideLoading();
        _this.isRotate = false
    }
})
4、关联云函数
右键UniCloud文件夹，点击关联云服务空间或项目
image.png

点击新建，（需要提前进行实名认证）
image.png

接下来会跳转之网页，我们选择阿里云
image.png

新建完成后回到编辑器点击刷新，选择刚才新建的服务空间即可，点击关联
image.png

4.1添加云数据库
添加云数据库可以代码添加也可以使用网页进行操作，这里我们使用网页进行操作
打开unicloud服务空间列表,进入刚才新建的服务空间，选择新建云函数库。
image.png

创建空表即可，不需要选择模板
image.png

修改表结构如下
image.png

{
  "bsonType": "object",
  "required": [],
  "permission": {
    "read": false,
    "create": false,
    "update": false,
    "delete": false
  },
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "phoneData": {
      "description": "用户名"
    },
    "passData": {
      "description": "密码"
    }
  }
}
到这里，数据库已经新建完成。接下来我们新建处理接口的云函数

4.2新建云函数
4.2.1 注册函数
右键cloudfunctions文件夹，点击新建云函数
image.png

image.png

写入注册代码，这里我们只做数据插入操作，去重这里不做考虑，可以自行进行优化
image.png

'use strict';
exports.main = async (event, context) => {
    //event为客户端上传的参数
    console.log('event : ', event)

    const db = uniCloud.database(); //代码块为cdb
    const collection = db.collection('userTable');

    let queryStringParameters = event.queryStringParameters
    let res = await collection.add({
        phoneData: queryStringParameters['phoneData'],
        passData: queryStringParameters['passData']
    })
    //返回数据给客户端
    return {
        mesg: '注册成功',
        code: 200
    }
};
右键cloudfunctions，选择上传所有云函数··
image.png

启用域名绑定
image.png

打开即可
image.png

选择刚才的注册函数，点击详情
image.png

云函数URL化，点击编辑，填入/http/register
image.png

这个url便是我们的注册接口

4.2.1 登录函数
同理，新建login云函数，填入逻辑代码
image.png

'use strict';
exports.main = async (event, context) => {
    //event为客户端上传的参数
    console.log('event : ', event)
    const db = uniCloud.database(); //代码块为cdb
    const dbCmd = db.command
    const $ = dbCmd.aggregate
    let callback = {}

    let queryStringParameters = event.queryStringParameters
    let phoneData = queryStringParameters['phoneData']
    let passData = queryStringParameters['passData']

    const collection = db.collection('userTable');
    let res = await collection.where({
            phoneData: dbCmd.eq(phoneData)
        })
        .get()
    console.log('res.data[0].passData : ', res.data[0].passData)
    console.log('passData : ', passData)
    if (res.data.length == 0) {
        callback = {
            mesg: '没有此账号',
            code: 500
        }
    } else {
        if (res.data[0].passData == passData) {
            callback = {
                mesg: '登录成功',
                code: 200
            }
        }

        if (res.data[0].passData !== passData) {
            callback = {
                mesg: '密码错误',
                code: 500
            }
        }
    }

    //返回数据给客户端
    return callback
};
服务列表填入/http/login
image.png

然后我们将刚才的登录注册接口填入之前的空余的前端代码里

5.前后点联调
5.1 注册
image.png

5.2 登录
image.png

image.png

image.png

小结
今天的登录篇就到这里就结束了。
demo待优化的地方是重复注册，这里没做优化，可自行进行优化。

demo源码代码下载

更多问题欢迎加入前端交流群交流749539640
