<template>
  <div class="avatar-dialog">
    <button class="close-button" @click="closeDialog">X</button>
    <img :src="avatarUrl" alt="Avatar" class="avatar-large" />
    <label for="fileInput" class="change-avatar-button">
      上传头像
      <input id="fileInput" type="file" @change="onFileChange" class="file-input" />
    </label>
  </div>qingb
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import apiClient from "@/aplClient";
import axios from 'axios';

const props = defineProps({
  avatarUrl: String,
  userId: Number
});

const emit = defineEmits(['close', 'changeAvatar']);

const closeDialog = () => {
  emit('close');
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const arrayBuffer = event.target.result;
    const blobData = new Blob([new Uint8Array(arrayBuffer)], { type: file.type });

    axios.put('http://127.0.0.1:9000/image/' + file.name, blobData, {
      headers: {
        'Content-Type': file.type, // 使用文件的 MIME 类型
      },
    })
      .then(response => {
        const avatarUrlToSend = 'http://127.0.0.1:9000/image/' + file.name;
        console.log(111);

        // 更新数据库中的头像 URL
        apiClient.post('/update-avatar', {
          userId: props.userId,
          avatarUrl: avatarUrlToSend
        })
          .then(dbResponse => {
            emit('changeAvatar', avatarUrlToSend);
          })
          .catch(dbError => {
            console.error('Error updating avatar URL in DB:', dbError);
            alert('头像地址更新失败，请重试');
          });

      })
      .catch(error => {
        console.error('Error uploading file:', error);
        alert('头像上传失败，请重试');
      });
  };

  reader.readAsArrayBuffer(file);
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
    width: 400px;
    height: 400px;
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
    display: inline-block;
    color: black;

    input[type="file"] {
      display: none;
    }
  }
}
</style>
