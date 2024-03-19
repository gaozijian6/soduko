<template>
	<view class="main">
		<view class="navbar">
			<view class="statusBar" :style="{height:getStatusBarHeight()+'px'}"></view>
			<view class="titleBar" :style="{height:getTitleBarHeight()+'px'}">
				<view class="title">
					{{title}}
				</view>
<!-- 				<view class="search">
					<uni-icons type="search" class="icon" color="#888" size="18"></uni-icons>
					<text class="text">搜素</text>
				</view> -->
			</view>
		</view>
		<view class="fill" :style="{height:getNavBarHeight()+'px'}">

		</view>
	</view>
</template>

<script setup>
	import {
		getStatusBarHeight,
		getTitleBarHeight,
		getNavBarHeight
	} from '../../utils/system.js'
	
	defineProps({
		title:{
			type:String,
			default:"壁纸",
		}
	})
</script>

<style lang="scss" scoped>
	.main {
		.navbar {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 10;
			background: linear-gradient(to bottom, transparent, #fff 400rpx), linear-gradient(to right, #beecd8, #f4e2d8);

			.statusBar {}

			.titleBar {
				display: flex;
				padding: 0 30rpx;
				// border: 1px solid green;
				height: 100rpx;
				align-items: center;

				.title {
					font-size: 22px;
					font-weight: 700;
					color: $text-font-color-1;
				}

				.search {
					width: 220rpx;
					height: 50rpx;
					border-radius: 60rpx;
					background: rgba (255, 255, 255, 0.4);
					border: 1px solid #fff;
					margin-left: 30rpx;
					color: #999;
					font-size: 28rpx;
					display: flex;
					align-items: center;

					.icon {
						margin-left: 5rpx;
					}

					.text {
						padding-left: 10rpx;
					}
				}
			}
		}

		.fill {
			width: 100vw;
		}
	}
</style>