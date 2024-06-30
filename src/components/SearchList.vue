<template>
    <div class="SearchList">
        <div class="friendItem" v-for="item in filterFriednsArr" :key="item.user_id">
            <img :src="item.avatar_url" alt="头像">
            <div class="username" v-html="highlightText(item.username)"></div>
            <div class="user_id" v-html="highlightText(item.user_id.toString()) "></div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    filterFriednsArr: Array,
    filterVal: String
})

const highlightText = (text) => {
    if (!props.filterVal) return text;
    const regex = new RegExp(`(${props.filterVal})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}
</script>

<style lang="less" scoped>
.SearchList {
    width: 300px;
    height: 530px;
    background-color: #fff;
    z-index: 1000;
    position: absolute;
    top: 35px;
    left: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    .friendItem {
        display: flex;
        align-items: center;
        padding: 10px 10px;
        border-bottom: 1px solid #f0f0f0;
        width: 100%;
        height: 60px;
        cursor: default;

        &:hover {
            background-color: #f0f0f0;
        }

        img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }

        .username {
            font-size: 14px;
            color: #000000;
            margin-right: 10px;
        }

        .user_id {
            font-size: 12px;
            color: #999;
        }
    }
}
</style>
