<template>
  <div v-if="show" class="chat-dialog">
    <div class="chat-header">
      <span>与 {{ currentFriend.username }} 对话中</span>
      <button @click="closeChat">关闭</button>
    </div>
    <div class="chat-body" ref="chatBody">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="{
          'message-sent': message.sender_id == sender_id,
          'message-received': message.sender_id != sender_id,
        }"
      >
        <span class="message-content">{{ message.message }}</span>
      </div>
    </div>
    <div class="chat-footer">
      <input v-model="newMessage" placeholder="输入消息..." />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, watch, onMounted, nextTick } from "vue";

const props = defineProps({
  show: Boolean,
  currentFriend: Object,
  messages: Array,
  sender_id: Number,
  receiver_id: Number,
});

const emit = defineEmits(["update:messages", "close"]);

const newMessage = ref("");
const chatBody = ref(null);

onMounted(() => {
  // 初始化时滚动到底部
  nextTick(() => {
    scrollToBottom();
  });
});

// 回调函数
const handleReceiverIdChange = (newReceiverId, oldReceiverId) => {
  console.log(`Receiver ID changed from ${oldReceiverId} to ${newReceiverId}`);
  // 在这里可以添加其他需要在receiver_id变化时执行的逻辑
};

// 监听 receiver_id 的变化
watch(
  () => props.receiver_id,
  (newReceiverId, oldReceiverId) => {
    handleReceiverIdChange(newReceiverId, oldReceiverId);
  }
);

watch(
  () => props.messages,
  (newMessages) => {
    // 监听 messages 数组的变化并滚动到底部
    nextTick(() => {
      scrollToBottom();
    });
  },
  { deep: true }
);

const scrollToBottom = () => {
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight;
  }
};

const closeChat = () => {
  emit("close");
};

const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    emit("update:messages", newMessage.value);
    newMessage.value = "";
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

    .message-sent,
    .message-received {
      display: flex;
      margin-bottom: 10px;

      .message-content {
        max-width: 70%;
        padding: 10px;
        border-radius: 10px;
        word-wrap: break-word;
        width: fit-content;
      }
    }

    .message-sent {
      justify-content: flex-end;

      .message-content {
        background-color: #dcf8c6;
      }
    }

    .message-received {
      justify-content: flex-start;

      .message-content {
        background-color: #fff;
        border: 1px solid #ccc;
      }
    }
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
  