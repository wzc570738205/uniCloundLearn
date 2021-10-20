'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command
	const $ = dbCmd.aggregate

	let id = event.queryStringParameters['id']
	const collection = db.collection('mall_type');
	let res = await collection.where({
		_id: dbCmd.eq(id)
	}).remove()
	//返回数据给客户端
	return res
};
