<template>
  <div class="avatar-dialog">
    <button class="close-button" @click="closeDialog">X</button>
    <img :src="avatarUrl" alt="Avatar" class="avatar-large" />
    <button class="change-avatar-button" @click="changeAvatar">更换头像</button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  avatarUrl: String
});

const emit = defineEmits(['close', 'changeAvatar']);

const closeDialog = () => {
  emit('close');
};

const changeAvatar = () => {
  emit('changeAvatar');
};
</script>

<style scoped lang="less">
.avatar-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .avatar-large {
    max-width: 90%;
    max-height: 90%;
    margin-bottom: 20px;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 20px;
    background: transparent;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
  }

  .change-avatar-button {
    background: #ffffff;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
  }
}
</style>
