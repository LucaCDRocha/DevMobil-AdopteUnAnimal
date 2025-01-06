<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";

const id = ref(null);
const route = useRoute();

id.value = route.params.id;

// console.log(id.value);

</script>
<template></template>
