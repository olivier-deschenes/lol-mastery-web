<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";
import { apiClient } from "../../main";

const email = ref("olivierdeschenes9@gmail.com");
const password = ref("lol12345@");

type LoginParams = {
  email: string;
  password: string;
};

const loginIn = ({ email, password }: LoginParams) => {
  const response = apiClient.post("auth/sign-in", {
    json: {
      email,
      password,
    },
  });

  return response.json() as Promise<{ id: string }>;
};

const queryClient = useQueryClient();

const { mutate } = useMutation({
  mutationFn: (params: LoginParams) => loginIn(params),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  },
});

const handleSubmit = () => {
  mutate({ email: email.value, password: password.value });
};
</script>

<template>
  <div class="bg-orange-300 p-5">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit">
      <label for="" class="flex flex-col border p-2.5">
        Email
        <input type="text" v-model="email" />
      </label>
      <label for="" class="flex flex-col border p-2.5">
        Password
        <input type="password" v-model="password" />
      </label>
      <button type="submit">Login</button>
    </form>
  </div>
</template>
