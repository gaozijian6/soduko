<template>
	<view class="main">
		<view class="loadingLayout" v-if="!classList.length">
			<uni-load-more status="loading"></uni-load-more>
		</view>
		<view class="content">
			<navigator :url="`/pages/preview/preview?id=${item._id}`" class="item" v-for="item in classList"
				:key="item._id">
				<image :src="item.smallPicurl" mode="aspectFill"></image>
			</navigator>
		</view>
		<view class="loadingLayout" v-if="classList.length">
			<uni-load-more :status="noData?'noMore':'loading'"></uni-load-more>
		</view>
	</view>
</template>

<script setup>
	import {
		getData
	} from '../../api/apis.js'
	import {
		ref
	} from "vue";
	let queryParams = {
		pageNum: 1,
		pageSize: 12
	}
	let classList = ref([])
	let noData = ref(false)
	let pageNamer
	onLoad(e => {
		let {
			id,
			name,
			type
		} = e
		if (type) {
			queryParams.type = type
			noData.value=true
		}
		if (id) queryParams.classid = id
		pageNamer = name
		uni.setNavigationBarTitle({
			title: name
		})
		if (queryParams.classid) {
			getData('/wallList', queryParams).then(res => {
				classList.value = res.data.data
				uni.setStorageSync('classList', classList.value)
			})
		}
		if (queryParams.type) {
			getData('/userWallList', queryParams).then(res => {
				classList.value = res.data.data
				uni.setStorageSync('classList', classList.value)
			})
		}

	})
	onReachBottom(() => {
		if (noData.value) return
		queryParams.pageNum++
		getData('/wallList', queryParams).then(res => {
			classList.value = [...classList.value, ...res.data.data]
			if (res.data.data.length == 0) noData.value = true
			uni.setStorageSync('classList', classList.value)
		})
	})

	// 分享给好友
	onShareAppMessage(e => {
		return {
			title: '我',
			path: `pages/classlist/classlist?id=${queryParams.classid}&name=${pageNamer}`
		}
	})
	// 分享给朋友圈
	onShareTimeline(e => {
		return {
			title: '我的壁纸',
			query: `id=${queryParams.classid}&name=${pageNamer}`,
		}
	})

	onUnload(() => {
		uni.removeStorageSync('classList')
	})
</script>

<style lang="scss" scoped>
	.main {
		.content {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 5rpx;
			padding: 5rpx;

			.item {
				height: 440rpx;

				image {
					width: 100%;
					height: 100%;
					display: block;
				}
			}
		}
	}
</style>