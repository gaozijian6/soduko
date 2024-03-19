<template>
	<view class="noticeLayout">
		<view class="title">
			<view class="tag">置顶</view>
			<view class="font">这个区域填写标题</view>
		</view>
		
		<view class="info">
			<view class="item"></view>
			<view class="item">
				<uni-dateformat :date="Date.now()" format="yyyy-MM-dd hh:mm:ss"></uni-dateformat>
			</view>
		</view>
		
		<view class="content">
			内容区域
		</view>
	</view>
</template>

<script setup>
	import {ref} from 'vue'
</script>

<style lang="scss" scoped>

</style>
