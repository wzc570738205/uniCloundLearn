<template>
	<view class="u-padding-20">
		<u-form :model="form" ref="uForm" label-width='150'>
			<u-form-item label="商品名称" prop="name">
				<u-input v-model="form.name" placeholder="请输入商品名称" />
			</u-form-item>
			<u-form-item label="商品价格" prop="price">
				<u-input v-model="form.price" placeholder="请输入商品价格" type='number' />
			</u-form-item>
			<u-form-item label="商品类型" label-width="150" prop="keyLabel">
				<u-input type="select" :select-open="selectShow" v-model="form.keyLabel" placeholder="请选择商品类型"
					@click="selectShow = true"></u-input>
			</u-form-item>
			<u-form-item label="商品图片(<1MB)" prop="icon" label-width="150">
				<u-upload :max-size="1 * 1024 * 1024" ref="uUpload" width="160" height="160" @on-choose-complete='changeImg' :auto-upload="false" max-count="1"></u-upload>
			</u-form-item>
		</u-form>
		<u-button @click="submit" type="primary">提交</u-button>
		<u-select mode="single-column" :list="typeList" v-model="selectShow" @confirm="selectConfirm"></u-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectShow: false,
				form: {
					key: null,
					keyLabel: null,
					name: '',
					icon: '',
					price: null,
				},
				typeList: [],
				rules: {
					name: [{
						required: true,
						message: '请输入商品名称',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					price: [{
						required: true,
						message: '请输入商品价格',
						trigger: ['change', 'blur'],
					}],
					keyLabel: [{
						required: true,
						message: '请选择商品类型',
						trigger: ['change', 'blur'],
					}],
					icon: [{
						required: true,
						message: '请选择商品图片',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		mounted() {
			this.getType()
		},
		methods: {
			selectConfirm(e) {
				this.form.keyLabel = e[0].label;
				this.form.key = e[0].value;
			},
			getType() {
				uni.showLoading({
					title: '获取分类中'
				});
				uni.request({
					url: 'https://f31845e6-9d43-4229-971e-fbeabc0ebbee.bspapp.com/http/gettype',
					success: (res) => {
						this.typeList = res.data.data.map(e => {
							return {
								...e,
								value: e._id,
								label: e.name
							}
						}) || []
						uni.hideLoading()
					}
				})
			},
			changeImg(){
				let file = this.$refs.uUpload.lists[0]
				var fr = new FileReader();
				fr.onloadend = function(e) {
					this.form.icon = e.target.result;
					console.log(e.target.result)
				}.bind(this);
				fr.readAsDataURL(file.file);
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.addShop()
					}
				});
			},
			addShop() {
				uni.showLoading({
					title: '添加中'
				});
				uni.request({
					url: 'https://f31845e6-9d43-4229-971e-fbeabc0ebbee.bspapp.com/http/addshop',
					method: 'POST',
					data: {
						key: this.form.key,
						price: this.form.price,
						name: this.form.name,
						icon: this.form.icon,
					},
					success: (res) => {
						if (res.data.code == 200) {
							uni.showToast({
								icon: 'success',
								title: '添加成功'
							});
						//	this.$refs.uForm.resetFields()
						} else {
							uni.showToast({
								icon: 'error',
								title: res.data.mesg || '添加失败'
							});
						}
					},
					complete: () => {
						uni.hideLoading();
					}
				})
			},
		}
	}
</script>

<style>

</style>
