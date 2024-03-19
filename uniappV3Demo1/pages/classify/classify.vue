<template>
	<view class="main pageBG">
		<custom-nav-bar title='分类'></custom-nav-bar>
		<view class="classify">
			<theme-item v-for="item in classifyList" :key="item._id" :item="item"></theme-item>
		</view>
	</view>
</template>

<script setup>
	import {getData} from '../../api/apis.js'
	let classifyList=ref()
	getData('/classify',{pageSize:15}).then(res=>{
		classifyList.value=res.data.data
	})
	
	// 分享给好友
	onShareAppMessage(e=>{
		return{
			title:'我的壁纸',
			path:'pages/classify/classify'
		}
	})
	// 分享给朋友圈
	onShareTimeline(e=>{
		return{
			title:'我的壁纸',
			path:'pages/classify/classify',
		}
	})
</script>

<style lang="scss" scoped>
.classify{
	padding: 30rpx;
	display: grid;
	grid-template-columns: repeat(3,1fr);
	gap: 15rpx;
}
</style>
