<template>
  <div class="reset-password-container">
    <h2>找回密码</h2>
    <form @submit.prevent="submitResetPassword">
      <div class="form-group">
        <label for="email">邮箱:</label>
        <input
          type="email"
          v-model="email"
          placeholder="请输入您的邮箱"
          required
        />
      </div>
      <button
        type="button"
        @click="sendVerificationCode"
        class="send-code-button"
        :disabled="isSendingCode"
      >
        {{ buttonText }}
      </button>
      <div class="form-group">
        <label for="verificationC ode">验证码:</label>
        <input
          type="text"
          v-model="verificationCode"
          placeholder="请输入验证码"
          required
        />
      </div>
      <div class="form-group">
        <label for="newPassword">新密码:</label>
        <input
          type="password"
          v-model="newPassword"
          placeholder="请输入新密码"
          required
        />
      </div>
      <button type="submit" class="reset-button">重置密码</button>
    </form>
  </div>
</template>
  
  <script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const verificationCode = ref("");
const newPassword = ref("");
const isSendingCode = ref(false);
const buttonText = ref("发送验证码");

const sendVerificationCode = () => {
  if (isSendingCode.value) return;

  isSendingCode.value = true;
  axios
    .post("http://localhost:3000/send-code", { email: email.value })
    .then((response) => {
      alert("验证码已发送");
      startCountdown();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("验证码发送失败: " + (error.response?.data?.message || "发生错误"));
      isSendingCode.value = false;
    });
};

const startCountdown = () => {
  let countdown = 60;
  buttonText.value = `${countdown}秒后重试`;

  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      buttonText.value = `${countdown}秒后重试`;
    } else {
      buttonText.value = "发送验证码";
      isSendingCode.value = false;
      clearInterval(interval);
    }
  }, 1000);
};

const submitResetPassword = () => {
  axios
    .post("http://localhost:3000/reset-password", {
      email: email.value,
      verificationCode: verificationCode.value,
      newPassword: newPassword.value,
    })
    .then((response) => {
      alert("密码重置成功");
      router.push({ name: 'login' });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("密码重置失败: " + (error.response?.data?.message || "发生错误"));
    });
};
</script>
  
  <style scoped>
.reset-password-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.send-code-button,
.reset-button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #007bff;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.send-code-button:disabled {
  background-color: #ccc;
}

.send-code-button:hover:enabled,
.reset-button:hover {
  background-color: #0056b3;
}
</style>
  