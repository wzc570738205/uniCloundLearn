<template>
	<view class="u-padding-20">
		<u-form :model="form" ref="uForm">
			<u-form-item label="商品分类" prop="name" label-width='150'>
				<u-input v-model="form.name" placeholder="衣服、酒水等等" />
			</u-form-item>
		</u-form>
		<u-button @click="submit" type="primary" >提交</u-button>

		<u-divider class="u-padding-20">已添加类型</u-divider>
		<u-tag :text="item.name" v-for="(item,index) in typeList" :key="index" closeable
			@close="tagClick(item,index)" />
		<u-empty text="没有数据" mode="list" v-if='typeList.length==0'></u-empty>

		<u-modal v-model="show" content="是否删除商品类型？" @confirm='confirm' show-cancel-button></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: ''
				},
				typeList: [],
				show: false,
				selectItem: {}, //选中类型数据
				rules: {
					name: [{
						required: true,
						message: '请输入商品分类',
						trigger: ['blur', 'change']
					}]
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			this.getType()
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.addType()
					}
				});
			},
			addType() {
				uni.showLoading({
					title: '添加中'
				});
				uni.request({
					url: 'https://******.com/http/addtype',
					data: {
						name: this.form.name
					},
					success: (res) => {
						if (res.data.code == 200) {
							uni.showToast({
								icon: 'success',
								title: '添加成功'
							});
							this.$refs.uForm.resetFields()
						} else {
							uni.showToast({
								icon: 'error',
								title: res.data.mesg || '添加失败'
							});
						}
					},
					complete: () => {
						uni.hideLoading();
						this.getType()
					}
				})
			},
			getType() {
				uni.showLoading({
					title: '获取分类中'
				});
				uni.request({
					url: 'https://***.com/http/gettype',
					success: (res) => {
						this.typeList = res.data.data || []
						uni.hideLoading()
					}
				})
			},
			tagClick(item, index) {
				this.show = true;
				this.selectItem = item
			},
			confirm() {
				uni.request({
					url: 'https://***.com/http/deltype',
					data: {
						id: this.selectItem._id
					},
					success: (res) => {
						uni.showToast({
							icon: 'success',
							title: '删除成功'
						});
						this.getType()
					}
				})
			}
		}
	}
</script>

<style>

</style>
