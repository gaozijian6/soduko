<template>
    <div :class="['overlay', { 'fade-in': show, 'fade-out': !show }]">
        <div :class="['message-box',  {'success': isSuccess, 'failure': !isSuccess}]">
            <p>{{ isSuccess ? '登录成功' : '登录失败' }}</p>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    isSuccess: {
        type: Boolean,
        default: false,
    },
});
</script>

<style lang="less" scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;

    .message-box {
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
        color: white;
        font-size: 18px;
        width: 200px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .success {
        background: #4CAF50;
    }

    .failure {
        background: #f44336;
    }
}

.fade-in {
    opacity: 1;
    z-index: 1000;
    transition: opacity 0.5s;
}

.fade-out {
    opacity: 0;
    z-index: -10;
    transition: opacity 0.2s;
}
</style>