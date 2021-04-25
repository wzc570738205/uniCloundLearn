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
	console.log('res.data : ', res.data)
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
