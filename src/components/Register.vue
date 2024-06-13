<template>
  <div class="register-container">
    <div class="register-header">
      <div class="icon">Register</div>
    </div>
    <div class="register-form">
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username" class="hidden-label">Username:</label>
          <input type="text" v-model="username" placeholder="用户名" required />
          <span class="validation-message" v-if="!usernameValid">
            {{ usernameMessage }}
          </span>
        </div>

        <div class="form-group">
          <label for="password" class="hidden-label">Password:</label>
          <input
            type="password"
            v-model="password"
            placeholder="密码"
            required
          />
          <span class="validation-message" v-if="!passwordValid">
            {{ passwordMessage }}
          </span>
        </div>

        <div class="form-group email-group">
          <label for="email" class="hidden-label">Email:</label>
          <div class="input-with-button">
            <input type="email" v-model="email" placeholder="邮箱" required />
            <button
              type="button"
              @click="sendVerificationCode"
              class="send-code-button"
              :disabled="isSendingCode"
            >
              {{ buttonText }}
            </button>
          </div>
          <span class="validation-message" v-if="!emailValid">
            {{ emailMessage }}
          </span>
        </div>

        <div class="form-group">
          <label for="verificationCode" class="hidden-label"
            >Verification Code:</label
          >
          <input
            type="text"
            v-model="verificationCode"
            placeholder="验证码"
            required
          />
        </div>

        <button type="submit" class="register-button">注册</button>
      </form>
      <button @click="navigateToHome" class="back-button">返回首页</button>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");
const email = ref("");
const verificationCode = ref("");
const buttonText = ref("发送验证码");
const isSendingCode = ref(false);

const usernameValid = computed(() => username.value.trim() !== "");
const passwordHasUpperCase = computed(() => /[A-Z]/.test(password.value));
const passwordHasLowerCase = computed(() => /[a-z]/.test(password.value));
const passwordHasNumber = computed(() => /\d/.test(password.value));
const passwordHasSpecialChar = computed(() => /[\W_]/.test(password.value));
const passwordLengthValid = computed(() => password.value.length >= 6);
const passwordValid = computed(
  () =>
    passwordHasUpperCase.value &&
    passwordHasLowerCase.value &&
    passwordHasNumber.value &&
    passwordHasSpecialChar.value &&
    passwordLengthValid.value
);

const emailValid = computed(() => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.value);
});

const usernameMessage = computed(() => {
  return usernameValid.value ? "" : "用户名不能为空";
});

const passwordMessage = computed(() => {
  if (!passwordLengthValid.value) return "密码长度不能少于6位";
  if (!passwordHasUpperCase.value) return "密码必须包含大写字母";
  if (!passwordHasLowerCase.value) return "密码必须包含小写字母";
  if (!passwordHasNumber.value) return "密码必须包含数字";
  if (!passwordHasSpecialChar.value) return "密码必须包含特殊字符";
  return "";
});

const emailMessage = computed(() => {
  return emailValid.value ? "✔" : "请输入有效的邮箱地址";
});

const register = () => {
  if (!usernameValid.value || !passwordValid.value || !emailValid.value) {
    alert("请确保所有字段都正确填写");
    return;
  }

  axios
    .post("http://localhost:3000/register", {
      username: username.value,
      password: password.value,
      email: email.value,
      verificationCode: verificationCode.value,
    })
    .then((response) => {
      alert(`注册成功,请记住您的id:${response.data.userId}并返回登录`);
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("注册失败: " + (error.response?.data?.message || "发生错误"));
    });
};

const sendVerificationCode = () => {
  if (isSendingCode.value) return;
  axios
    .post("http://localhost:3000/send-code", {
      email: email.value,
    })
    .then((response) => {
      // 根据需要处理响应，例如显示提示信息
      console.log("Verification code sent:", response.data);
      startCountdown();
    })
    .catch((error) => {
      console.error("Error sending verification code:", error);
      // 处理错误，例如显示错误提示
    });
};

const startCountdown = () => {
  let countdown = 60;
  isSendingCode.value = true;
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

const navigateToHome = () => {
  router.push({ name: "login" });
};
</script>

<style lang="less" scoped>
.register-container {
  width: 300px;
  margin: 100px auto;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  input {
    width: calc(100% - 30px);
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .register-header {
    position: relative;
    height: 100px;
    background: linear-gradient(135deg, #6a5acd, #7b68ee, #6a5acd, #7b68ee);
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
  }

  .register-form {
    background: #fff;
    padding: 20px;
    text-align: center;

    .form-group {
      position: relative;
      margin-bottom: 20px;
    }

    .email-group {
      display: flex;
      align-items: center;
    }

    .input-with-button {
      display: flex;
      align-items: center;
    }

    .input-with-button input {
      flex: 1;
    }

    .send-code-button {
      margin-left: 10px;
    }

    .validation-message {
      color: red;
      font-size: 12px;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      text-align: left;
      padding: 0 10px;
      box-sizing: border-box;
    }

    .register-button,
    .back-button {
      width: calc(100% - 20px);
      padding: 10px;
      margin-top: 10px;
      border: none;
      border-radius: 5px;
      color: #fff;
      cursor: pointer;
    }

    .register-button {
      background-color: #28a745;
    }

    .back-button {
      background-color: #007bff;
    }
  }
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}
</style>