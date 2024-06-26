<template>
  <div class="container">
    <aside class="sidebar" ref="sidebar">
      <div class="user-info">
        <img :src="avatarUrl" alt="Avatar" class="avatar" @dblclick="showAvatarDialog" />
        <AvatarDialog :avatarUrl="avatarUrl" :userId="userId" v-if="dialogVisible" @close="closeAvatarDialog"
          @changeAvatar="handleChangeAvatar" />
        <div class="right">
          <h1 v-if="!editingName" @dblclick="editName">{{ username }}</h1>
          <input class="edit-name" v-else v-model="username" @blur="saveName" @keyup.enter="saveName"
            ref="editNameRef" />
          <h6 v-if="!editingIntro" @click="editIntro">{{ userintro || '编辑个性签名' }}</h6>
          <input class="edit-intro" v-else v-model="userintro" @blur="saveIntro" @keyup.enter="saveIntro"
            ref="editIntroRef" />
        </div>

      </div>
      <div class="toolbar">
        <span @click="showSection('friends')" :class="{ active: currentSection === 'friends' }">我的好友</span>
        <span @click="showSection('search')" :class="{ active: currentSection === 'search' }">添加好友</span>
        <span @click="showSection('requests')" :class="{ active: currentSection === 'requests' }">新的申请</span>
        <div class="slider" :style="sliderStyle"></div>
      </div>

      <div v-if="currentSection === 'friends'" class="friends-section">
        <div class="friends-list">
          <div v-for="friend in friends" :key="friend.user_id" :class="{
          'friend-item': true,
          selected: friend.user_id === selectedFriendId,
        }" @click="selectFriend(friend.user_id)" @dblclick="startChatWithFriend(friend.user_id)"
            @contextmenu.prevent="openContextMenu($event, friend)">
            <img :src="friend.avatar_url" alt="avatar" class="friend-avatar" />
            <div class="right">
              <div class="friend-name">{{ friend.username }}</div>
              <div class="friend-intro">{{ friend.user_intro }}</div>
            </div>
          </div>
        </div>
        <div v-if="contextMenuVisible" :style="{ top: `${contextMenuY}px`, left: `${contextMenuX}px` }"
          class="context-menu">
          <button @click="showDeleteDialog(selectedFriendId)">删除好友</button>
          <button @click="startChatWithFriend(selectedFriendId)">开始对话</button>
        </div>
      </div>

      <div v-if="currentSection === 'search'" class="search-friend">
        <label for="friendId">输入您想要添加的朋友ID：</label>
        <input type="text" v-model="friendId" required />
        <button @click="findFriend">添加好友</button>
      </div>
      <div v-if="Object.keys(friendResult).length && currentSection === 'search'" class="friend-result">
        <p>找到朋友：{{ friendResult.username }}</p>
        <button @click="
          sendFriendRequest(friendResult.user_id, friendResult.username)
          ">
          发送好友请求
        </button>
      </div>

      <div v-if="currentSection === 'requests'" class="new-request">
        <div v-if="newFriendRequest" class="friendRequest-list">
          <p>你有{{ newFriendRequest.length }}个新的好友请求</p>
          <div class="friendRequest-list-item" v-for="newFriend in newFriendRequest" :key="newFriend.id"
            @click="showFriendRequestDialog(newFriend)">
            {{ newFriend.sender_username }}
          </div>
        </div>
      </div>

      <div v-if="showDialog" class="dialog-overlay">
        <div class="dialog">
          <button class="close-button" @click="showDialog = false">×</button>
          <p>你想要接受来自 {{ newFriend2 }} 的好友请求吗？</p>
          <button @click="handleFriendRequest('accepted')">接受</button>
          <button @click="handleFriendRequest('rejected')">拒绝</button>
        </div>
      </div>

      <div v-if="isShowDeleteDialog" class="dialog-overlay">
        <div class="dialog">
          <button class="close-button" @click="isShowDeleteDialog = false">×</button>
          <p>你确定要删除好友吗？</p>
          <button @click="confirmDelete">确定</button>
          <button @click="isShowDeleteDialog = false">取消</button>
        </div>
      </div>

      <button @click="logout" class="logout-button">登出</button>
    </aside>
    <ChatDialog v-if="showChat" :currentFriend="currentFriend" @close="closeChat" :messages="messages"
      @update:messages="updateMessages" :sender_id="userId" :receiver_id="selectedFriendId" ref="chatDialog" />
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import ChatDialog from "./ChatDialog.vue";
import AvatarDialog from './AvatarDialog.vue';
import apiClient from "@/aplClient";
import { useDraggable } from '../util.js';

