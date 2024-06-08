<template>
  <div>
    <h1>JWT Auth Example</h1>
    <form @submit.prevent="login">
      <label for="username">Username:</label>
      <input type="text" v-model="username" required />
      <label for="password">Password:</label>
      <input type="password" v-model="password" required />
      <button type="submit">Login</button>
      <button type="button" @click="navigateToRegister">Register</button>
    </form>
  </div>
</template>
  
  <script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const router = useRouter();

const login = () => {
  axios
    .post("http://localhost:3000/login", {
      username: username.value,
      password: password.value,
    })
    .then((response) => {
      const data = response.data;
      if (data.token) {
        const userId = data.userId;
        localStorage.setItem(`${userId}-token`, data.token);
        alert("Login successful");
        router.push({ name: "home", query: { userId, username: username.value } });
      } else {
        alert("Login failed: " + (data.message || "Invalid credentials"));
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(
        "Login failed: " +
          (error.response.data.message || "Invalid credentials")
      );
    });
};

const navigateToRegister = () => {
  router.push({ name: "register" });
};

</script>
  