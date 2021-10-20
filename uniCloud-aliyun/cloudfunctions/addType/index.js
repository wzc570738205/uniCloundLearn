'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command
	const $ = dbCmd.aggregate
	const collection = db.collection('mall_type');

	let queryStringParameters = event.queryStringParameters
	let name = queryStringParameters['name']
	let callback = {}
	let isHasRes = await collection.where({
			name: dbCmd.eq(name)
		})
		.get()

	if (isHasRes.data.length) {
		callback = {
			mesg: '商品分类重复',
			code: 500
		}
	} else {
		let res = await collection.add({
			name: queryStringParameters['name']
		})
		console.log('res : ', res)
		//返回数据给客户端
		callback = {
			mesg: '添加成功',
			code: 200,
			id: res.id
		}
	}

	//返回数据给客户端
	return callback
};
