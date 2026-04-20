<template>
  <div>
    <div class="auth-section">
      <button v-if="!beverageStore.user" @click="withGoogle">
        Sign in with Google
      </button>

      <div v-else>
        <p>
          Signed in as:
          {{ beverageStore.user.displayName || beverageStore.user.email }}
        </p>
        <button @click="logout">Sign out</button>
      </div>
      <p v-if="beverageStore.message">{{ beverageStore.message }}</p>
    </div>
    <Beverage
      v-if="
        beverageStore.currentBase &&
        beverageStore.currentCreamer &&
        beverageStore.currentSyrup
      "
      :isIced="beverageStore.currentTemp === 'Cold'"
      :base="beverageStore.currentBase"
      :creamer="beverageStore.currentCreamer"
      :syrup="beverageStore.currentSyrup"
    />
    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :id="`r${b.id}`"
              :value="b"
              v-model="beverageStore.currentBase"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :id="`r${s.id}`"
              :value="s"
              v-model="beverageStore.currentSyrup"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :id="`r${c.id}`"
              :value="c"
              v-model="beverageStore.currentCreamer"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>
    <input
      type="text"
      placeholder="Beverage Name"
      v-model="beverageStore.currentName"
    />
    <button :disabled="!beverageStore.user"
    @click="beverageStore.makeBeverage()"
    >🍺 Make Beverage</button>

    <div v-if="beverageStore.user && beverageStore.beverages.length > 0">
      <p>Saved Beverages</p>
      <ul>
        <li v-for="bev in beverageStore.beverages" :key="bev.id">
          <label>
            <input
              type="radio"
              name="savedBeverages"
              :value="bev.id"
              :checked="beverageStore.currentBeverage?.id === bev.id"
              @change="beverageStore.showBeverage(bev)"
            />
            {{ bev.name }}
          </label>
        </li>
      </ul>
    </div>
  </div>
  <div id="beverage-container" style="margin-top: 20px"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const withGoogle = async () => {
  try {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
  beverageStore.message = "Signed in with Google.";
  setTimeout(() => {
    beverageStore.message = "";
  }, 3000);
  } catch (error) {
    beverageStore.message = "Google sign-in failed. Try again.";
    setTimeout(() => {
      beverageStore.message = "";
    }, 3000);
  }
};

const logout = async () => {
  await signOut(auth);
  beverageStore.message = "Signed out of Google.";
  setTimeout(() => {
    beverageStore.message = "";
  }, 3000);
};

const beverageStore = useBeverageStore();
onMounted(async () => {
  await beverageStore.init();
  onAuthStateChanged(auth, (user) => {
    beverageStore.setUser(user);
  });
})
</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}
ul {
  list-style: none;
}

.auth-section {
  margin-bottom: 70px;
}

</style>
