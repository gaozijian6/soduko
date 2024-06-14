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
      <div class="footer-top">
        <button ref="emojiButton" class="emoji-button" @click="toggleEmojiPicker">😊</button>
        <EmojiPicker v-if="showEmojiPicker" @select="addEmoji" @close="closeEmojiPicker" :emojiButton="emojiButton"/>
      </div>
      <div class="footer-middle">
        <textarea v-model="newMessage" placeholder="输入消息..." />

      </div>
      <div class="footer-down">
        <button @click="sendMessage" class="send-button">发送</button>
        <button @click="closeChat" class="close-button">关闭</button>
      </div>
    </div>
  </div>
</template>



  
  <script setup>
import { ref, watch, onMounted, nextTick } from "vue";
import EmojiPicker from './EmojiPicker.vue';

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
const showEmojiPicker = ref(false);
const emojiButton = ref(null);

onMounted(() => {
  // 初始化时滚动到底部
  nextTick(() => {
    scrollToBottom();
  });
});

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

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const addEmoji = (emoji) => {
  newMessage.value += emoji;
  showEmojiPicker.value = false;
};

const closeEmojiPicker = () => {
  showEmojiPicker.value = false;
};

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

onMounted(() => {
  console.log('emojiButton onMounted:', emojiButton.value);
});
</script>
  
  <style scoped lang="less">
.chat-dialog {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 500px;
  height: 600px;
  border: 1px solid #ddd;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: linear-gradient(to right, #8e2de2, #4a00e0);
    color: white;
    font-size: 18px;

    button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: white;

      &:hover {
        color: #ddd;
      }
    }
  }

  .chat-body {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    background: #f5f5f5;

    .message-sent,
    .message-received {
      display: flex;
      margin-bottom: 10px;

      .message-content {
        max-width: 70%;
        padding: 10px;
        border-radius: 10px;
        word-wrap: break-word;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        width: fit-content;
      }
    }

    .message-sent {
      justify-content: flex-end;

      .message-content {
        background-color: #dcf8c6;
        color: #333;
      }
    }

    .message-received {
      justify-content: flex-start;

      .message-content {
        background-color: #ffffff;
        border: 1px solid #ddd;
        color: #333;
      }
    }
  }

  .chat-footer {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-top: 1px solid #ddd;

    .footer-top {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ddd;

      .emoji-button {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #555;

        &:hover {
          color: #333;
        }
      }
    }

    .footer-middle {
      display: flex;
      align-items: center;

      textarea {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 20px;
        outline: none;
        font-size: 14px;
        height: 60px;
    }
    }

    .footer-down {
      display: flex;
      justify-content: flex-end;

      .send-button,
      .close-button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        margin-left: 5px;
        transition: background-color 0.3s;
      }

      .send-button {
        background-color: #007bff;
        color: white;

        &:hover {
          background-color: #0056b3;
        }
      }

      .close-button {
        background-color: #e74c3c;
        color: white;

        &:hover {
          background-color: #c0392b;
        }
      }
    }
  }
}

</style>
  