const router = useRouter();
const route = useRoute();
const userId = route.query.userId;
const username = ref(route.query.username);
const defaultAvatarUrl = require('../assets/qq.png');
const avatarUrl = ref(defaultAvatarUrl.value);
const token = localStorage.getItem(`${userId}-token`);
const newFriendRequest = ref([]);
const friendId = ref("");
const friendResult = ref({});
const friends = ref([]);
const selectedFriendId = ref(null);
const showChat = ref(false);
const currentFriend = ref(null);
const showDialog = ref(false);
const messages = ref([]);
const contextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const chatDialog = ref(null);
const dialogVisible = ref(false);
const editingName = ref(false);
const editNameRef = ref(null);
const currentSection = ref('friends');
const sliderStyle = ref({ left: '0%', width: '0%' });
const newFriend2 = ref('');
const sidebar = ref(null);
const requestId = ref(null);
const isShowDeleteDialog = ref(false);
const deletedFriend = ref(null);
const userintro = ref('');
const editingIntro = ref(false);
const editIntroRef = ref(null);

const ws = new WebSocket("ws://localhost:3000");
useDraggable(sidebar, sidebar);

onMounted(() => {
  getUserInfo();
  showSection(currentSection.value);
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
      startChatWithFriend(data.sender_id)
      console.log(currentFriend.value);
      nextTick(() => {
        chatDialog.value.shakeFriendWindow();
      });
    }
  };
});

onUnmounted(() => {
  ws.close();
});

// 获取用户信息
const getUserInfo = () => {
  apiClient.get(`/user/${userId}`)
    .then(response => {
      ({ username: username.value, avatar_url: avatarUrl.value, user_intro: userintro.value } = response.data);
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
    });
};

const showSection = (section) => {
  currentSection.value = section;

  // 获取当前点击的 span 元素
  nextTick(() => {
    const activeSpan = document.querySelector('.toolbar .active');
    if (activeSpan) {
      const { offsetLeft, offsetWidth } = activeSpan;
      sliderStyle.value = {
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      };
    }
  });
};

const handleChangeAvatar = (newAvatarUrl) => {
  avatarUrl.value = newAvatarUrl;
};

const openContextMenu = (event, friend) => {
  selectedFriendId.value = friend.user_id;
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  contextMenuVisible.value = true;

  document.addEventListener('click', closeContextMenu);
};

const closeContextMenu = () => {
  contextMenuVisible.value = false;
  document.removeEventListener('click', closeContextMenu);
};

const showDeleteDialog = (friendId) => {
  isShowDeleteDialog.value = true;
  deletedFriend.value = friendId;
};

