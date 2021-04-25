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
