<template>
	<view class="main pageBG">
		<custom-nav-bar title='推荐'></custom-nav-bar>
		<view class="banner">
			<swiper circular indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff"
				autoplay>
				<swiper-item v-for="item in bannerList" :key="item._id">
					<image :src="item.picurl" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="notice">
			<view class="left">
				<uni-icons type="sound-filled" size="20"></uni-icons>
				<text>公告</text>
			</view>
			<view class="center">
				<swiper vertical autoplay interval="1500" duration="300" circular="">
					<swiper-item v-for="item in noticeList" :key="item._id">
						{{item.title}}
					</swiper-item>
				</swiper>
			</view>
			<view class="right">
				<uni-icons type="right"></uni-icons>
			</view>
		</view>

		<view class="select">
			<common-title>
				<template #left>每日推荐</template>
				<template #custom>
					<view class="date">
						<uni-icons type="calendar" size="18"></uni-icons>
						<uni-dateformat :date="Date.now()" format="dd日"></uni-dateformat>
					</view>
				</template>
			</common-title>
			<view class="content">
				<scroll-view scroll-x>
					<view class="box" v-for="item in randomList" :key="item._id" @click="goPreview(item._id)">
						<image :src="item.smallPicurl" mode="aspectFill"></image>
					</view>
				</scroll-view>
			</view>

			<view class="theme">
				<common-title>
					<template #left>专题精选</template>
					<template #custom>
						<navigator url="" class="more">More+</navigator>
					</template>
				</common-title>

				<view class="content">
					<theme-item v-for="item in classifyList" :key="item._id" :item="item"></theme-item>
					<theme-item :isMore='true'></theme-item>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {getData} from '../../api/apis.js'
import { ref } from "vue";
	function goPreview(id) {
		uni.setStorageSync('classList',randomList.value)
		uni.navigateTo({
			url: '/pages/preview/preview?id='+id,
		})
	}
	let bannerList = ref()
	getData('/homeBanner').then(res=>{
		bannerList.value=res.data.data
	})

	let randomList = ref()
	getData('/randomWall').then(res=>{
		randomList.value=res.data.data
	})
	
	let noticeList=ref()
	getData('/wallNewsList').then(res=>{
		noticeList.value=res.data.data
	})
	
	let classifyList=ref()
	getData('/classify',{select:true}).then(res=>{
		classifyList.value=res.data.data
		console.log(res);
	})
	// 分享给好友
	onShareAppMessage(e=>{
		return{
			title:'我的壁纸',
			path:'pages/index/index'
		}
	})
	// 分享给朋友圈
	onShareTimeline(e=>{
		return{
			title:'我的壁纸',
			imageUrl:bannerList.value[0].picurl
		}
	})
	
</script>

<style lang="scss" scoped>
	.main {
		.banner {
			width: 750rpx;
			padding: 30rpx 0;

			swiper {
				width: 750rpx;
				height: 340rpx;

				swiper-item {
					width: 100%;
					height: 100%;
					padding: 0 30rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 30rpx;
					}
				}
			}
		}

		.notice {
			width: 690rpx;
			height: 80rpx;
			background-color: #f9f9f9;
			margin: 0 auto;
			border-radius: 80rpx;
			display: flex;
			line-height: 80rpx;

			.left {
				width: 140rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				:deep() {
					.uni-icons {
						color: $my-green !important;
					}
				}

				text {
					color: $my-green;
					font-weight: 600;
					font-size: 28rpx;
				}
			}

			.center {
				flex: 1;

				swiper {
					height: 100%;

					swiper-item {
						height: 100%;
						font-size: 30rpx;
						color: #666;
						// overflow: hidden;
						// white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}

			.right {
				width: 70rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.select {
			padding-top: 50rpx;

			.date {
				color: $my-green;
				display: flex;
				align-items: center;

				:deep() {
					.uni-icons {
						color: $my-green !important;
					}
				}
			}

			.content {
				width: 720rpx;
				margin-left: 15rpx;
				margin-top: 30rpx;

				scroll-view {
					white-space: nowrap;

					.box {
						width: 200rpx;
						height: 430rpx;
						display: inline-block;
						margin-right: 15rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 10rpx;
						}

						&:last-child {
							margin-right: 30rpx;
						}
					}
				}
			}
		}

		.theme {
			padding: 50rpx 0;

			.more {
				font-size: 32rpx;
				color: #888;
			}

			.content {
				margin-top: 30rpx;
				padding: 0 30rpx;
				display: grid;
				gap: 15rpx;
				grid-template-columns: repeat(3, 1fr);
			}
		}
	}
</style>