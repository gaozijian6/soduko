<template>
  <div class="container">
    <aside class="sidebar">
      <h1>Welcome, {{ username }}</h1>
      <div class="search-friend">
        <label for="friendId">Enter Friend's ID:</label>
        <input type="text" v-model="friendId" required />
        <button @click="findFriend">Find Friend</button>
      </div>
      <div v-if="friendResult" class="friend-result">
        <p>Friend found: {{ friendResult.username }}</p>
        <button
          @click="
            sendFriendRequest(friendResult.user_id, friendResult.username)
          "
        >
          Send Friend Request
        </button>
      </div>
      <div
        v-if="newFriendRequest"
        @click="showFriendRequestDialog"
        class="new-request"
      >
        <p>You have a new friend request from {{ newFriendRequest.name }}</p>
      </div>
      <div class="friends-section">
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
      <button @click="logout" class="logout-button">Logout</button>
    </aside>
    <main class="main-content">
      <ChatDialog
        :show="showChat"
        :currentFriend="currentFriend"
        @close="closeChat"
        :messages="messages"
        @update:messages="updateMessages"
        :sender_id="userId"
        :receiver_id="selectedFriend"
      />
    </main>
  </div>
</template>
  
  <script setup>
import axios from "axios";
import { ref, onMounted, onUnmounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import ChatDialog from "./ChatDialog.vue";

const router = useRouter();
const route = useRoute();
const userId = route.query.userId;
const username = ref(route.query.username);
const token = localStorage.getItem(`${userId}-token`);
const newFriendRequest = reactive(null);
const friendId = ref("");
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
      messages.value.push({
        message: data.text,
        sender_id: data.senderId,
        receiver_id: userId,
      });
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

const fetchConversations = (sender_id, receiver_id) => {
  apiClient
    .get("/conversation", {
      params: { sender_id, receiver_id },
    })
    .then((response) => {
      messages.value = response.data;
    })
    .catch((error) => {
      console.error("Error fetching conversations:", error);
    });
};

// 查找好友
const findFriend = () => {
  if (!friendId.value) {
    alert("Please enter a friend's name");
    return;
  }

  apiClient
    .get("/findFriend", {
      params: { friendId: friendId.value },
    })
    .then((response) => {
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
        const errorMessage = error.response.data.message;
        if (errorMessage === "You are already friends") {
          alert("You are already friends with this user.");
        } else if (errorMessage === "Friend request already sent") {
          alert("Friend request already sent to this user.");
        } else {
          alert(errorMessage);
        }
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
      requestId: newFriendRequest.id,
      action: action,
    })
    .then(() => {
      if (action === "accepted") {
        alert("Friend request accepted");
        fetchFriends(); // 更新好友列表
      } else {
        alert("Friend request rejected");
      }
      newFriendRequest = null; // 重置新好友请求
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
        newFriendRequest = response.data[0]; // 假设只处理第一个请求
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
      alert(error.response.data.message);
      router.push({ name: "login" });
    });
};
</script>
  
<style scoped lang="less">
.container {
  display: flex;
  height: 100vh;
  background-color: #f9f9f9;

  .sidebar {
    width: 300px;
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }

    .search-friend {
      margin-bottom: 20px;

      input {
        width: calc(100% - 20px);
        padding: 10px;
        margin-top: 5px;
        margin-bottom: 10px;
        border: 1px solid #7f8c8d;
        border-radius: 5px;
        background-color: #34495e;
        color: #ecf0f1;
      }

      button {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 5px;
        background-color: #1abc9c;
        color: #ecf0f1;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background-color: #16a085;
        }
      }
    }

    .friend-result {
      margin-bottom: 20px;

      p {
        margin: 10px 0;
      }

      button {
        padding: 10px;
        border: none;
        border-radius: 5px;
        background-color: #3498db;
        color: #ecf0f1;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background-color: #2980b9;
        }
      }
    }

    .new-request {
      background-color: #f39c12;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
      margin-bottom: 20px;
    }

    .friends-section {
      flex-grow: 1;

      .friends-list {
        border: 1px solid #7f8c8d;
        border-radius: 5px;
        overflow-y: auto;
        flex-grow: 1;
        background-color: #34495e;

        .friend-item {
          padding: 10px;
          border-bottom: 1px solid #7f8c8d;
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background-color: #2c3e50;
          }

          &.selected {
            background-color: #2980b9;
            color: #ecf0f1;
          }
        }
      }
    }

    .logout-button {
      background-color: #e74c3c;
      color: #ecf0f1;
      padding: 10px;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      transition: background-color 0.3s;

      &:hover {
        background-color: #c0392b;
      }
    }
  }

  .main-content {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ecf0f1;
  }
}
</style>
