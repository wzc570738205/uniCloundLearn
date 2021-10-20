exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database(); //代码块为cdb

	const res = await db.collection('mall_type').get()
	//返回数据给客户端
	return res
};
