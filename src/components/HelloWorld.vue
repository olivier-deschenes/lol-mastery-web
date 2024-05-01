<script setup lang="ts">
import SignIn from "./auth/SignIn.vue";
import MasteryList from "./mastery/MasteryList.vue";
import ky from "ky";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { User } from "../types/auth";

const loginIn = () => {
  console.log("loginIn");

  const response = ky.get("/api/auth/refresh", {
    retry: 0,
  });
  return response.json() as Promise<User>;
};

const logout = async () => {
  ky.get("/api/auth/sign-out");
};

const { data, isPending } = useQuery({
  queryFn: loginIn,
  queryKey: ["user"],
  retry: 0,
});

const queryClient = useQueryClient();

const { mutate } = useMutation({
  mutationFn: logout,
  onSuccess: () => {
    queryClient.resetQueries({ queryKey: ["user"] });
  },
});

const handleLogout = () => {
  mutate();
};
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <div>
        <h3 v-if="isPending">Loading User ...</h3>
        <h3 v-else-if="data">Welcome back, {{ data.user_metadata.email }}</h3>
      </div>
      <div>
        <button @click="handleLogout" class="bg-red-100 p-1.5">Logout</button>
      </div>
    </div>
    <SignIn v-if="!data && !isPending" />
    <MasteryList v-if="data && !isPending" />
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
