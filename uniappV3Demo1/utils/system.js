	let system = uni.getSystemInfoSync()
	export let getStatusBarHeight = ()=>system.statusBarHeight||15
	
	export let getTitleBarHeight=()=>{
		if(uni.getMenuButtonBoundingClientRect){
			let {top,height}=uni.getMenuButtonBoundingClientRect()
			return height+(top-getStatusBarHeight())*2
		}else{
			return 40
		}
	}
	
	export let getNavBarHeight=()=>getStatusBarHeight()+getTitleBarHeight()
	
	export let a=1