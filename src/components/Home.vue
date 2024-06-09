<template>
  <div>
    <h1>Welcome to the Home Page, {{ username }}</h1>
    <p>You have successfully logged in!</p>

    <div>
      <label for="friendName">Enter Friend's Name:</label>
      <input type="text" v-model="friendName" required />
      <button @click="findFriend">Find Friend</button>
    </div>
    <div v-if="friendResult">
      <p>Friend found: {{ friendResult.name }}</p>
      <button @click="sendFriendRequest(friendResult.id, friendResult.name)">
        Send Friend Request
      </button>
    </div>

    <div v-if="newFriendRequest" @click="showFriendRequestDialog">
      <p class="new-request">
        You have a new friend request from {{ newFriendRequest.username }}
      </p>
    </div>

    <div v-if="showDialog" class="dialog">
      <p>Accept friend request from {{ newFriendRequest.username }}?</p>
      <button @click="handleFriendRequest('accepted')">Accept</button>
      <button @click="handleFriendRequest('rejected')">Reject</button>
      <button @click="closeFriendRequestDialog">Cancel</button>
    </div>

    <div>
      <h2>Your Friends</h2>
      <div class="friends-list">
        <div
          v-for="friend in friends"
          :key="friend.id"
          :class="{
            'friend-item': true,
            selected: friend.id === selectedFriend,
          }"
          @click="selectFriend(friend.id)"
          @dblclick="startChatWithFriend(friend.id)"
        >
          {{ friend.username }}
        </div>
      </div>
    </div>

    <button @click="startChat">开始对话</button>

    <button @click="logout">Logout</button>

    <ChatDialog
      :show="showChat"
      :currentFriend="currentFriend"
      @close="closeChat"
      :messages="messages"
      @update:messages="updateMessages"
      :sender_id="userId"
      :receiver_id="selectedFriend"
    />
  </div>
</template>
  
  <script setup>
import axios from "axios";
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ChatDialog from "./ChatDialog.vue";

const router = useRouter();
const route = useRoute();
const userId = route.query.userId;
const username = ref(route.query.username);
const token = localStorage.getItem(`${userId}-token`);
const newFriendRequest = ref(null);
const friendName = ref("");
const friendResult = ref(null);
const friends = ref([]);
const selectedFriend = ref(null);
const showChat = ref(false);
const currentFriend = ref(null);
const showDialog = ref(false);
const messages = ref([]);
const ws = new WebSocket("ws://localhost:3000");

onMounted(() => {
  accessProtectedRoute();
  fetchFriends();
  checkForFriendRequests(); // 查询新好友请求

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "identify", userId })); // 发送用户标识信息
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
      console.log("Received message:", data.text);
    if (data.type == "message") {
      messages.value.push({ message: data.text, sender_id: data.senderId, receiver_id: userId});
    }
  };
});

onUnmounted(() => {
  ws.close();
});


const updateMessages = (newMessage) => {
  messages.value.push({
    message: newMessage,
    sender_id: userId,
    receiver_id: selectedFriend.value,
  });
  ws.send(
    JSON.stringify({
      type: "message",
      text: newMessage,
      targetUserId: selectedFriend.value,
    })
  );
};

const startChatWithFriend = (friendId) => {
  selectFriend(friendId);
  startChat();
};

const selectFriend = (friendId) => {
  selectedFriend.value = friendId;
  currentFriend.value = friends.value.find(
    (friend) => friend.id === selectedFriend.value
  );
  fetchConversations(userId, selectedFriend.value);
};

const showFriendRequestDialog = () => {
  showDialog.value = true;
};

const startChat = () => {
  if (selectedFriend.value) {
    currentFriend.value = friends.value.find(
      (friend) => friend.id === selectedFriend.value
    );
    showChat.value = true;
  }
};

const closeChat = () => {
  showChat.value = false;
  currentFriend.value = null;
};

const logout = () => {
  localStorage.removeItem(`${userId}-token`);
  router.push({ name: "login" });
};

// 创建自定义的 axios 实例
const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const fetchConversations = (sender_id,receiver_id) => {
  apiClient.get('/conversation', {
    params: { sender_id, receiver_id }
  })
  .then(response => {
    messages.value = response.data;
  })
  .catch(error => {
    console.error('Error fetching conversations:', error);
  });
};

// 查找好友
const findFriend = () => {
  if (!friendName.value) {
    alert("Please enter a friend's name");
    return;
  }

  apiClient
    .get("/findFriend", {
      params: { name: friendName.value },
    })
    .then((response) => {
      console.log(response.data);
      friendResult.value = response.data;
    })
    .catch((error) => {
      console.error("Error finding friend:", error);
      alert("Error finding friend");
    });
};

// 发送好友请求
const sendFriendRequest = (receiverId, receiverUsername) => {
  // 检查是否是自己
  if (userId === receiverId) {
    alert("You cannot send a friend request to yourself.");
    return;
  }

  // 检查是否已经是好友
  const isAlreadyFriend = friends.value.some(
    (friend) => friend.id === receiverId
  );
  if (isAlreadyFriend) {
    alert("User is already your friend.");
    return;
  }

  // 发送好友请求
  apiClient
    .post("/sendFriendRequest", {
      senderId: userId,
      senderUsername: username.value,
      receiverId,
      receiverUsername,
    })
    .then((response) => {
      alert(response.data.message);
    })
    .catch((error) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        console.error("Error sending friend request:", error);
        alert("An error occurred while sending the friend request.");
      }
    });
};

// 获取好友列表
const fetchFriends = () => {
  apiClient
    .get("/friends", {
      params: { userId },
    })
    .then((response) => {
      friends.value = response.data.friends;
    })
    .catch((error) => {
      console.error("Error fetching friends:", error);
    });
};

// 处理好友请求
const handleFriendRequest = (action) => {
  apiClient
    .post("/handleFriendRequest", {
      requestId: newFriendRequest.value.id,
      action: action,
    })
    .then(() => {
      if (action === "accepted") {
        alert("Friend request accepted");
        // fetchFriends(); // 更新好友列表
      } else {
        alert("Friend request rejected");
      }
      newFriendRequest.value = null; // 重置新好友请求
      showDialog.value = false; // 关闭对话框
    })
    .catch((error) => {
      console.error("Error handling friend request:", error);
    });
};

// 查询新好友请求
const checkForFriendRequests = () => {
  apiClient
    .get("/friendRequests", {
      params: { receiverId: userId, status: "pending" },
    })
    .then((response) => {
      if (response.data.length > 0) {
        console.log(response.data);
        newFriendRequest.value = response.data[0]; // 假设只处理第一个请求
      }
    })
    .catch((error) => {
      console.error("Error checking for friend requests:", error);
    });
};

// 访问受保护的路由
const accessProtectedRoute = () => {
  apiClient
    .get("/protected")
    .then((response) => {
      const data = response.data;
      if (data.message) {
        // 访问成功，继续执行
        return;
      } else {
        alert("Access failed");
        router.push({ name: "login" });
      }
    })
    .catch((error) => {
      console.error("Error accessing protected route:", error);
      alert("Access failed");
      router.push({ name: "login" });
    });
};
</script>
  
<style scoped lang="less">
.new-request {
  background-color: yellow;
  padding: 10px;
  cursor: pointer;
}

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid black;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.friends-list {
  border: 1px solid #ccc;
  width: 300px;
  height: 500px;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
}

.friend-item {
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.friend-item.selected {
  background-color: #007bff;
  color: white;
}
</style>
