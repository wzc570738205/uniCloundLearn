'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database(); //代码块为cdb
	const dbCmd = db.command
	//查询商品分类
	const typeRes = await db.collection('mall_type').get()
	const collection = db.collection('mall_shop');
	let shopList = []
	let typeList = typeRes.data || []
	for (var i = 0; i < typeList.length; i++) {
		//查询商品分类下的所属商品
		let list = await collection.where({
				key: dbCmd.eq(typeList[i]._id)
			})
			.get()
		let obj = {
			name: typeList[i].name,
			foods: list.data || []
		}
		shopList.push(obj)
	}

	//返回数据给客户端
	return {
		data: shopList
	}
};
