<template>
  <div class="container">
    <aside class="sidebar">
      <div class="user-info">
        <img :src="avatarUrl" alt="Avatar" class="avatar" />
        <h1>{{ username }}</h1>
      </div>
      <div class="search-friend">
        <label for="friendId">Enter Friend's ID:</label>
        <input type="text" v-model="friendId" required />
        <button @click="findFriend">Find Friend</button>
      </div>
      <div v-if="friendResult" class="friend-result">
        <p>Friend found: {{ friendResult.username }}</p>
        <button @click="
          sendFriendRequest(friendResult.user_id, friendResult.username)
          ">
          Send Friend Request
        </button>
      </div>
      <div v-if="newFriendRequest" @click="showFriendRequestDialog" class="new-request">
        <p>You have a new friend request from {{ newFriendRequest.sender_username }}</p>
      </div>
      <div v-if="showDialog" class="dialog-overlay">
        <div class="dialog">
          <p>Do you want to accept the friend request from {{ newFriendRequest.sender_username }}?</p>
          <button @click="handleFriendRequest('accepted')">Accept</button>
          <button @click="handleFriendRequest('rejected')">Reject</button>
        </div>
      </div>
      <div class="friends-section">
        <h2>Your Friends</h2>
        <div class="friends-list">
          <div v-for="friend in friends" :key="friend.id" :class="{
          'friend-item': true,
          selected: friend.id === selectedFriend,
        }" @click="selectFriend(friend.id)" @dblclick="startChatWithFriend(friend.id)"
            @contextmenu.prevent="openContextMenu($event, friend)">
            <img :src="friend.avatar_url" alt="avatar" class="friend-avatar" />
            {{ friend.username }}
          </div>
        </div>
        <div v-if="contextMenuVisible" :style="{ top: `${contextMenuY}px`, left: `${contextMenuX}px` }"
          class="context-menu">
          <button @click="confirmDeleteFriend(selectedFriend)">删除好友</button>
          <button @click="startChatWithFriend(selectedFriend)">开始对话</button>
        </div>
      </div>
      <button @click="logout" class="logout-button">Logout</button>
    </aside>
    <main class="main-content">
      <ChatDialog :show="showChat" :currentFriend="currentFriend" @close="closeChat" :messages="messages"
        @update:messages="updateMessages" :sender_id="userId" :receiver_id="selectedFriend" ref="chatDialog"/>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ChatDialog from "./ChatDialog.vue";
import apiClient from "@/aplClient";

const router = useRouter();
const route = useRoute();
const userId = route.query.userId;
const username = ref(route.query.username);
const defaultAvatarUrl = require('../assets/qq.png');
const avatarUrl = ref(defaultAvatarUrl.value);
const token = localStorage.getItem(`${userId}-token`);
const newFriendRequest = ref(null);
const friendId = ref("");
const friendResult = ref(null);
const friends = ref([]);
const selectedFriend = ref(null);
const showChat = ref(false);
const currentFriend = ref(null);
const showDialog = ref(false);
const messages = ref([]);
const contextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const chatDialog = ref(null);

const ws = new WebSocket("ws://localhost:3000");

onMounted(() => {
  const queryAvatarUrl = route.query.avatarUrl;
  if (queryAvatarUrl) {
    avatarUrl.value = queryAvatarUrl;
  }

  accessProtectedRoute();
  fetchFriends();
  checkForFriendRequests(); // 查询新好友请求

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "identify", userId })); // 发送用户标识信息
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    messages.value.push(data);
    if (data.type === "shake") {
      if (chatDialog.value) {
        console.log(data.sender_id);
        startChatWithFriend(data.sender_id)
        setTimeout(() => {
          chatDialog.value.shakeFriendWindow();
        }, 0);
      }
    }
  };
});

onUnmounted(() => {
  ws.close();
});

const openContextMenu = (event, friend) => {
  selectedFriend.value = friend.id;
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  contextMenuVisible.value = true;

  document.addEventListener('click', closeContextMenu);
};

const closeContextMenu = () => {
  contextMenuVisible.value = false;
  document.removeEventListener('click', closeContextMenu);
};

const confirmDeleteFriend = (friendId) => {
  const confirmed = confirm("确定要删除这个好友吗？");
  if (confirmed) {
    deleteFriend(friendId);
  }
};

const deleteFriend = (friendId) => {
  apiClient.delete(`/friends/${friendId}`, {
    data: {
      userId,
    },
  })
    .then(response => {
      // 删除成功后更新 friends 列表
      friends.value = friends.value.filter(friend => friend.id !== friendId);
      console.log('Friend deleted successfully:', response.data);
      // 关闭右键菜单
      closeContextMenu();
    })
    .catch(error => {
      // 错误处理
      console.error('Error deleting friend:', error.response ? error.response.data : error.message);
    });
};

const updateMessages = (newMessage) => {
  messages.value.push(newMessage);
  ws.send(
    JSON.stringify(newMessage)
  );
};

const startChatWithFriend = (friendId) => {
  selectFriend(friendId);
  startChat();
};

const selectFriend = (friendId) => {
  selectedFriend.value = friendId;
  currentFriend.value = friends.value.find(
    (friend) => friend.id == selectedFriend.value
  );
  fetchConversations(userId, selectedFriend.value);
};

const showFriendRequestDialog = () => {
  showDialog.value = true;
};

const startChat = () => {
  console.log(selectedFriend.value);
  if (selectedFriend.value) {
    currentFriend.value = friends.value.find(
      (friend) => friend.id == selectedFriend.value
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

// 设置请求头token
apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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
      requestId: newFriendRequest.value.id,
      action: action,
    })
    .then(() => {
      if (action === "accepted") {
        fetchFriends(); // 更新好友列表
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

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;

      .dialog {
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
        max-width: 300px;
        width: 100%;
        animation: fadeIn 0.5s ease;
        color: black;

        p {
          font-size: 16px;
          margin-bottom: 20px;
        }

        button {
          background: #007bff;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin: 0 10px;
          transition: background 0.3s ease;

          &:hover {
            background: #0056b3;
          }

          &:last-child {
            background: #dc3545;

            &:hover {
              background: #c82333;
            }
          }
        }
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }

      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      cursor: default;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
        cursor: pointer;
      }

      h1 {
        font-size: 20px;
        margin: 0;
      }
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
          display: flex;
          align-items: center;
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

          .friend-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
          }
        }
      }

      .context-menu {
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;

        button {
          display: block;
          width: 100%;
          padding: 8px 16px;
          border: none;
          background: none;
          cursor: pointer;

          &:hover {
            background-color: #f0f0f0;
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
