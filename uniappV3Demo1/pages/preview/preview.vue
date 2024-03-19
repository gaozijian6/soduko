<template>
	<view class="main" v-if="currentInfo">
		<swiper circular :current="currentIndex" @change="swiperChange">
			<swiper-item v-for="(item,index) in classList" :key="item._id">
				<image v-if="readImgs.has(index)" @click="maskChange" :src="item.picurl" mode="aspectFill"></image>
			</swiper-item>
		</swiper>

		<view class="mask" v-if="maskState">
			<view class="goBack" @click="goBack" :style="{top:getStatusBarHeight()+'px'}">
				<uni-icons type="back" color="#fff" size="20"></uni-icons>
			</view>
			<view class="count">{{currentIndex+1}} / {{classList.length}}</view>
			<view class="time">
				<uni-dateformat :date="Date.now()" format="hh:mm"></uni-dateformat>
			</view>
			<view class="date">
				<uni-dateformat :date="Date.now()" format="MM月dd日"></uni-dateformat>
			</view>
			<view class="footer">
				<view class="box" @click="clickInfo">
					<uni-icons type="info" size="28"></uni-icons>
					<view class="text">信息</view>
				</view>
				<view class="box" @click="clickScore">
					<uni-icons type="star" size="28"></uni-icons>
					<view class="text">{{currentInfo.score}}分</view>
				</view>
				<view class="box" @click="clickDownload">
					<uni-icons type="download" size="28"></uni-icons>
					<view class="text">下载</view>
				</view>
			</view>
		</view>

		<uni-popup ref="infoPopup" type="bottom">
			<view class="infoPopup">
				<view class="popHeader">
					<view class=""></view>
					<view class="title">壁纸信息</view>
					<view class="close" @click="clickInfoClose">
						<uni-icons type="closeempty" size="18" color="#999"></uni-icons>
					</view>
				</view>

				<scroll-view scroll-y>
					<view class="content">
						<view class="row">
							<view class="label">壁纸ID：</view>
							<text user-select class="value">{{currentInfo._id}}</text>
						</view>
						<!-- 					<view class="row">
							<view class="label">分类：</view>
							<text user-select class="value class">明星美女</text>
						</view> -->
						<view class="row">
							<view class="label">发布者：</view>
							<text user-select class="value">{{currentInfo.nickname}}</text>
						</view>
						<view class="row">
							<view class="label">评分：</view>
							<view user-select class="value rateBox">
								<uni-rate readonly touchable :value="currentInfo.score" />
							</view>
						</view>
						<view class="row">
							<view class="label">摘要：</view>
							<text user-select class="value">{{currentInfo.description}}</text>
						</view>
						<view class="row">
							<view class="label">标签：</view>
							<view user-select class="value tabs">
								<view class="tab" v-for="tab in currentInfo.tabs" :key="tab">{{tab}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		<uni-popup ref="scorePopup" :is-mask-click="false">
			<view class="scorePopup">
				<view class="popHeader">
					<view class=""></view>
					<view class="title">{{isScore?'评分过了~':'壁纸评分'}}</view>
					<view class="close" @click="clickScoreClose">
						<uni-icons type="closeempty" size="18" color="#999"></uni-icons>
					</view>
				</view>

				<view class="content">
					<uni-rate v-model="userScore" allow-half="" :disabled="isScore" disabled-color="#ffca3e" />
					<text class="text">{{userScore}}分</text>
				</view>
				<view class="footer">
					<button @click="submitScore" :disabled="!userScore||isScore" type="default" size="mini"
						plain>确认评分</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		getStatusBarHeight
	} from '../../utils/system.js'
	import {
		getData
	} from '../../api/apis.js'
	import {
		ref
	} from "vue";
	let maskState = ref(true)

	function maskChange() {
		maskState.value = !maskState.value
	}

	let infoPopup = ref(null)
	let isScore = ref(false)

	function clickInfo() {
		infoPopup.value.open()
	}

	function clickInfoClose() {
		infoPopup.value.close()
	}

	let scorePopup = ref()
	let userScore = ref(3)
	// 评分弹窗
	function clickScore() {
		if (currentInfo.value.userScore) {
			isScore.value = true
			userScore.value = currentInfo.value.userScore
		}
		scorePopup.value.open()
	}
	// 关闭评分弹窗
	function clickScoreClose() {
		scorePopup.value.close()
		userScore.value = 0
		isScore.value = false
	}
	// 提交评分
	function submitScore() {
		uni.showLoading({
			title: '加载中...'
		})
		let {
			classid,
			_id: wallId
		} = currentInfo.value
		getData('/setupScore', {
			classid,
			wallId,
			userScore: userScore.value
		}).then(res => {
			if (res.data.errCode == 0) {
				uni.showToast({
					title: '评分成功',
					icon: 'none'
				})
				classList.value[currentIndex.value].userScore = userScore.value
				uni.setStorageSync('classList', classList.value)
				clickScoreClose()
				uni.hideLoading()
			}
		})
	}

	function goBack() {
		uni.navigateBack({
			success() {

			},
			fail() {
				console.log('no');
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		})
	}


	let classList = ref([])
	if (uni.getStorageSync('classList')) {
		classList.value = uni.getStorageSync('classList').map(item => {
			return {
				...item,
				picurl: item.smallPicurl.replace('_small.webp', '.jpg')
			}
		})
	}

	let currentId = ref()
	let currentIndex = ref(0)
	let readImgs = ref(new Set())
	let currentInfo = ref()
	onLoad(e => {
		currentId.value = e.id
		if (e.type == 'share') {
			getData('/detailWall', {
				id: e.id
			}).then(res => {
				classList.value = res.data.data.map(item => {
					return {
						...item,
						picurl: item.smallPicurl.replace('_small.webp', '.jpg')
					}
				})
			})
		}
		currentIndex.value = classList.value.findIndex(item => item._id == currentId.value)
		readImgs.value.add(currentIndex.value - 1 == -1 ? classList.value.length - 1 : currentIndex.value - 1)
		readImgs.value.add(currentIndex.value)
		readImgs.value.add(currentIndex.value + 1 == classList.value.length ? 0 : currentIndex.value + 1)
		currentInfo.value = classList.value[currentIndex.value]
	})

	function swiperChange(e) {
		currentIndex.value = e.detail.current
		readImgs.value.add(currentIndex.value - 1 == -1 ? classList.value.length - 1 : currentIndex.value - 1)
		readImgs.value.add(currentIndex.value)
		readImgs.value.add(currentIndex.value + 1 == classList.value.length ? 0 : currentIndex.value + 1)
		currentInfo.value = classList.value[currentIndex.value]
		console.log(currentInfo.value);
	}


	function clickDownload() {
		// #ifdef H5
		uni.showModal({
			content: '请长按保存壁纸',
			showCancel: false
		})
		// #endif

		// #ifndef H5
		uni.showLoading({
			title: '下载中...',
			mask: 'true'
		})
		let {
			classid,
			_id: wallId
		} = currentInfo.value
		getData('/downloadWall', {
			classid,
			wallId
		}).then(res => {
			uni.getImageInfo({
				src: currentInfo.value.picurl,
				success: res => {
					uni.saveImageToPhotosAlbum({
						filePath: res.path,
						success(res) {
							console.log(res);
						},
						fail(err) {
							if (err.errMsg == 'saveImageToPhotosAlbum:fail cancel') {
								uni.showToast({
									title: '保存失败，请重新点击下载',
									icon: 'none'
								})
								return
							}
							uni.showModal({
								title: '提示',
								content: '需要授权保存相册',
								success(res) {
									if (res.confirm) {
										uni.openSetting({
											success(setting) {
												if (setting
													.authSetting[
														'scope.writePhotoAlbum'
													]) {
													uni.showToast({
														title: '获取授权成功',
														icon: 'none'
													})
												} else {
													uni.showToast({
														title: '获取授权失败',
														icon: 'none'
													})
												}
											}
										})
									}
								}
							})
						},
						complete() {
							uni.hideLoading()
						}
					})
				}
			})
		})

		// #endif
	}

	// 分享给好友
	onShareAppMessage(e => {
		return {
			title: '我',
			path: `pages/preview/preview?id=${currentId.value}&type=share`
		}
	})
	// 分享给朋友圈
	onShareTimeline(e => {
		return {
			title: '我的壁纸',
			query: `id=${queryParams.classid}&type=share`
		}
	})
</script>

<style lang="scss" scoped>
	.main {
		width: 100%;
		height: 100vh;
		position: relative;

		swiper {
			width: 100%;
			height: 100%;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.mask {
			&>view {
				position: absolute;
				left: 0;
				right: 0;
				margin: auto;
				color: #fff;
				width: fit-content;
			}

			.goBack {
				width: 38px;
				height: 38px;
				background: rgba(0, 0, 0, 0.5);
				left: 30rpx;
				margin-left: 0;
				border-radius: 100px;
				top: 0;
				backdrop-filter: blur(10rpx);
				border: 1rpx solid rgba(255, 255, 255, 0.3);
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.count {
				top: 10vh;
				background: rgba(0, 0, 0, 0.3);
				font-size: 28rpx;
				border-radius: 40rpx;
				padding: 8rpx 28rpx;
			}

			.time {
				font-size: 140rpx;
				top: calc(10vh + 80rpx);
				font-weight: 100;
				line-height: 1em;
				text-shadow: 0 4rpx rgba(0, 0, 0, 0.3);
			}

			.date {
				font-size: 34rpx;
				top: calc(10vh + 230rpx);
				text-shadow: 0 2rpx rgba(0, 0, 0, 0.3);
			}

			.footer {
				background: rgba(255, 255, 255, 0.8);
				bottom: 10vh;
				width: 65vw;
				height: 120rpx;
				border-radius: 120rpx;
				color: black;
				display: flex;
				justify-content: space-around;
				align-items: center;
				box-shadow: 0 2rpx 0 rgba(0, 0, 0, 0.1);
				backdrop-filter: blur(20rpx);

				.box {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 2rpx 12rpx;

					.text {
						font-size: 26rpx;
						color: $text-font-color-2;
					}
				}
			}
		}

		.popHeader {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title {
				color: $text-font-color-2;
				font-size: 26rpx;
			}

			.close {
				padding: 6rpx;
			}
		}

		.infoPopup {
			background-color: #fff;
			padding: 30rpx;
			border-radius: 30rpx 30rpx 0 0;
			overflow: hidden;

			scroll-view {
				max-height: 60vh;

				.content {
					.row {
						display: flex;
						padding: 16rpx 0;
						font-size: 32rpx;
						line-height: 1.7em;

						.label {
							color: $text-font-color-3;
							width: 140rpx;
							text-align: right;
							font-size: 30rpx;
						}

						.value {
							flex: 1;
							width: 0;
						}

						.class {
							color: $my-green;
						}

						.tabs {
							display: flex;
							flex-wrap: wrap;

							.tab {
								display: inline-block;
								border: 1px solid $my-green;
								color: $my-green;
								font-size: 22rpx;
								padding: 10rpx 30rpx;
								border-radius: 40rpx;
								line-height: 1em;
								margin: 0 10rpx 10rpx 0;
							}
						}
					}
				}
			}
		}

		.scorePopup {
			background-color: #fff;
			padding: 30rpx;
			width: 70vw;
			border-radius: 30rpx;

			.content {
				padding: 30rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;

				.text {
					color: #FFCA3E;
					padding-left: 10rpx;
					width: 80rpx;
					line-height: 1em;
					text-align: right;
				}
			}

			.footer {
				padding: 10rpx 0;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

	}
</style>