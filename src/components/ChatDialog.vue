<template>
    <div v-if="show" class="chat-dialog">
      <div class="chat-header">
        <span>与 {{ currentFriend.username }} 对话中</span>
        <button @click="closeChat">关闭</button>
      </div>
      <div class="chat-body">
        <!-- 对话内容 -->
      </div>
      <div class="chat-footer">
        <input v-model="newMessage" placeholder="输入消息..." />
        <button @click="sendMessage">发送</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    show: Boolean,
    currentFriend: Object
  });
  
  const emit = defineEmits(['close']);
  
  const newMessage = ref('');
  
  const closeChat = () => {
    emit('close');
  };
  
  const sendMessage = () => {
    if (newMessage.value.trim() !== '') {
      // 处理发送消息的逻辑
      newMessage.value = '';
    }
  };
  </script>
  
  <style scoped lang="less">
  .chat-dialog {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 300px;
    height: 400px;
    border: 1px solid #ccc;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  
    .chat-header,
    .chat-footer {
      padding: 10px;
      background: #f5f5f5;
      border-bottom: 1px solid #ddd;
    }
  
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: none;
  
      button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
      }
    }
  
    .chat-body {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
    }
  
    .chat-footer {
      display: flex;
      align-items: center;
      border-top: 1px solid #ddd;
  
      input {
        flex: 1;
        padding: 5px;
        margin-right: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
  
      button {
        padding: 5px 10px;
        border: none;
        background-color: #007bff;
        color: white;
        border-radius: 4px;
        cursor: pointer;
  
        &:hover {
          background-color: #0056b3;
        }
      }
    }
  }
  </style>
  