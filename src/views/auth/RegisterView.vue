<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

const register = () => {
  // Replace with your actual registration logic
  if (firstName.value && lastName.value && email.value && password.value) {
    localStorage.setItem('user', JSON.stringify({ email: email.value }));
    router.push({ name: 'home' });
  }
};

const goToLogin = () => {
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full w-full bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Inscription</h2>
        <form @submit.prevent="register">
          <div class="form-control">
            <label for="firstName" class="label">
              <span class="label-text">Prénom :</span>
            </label>
            <input type="text" id="firstName" v-model="firstName" class="input input-bordered" required />
          </div>
          <div class="form-control">
            <label for="lastName" class="label">
              <span class="label-text">Nom :</span>
            </label>
            <input type="text" id="lastName" v-model="lastName" class="input input-bordered" required />
          </div>
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
            <button type="submit" class="btn btn-primary">Inscription</button>
          </div>
        </form>
        <div class="form-control mt-2">
          <button @click="goToLogin" class="btn btn-secondary">Aller à la connexion</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
