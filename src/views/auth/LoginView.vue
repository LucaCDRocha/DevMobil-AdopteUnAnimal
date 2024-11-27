<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  const user = { email: email.value, password: password.value };
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("token", data.token);
    router.push({ name: 'home' });
  } else {
    console.error("Error logging in");
  }
};

const goToRegister = () => {
  router.push({ name: 'register' });
};
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full w-full bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Connexion</h2>
        <form @submit.prevent="login">
          <div class="form-control">
            <label for="email" class="label">
              <span class="label-text">Email :</span>
            </label>
            <input type="email" id="email" v-model="email" class="input input-bordered" required />
          </div>
          <div class="form-control">
            <label for="password" class="label">
              <span class="label-text">Mot de passe :</span>
            </label>
            <input type="password" id="password" v-model="password" class="input input-bordered" required />
          </div>
          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary">Connexion</button>
          </div>
        </form>
        <div class="form-control mt-2">
          <button @click="goToRegister" class="btn btn-secondary">Aller à l'inscription</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
