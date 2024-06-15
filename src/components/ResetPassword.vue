<template>
  <div class="reset-password-container">
    <button class="back-button" @click="goToLogin">返回</button>
    <h2>找回密码</h2>
    <form @submit.prevent="submitResetPassword">
      <div class="form-group">
        <label for="email">邮箱:</label>
        <input type="email" v-model="email" placeholder="请输入您的邮箱" required />
      </div>
      <button type="button" @click="sendVerificationCode" class="send-code-button" :disabled="isSendingCode">
        {{ buttonText }}
      </button>
      <div class="form-group">
        <label for="verificationCode">验证码:</label>
        <input type="text" v-model="verificationCode" placeholder="请输入验证码" required />
      </div>
      <div class="form-group">
        <label for="userId">账号:</label>
        <input type="text" v-model="userId" placeholder="请输入您的账号" required />
      </div>
      <div class="form-group">
        <label for="newPassword">新密码:</label>
        <input type="password" v-model="newPassword" placeholder="请输入新密码" required />
        <span class="validation-message" v-if="passwordMessage">
          {{ passwordMessage }}
        </span>
      </div>
      <button type="submit" class="reset-button">重置密码</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const verificationCode = ref("");
const userId = ref("");
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
  if (!passwordValid.value) {
    alert(passwordMessage.value);
    return;
  }

  axios
    .post("http://localhost:3000/reset-password", {
      email: email.value,
      verificationCode: verificationCode.value,
      userId: userId.value,
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

const goToLogin = () => {
  router.push({ name: 'login' });
};

// Password validation
const passwordHasUpperCase = computed(() => /[A-Z]/.test(newPassword.value));
const passwordHasLowerCase = computed(() => /[a-z]/.test(newPassword.value));
const passwordHasNumber = computed(() => /\d/.test(newPassword.value));
const passwordHasSpecialChar = computed(() => /[\W_]/.test(newPassword.value));
const passwordLengthValid = computed(() => newPassword.value.length >= 6);

const passwordValid = computed(
  () =>
    passwordHasUpperCase.value &&
    passwordHasLowerCase.value &&
    passwordHasNumber.value &&
    passwordHasSpecialChar.value &&
    passwordLengthValid.value
);

const passwordMessage = computed(() => {
  if (!passwordLengthValid.value) return "密码长度不能少于6位";
  if (!passwordHasUpperCase.value) return "密码必须包含大写字母";
  if (!passwordHasLowerCase.value) return "密码必须包含小写字母";
  if (!passwordHasNumber.value) return "密码必须包含数字";
  if (!passwordHasSpecialChar.value) return "密码必须包含特殊字符";
  return "";
});
</script>

<style scoped lang="less">
.reset-password-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  position: relative;

  .back-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #007bff;
    border: none;
    color: white;
    padding: 10px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  }
}

.form-group {
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
}

.validation-message {
  color: red;
  font-size: 0.875em;
  margin-top: 5px;
}

.send-code-button,
.reset-button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #007bff;
  border: none;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover:enabled {
    cursor: pointer;
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
  }
}
</style>