const confirmDelete = () => {
  apiClient.delete(`/friends/${deletedFriend.value}`, {
    data: {
      userId,
    },
  })
    .then(response => {
      // 删除成功后更新 friends 列表
      friends.value = friends.value.filter(friend => friend.user_id !== friendId);
      console.log('Friend deleted successfully:', response.data);
      // 关闭右键菜单
      closeContextMenu();
      isShowDeleteDialog.value = false;
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
  selectedFriendId.value = friendId;
  currentFriend.value = friends.value.find(
    (friend) => friend.user_id == selectedFriendId.value
  );
  console.log(currentFriend.value);
  fetchConversations(userId, selectedFriendId.value);
};

const showFriendRequestDialog = (newFriend) => {
  showDialog.value = true;
  newFriend2.value = newFriend.sender_username;
  requestId.value = newFriend.id;
};

const startChat = () => {
  if (selectedFriendId.value) {
    currentFriend.value = friends.value.find(
      (friend) => friend.user_id == selectedFriendId.value
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
  friendResult.value = {};
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
    (friend) => friend.user_id === receiverId
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
      requestId: requestId.value,
      action: action,
    })
    .then(() => {
      if (action === "accepted") {
        fetchFriends(); // 更新好友列表
      } else {
        newFriendRequest.value = newFriendRequest.value.filter(
          (request) => request.id != requestId.value
        );
      }
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
        newFriendRequest.value = response.data; // 假设只处理第一个请求
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

const showAvatarDialog = () => {
  dialogVisible.value = true;
};

const closeAvatarDialog = () => {
  dialogVisible.value = false;
};

const editIntro = () => {
  editingIntro.value = true;
  nextTick(() => {
    editIntroRef.value.focus();
  });
};

const saveIntro = () => {
  editingIntro.value = false;
  if (!userintro.value || !userintro.value.trim()) {
    userintro.value = '';
  }
  if (userintro.value.length > 20) {
    alert('个性签名不能超过20个字符');
    userintro.value = userintro.value.slice(0, 20);
    return;
  }
  apiClient.put('/update-intro', { user_id: userId, user_intro: userintro.value })
    .then(response => {
      if (response.data.success) {
        console.log('User intro updated successfully');
      } else {
        console.error('Failed to update user intro');
      }
    })
    .catch(error => {
      console.error('Error updating user intro:', error);
    });
};

const editName = () => {
  editingName.value = true;
  nextTick(() => {
    editNameRef.value.focus();
  });
};

const saveName = () => {
  editingName.value = false;
  if (!username.value || !username.value.trim()) {
    username.value = route.query.username;
    return;
  }
  if (username.value.length > 10) {
    alert('Username cannot exceed 10 characters');
    username.value = route.query.username;
    return;
  }
  apiClient.put('/update-username', { user_id: userId, username: username.value })
    .then(response => {
      if (response.data.success) {
        console.log('Username updated successfully');
      } else {
        console.error('Failed to update username');
      }
    })
    .catch(error => {
      console.error('Error updating username:', error);
    });
};

</script>

<style scoped lang="less">
.container {
  display: flex;
  height: 100vh;
  background-color: #f9f9f9;
  position: relative;

  .sidebar {
    width: 300px;
    height: 700px;
    background-color: #34495e;
    color: #ecf0f1;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
    align-items: center;

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
        max-width: 400px;
        width: 100%;
        animation: fadeIn 0.5s ease;
        color: black;
        position: relative;

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

        .close-button {
          position: absolute;
          top: 5px;
          right: 0px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #000;

          &:hover {
            background: #979797;
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
      width: calc(100% - 40px);
      height: 60px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 20px;
      cursor: default;
      padding: 0 20px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
        cursor: pointer;
      }

      .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        width: 100%;

        h1 {
          font-size: 20px;
          margin: 0;
          cursor: pointer;
          user-select: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 210px;
        }

        .edit-name {
          font-size: 1em;
          padding: 5px;
          margin: 5px 0;
          border: 2px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: border-color 0.3s, box-shadow 0.3s;
          outline: none;
        }

        .edit-name:focus {
          border-color: #4A90E2;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        h6 {
          font-size: 14px;
          margin: 0;
          cursor: default;
          user-select: none;
          width: 180px;
          height: 20px;
          border: 1px solid transparent;
          font-weight: 300;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          &:hover {
            border: 1px solid #ccc;
            border-radius: 4px;
          }
        }


      }



    }

    .toolbar {
      width: 100%;
      height: 40px;
      display: flex;
      background-color: #2c3e50; // 增加背景颜色
      border-radius: 5px; // 增加圆角
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // 增加阴影效果
      position: relative;

      span {
        flex: 1;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        font-size: 16px;
        color: #ffffff;
        transition: color 0.3s; // 增加颜色过渡效果

        &:hover {
          color: #1e90ff; // 增加悬停效果
        }
      }

      .slider {
        position: absolute;
        bottom: 0;
        height: 2px;
        width: 33.33%;
        background-color: #1e90ff;
        transition: left 0.3s ease, width 0.3s ease;
        left: -14px;
      }
    }

    .search-friend {
      margin-bottom: 20px;
      flex-grow: 1;
      width: 90%;

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
      width: 90%;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
      margin-bottom: 20px;
      flex-grow: 1;

      .friendRequest-list {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 10px;
        margin-top: 10px;
        cursor: pointer;

        p {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }

        .friendRequest-list-item {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 3px;
          padding: 8px;
          margin-bottom: 5px;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: #e6e6e6;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .friends-section {
      padding: 0 10px;
      flex-grow: 1;
      width: 90%;
      user-select: none;

      .friends-list {
        border: 1px solid #7f8c8d;
        border-radius: 5px;
        overflow-y: auto;
        flex-grow: 1;
        background-color: #34495e;
        margin-top: 10px;

        .friend-item {
          display: flex;
          align-items: center;
          padding: 0 10px;
          border-bottom: 1px solid #7f8c8d;
          cursor: pointer;
          transition: background-color 0.3s;
          height: 60px;

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

          .right {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            width: 210px;
            overflow: hidden;
            text-overflow: ellipsis;
            .friend-name {
              font-size: 16px;
              color: #ecf0f1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: inline-block;
              width: 100%;
            }

            .friend-intro {
              font-size: 14px;
              color: #bdc3c7;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 100%;
            }
          }


        }
      }

      .context-menu {
        position: fixed;
        background-color: white;
        border: 1px solid #ccc;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        width: 90px;

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
      width: 80%;
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