<template>
  <div class="login-container">
    <div class="login-header">
      <div class="icon">QQ</div>
    </div>
    <div class="login-form">
      <form @submit.prevent="login">
        <div class="user-image-wrapper">
          <img class="user-image" :src="avatarUrl" />
        </div>
        <label for="userId" class="hidden-label">userId:</label>
        <input type="text" v-model="userId" placeholder="QQ号码" required />
        <label for="password" class="hidden-label">Password:</label>
        <input type="password" v-model="password" placeholder="密码" required />
        <div class="options">
          <input type="checkbox" id="auto-login" v-model="autoLogin" />
          <label for="auto-login">自动登录</label>
          <input type="checkbox" id="remember-password" v-model="rememberPassword" />
          <label for="remember-password">记住密码</label>
          <a href="#" class="forgot-password" @click="resetPassword">找回密码</a>
        </div>
        <button type="submit" class="login-button">登录</button>
        <button type="button" @click="navigateToRegister" class="register-button">
          注册账号
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiClient from '@/aplClient'

const username = ref("");
const userId = ref("");
const password = ref("");
const defaultAvatarUrl = ref("http://127.0.0.1:9000/image/qq.png")
const avatarUrl = ref("http://127.0.0.1:9000/image/qq.png");
const rememberPassword = ref(false);
const userIp = ref("");
const router = useRouter();

// 获取用户IP地址
onMounted(() => {
  axios.get('https://icanhazip.com')
    .then((response) => {
      userIp.value = response.data.trim();
    })
    .catch((error) => {
      console.error('Error fetching IP:', error);
    });
});

const login = () => {
  apiClient
    .post('/login', {
      userId: userId.value,
      password: password.value,
      rememberPassword: rememberPassword.value,
      userIp: userIp.value,
    })
    .then((response) => {
      const data = response.data;
      if (data.token) {
        username.value = data.username;
        localStorage.setItem(`${userId.value}-token`, data.token);
        alert('Login successful');
        router.push({
          name: 'home',
          query: { userId: userId.value },
        });
      } else {
        alert('Login failed: ' + (data.message || 'Invalid credentials'));
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(
        'Login failed: ' +
        (error.response.data.message || 'Invalid credentials')
      );
    });
};

const navigateToRegister = () => {
  router.push({ name: "register" });
};

const resetPassword = () => {
  router.push({ name: "reset-password" });
};

watch(userId, (newUserId) => {
  if (newUserId.length === 6) {
    apiClient
      .get(`/avatar/${newUserId}`)
      .then((response) => {
        if (response.data && response.data.avatarUrl) {
          avatarUrl.value = response.data.avatarUrl;
          if (response.data.rememberPassword && userIp.value === response.data.userIp) {
            password.value = response.data.password;
            rememberPassword.value = !!response.data.rememberPassword;
          }
        } else {
          avatarUrl.value = defaultAvatarUrl.value;
          rememberPassword.value = false;
          password.value = '';
        }
      })
      .catch((error) => {
        console.error('Error fetching avatar:', error);
        avatarUrl.value = defaultAvatarUrl.value;
      });
  } else {
    avatarUrl.value = defaultAvatarUrl.value;
    password.value = '';
    rememberPassword.value = false;
  }
});

</script>

<style lang="less" scoped>
.login-container {
  width: 300px;
  margin: 100px auto;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .login-header {
    position: relative;
    height: 100px;
    background: linear-gradient(135deg, #8072da, #0571ff, #6a5acd, #68e5ee);
    background-size: 400% 400%;
    animation: gradientAnimation 10s ease infinite;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    border-bottom-left-radius: 50% 20%;
    border-bottom-right-radius: 50% 20%;

    .icon {
      font-size: 24px;
      font-weight: bold;
    }
  }

  .login-form {
    background: #fff;
    padding: 20px;
    text-align: center;

    .user-image-wrapper {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin: 0 auto 20px;
      overflow: hidden;
      border: 2px solid #ccc;

      .user-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    input[type="text"],
    input[type="password"] {
      width: calc(100% - 20px);
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    .options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #666;

      input[type="checkbox"] {
        margin-right: 5px;
      }

      .forgot-password {
        color: #007bff;
        text-decoration: none;
      }
    }

    .login-button,
    .register-button {
      width: calc(100% - 20px);
      padding: 10px;
      margin-top: 10px;
      border: none;
      border-radius: 5px;
      color: #fff;
      background-color: #007bff;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .register-button {
      background-color: #28a745;
    }
  }

  .login-button:hover {
    background-color: #0056b3;
  }

  .register-button:hover {
    background-color: #218838;
  }
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>