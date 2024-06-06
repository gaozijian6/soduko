<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <label for="username">Username:</label>
      <input type="text" v-model="username" required />
      <label for="password">Password:</label>
      <input type="password" v-model="password" required />
      <button type="submit">Register</button>
    </form>
    <button @click="navigateToHome">Back to Home</button>
  </div>
</template>
  
  <script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const router = useRouter();

const register = () => {
  axios
    .get("http://localhost:3000/register", {
      params: {
        username: username.value,
        password: password.value,
      },
    })
    .then((response) => {
      alert("Registration successful");
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(
        "Registration failed: " +
          (error.response?.data?.message || "Error occurred")
      );
    });
};

const navigateToHome = () => {
  router.push({ name: "login" });
};
</script>
  