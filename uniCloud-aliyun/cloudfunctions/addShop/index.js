'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command
	const $ = dbCmd.aggregate
	const collection = db.collection('mall_shop');

	let body = JSON.parse(event.body)
	let name = body['name']
	let key = body['key']
	let icon = body['icon']
	let price = body['price']
	let callback = {}
	let isHasRes = await collection.where({
			name: dbCmd.eq(name)
		})
		.get()

	if (isHasRes.data.length) {
		callback = {
			mesg: '商品重复',
			code: 500
		}
	} else {
		let res = await collection.add({
			name: name,
			key: key,
			icon: icon,
			price: price,
		})
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
