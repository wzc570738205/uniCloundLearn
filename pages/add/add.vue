<template>
	<view>
		<u-grid :col="2">

			<u-grid-item @click='gopath("/pages/addType/addType")'>
				<u-icon name="plus" :size="80"></u-icon>
				<view class="grid-text">分类添加</view>
			</u-grid-item>

			<u-grid-item @click='gopath("/pages/addShop/addShop")'>
				<u-icon name="plus-square-fill" :size="80"></u-icon>
				<view class="grid-text">商品添加</view>
			</u-grid-item>
		</u-grid>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			gopath(path) {
				this.$u.route({
					url: path
				})
			},
		}
	}
</script>

<style>

</style>
