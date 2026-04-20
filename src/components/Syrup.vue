<template>
  <div class="syrup" :style="{ '--syrup-color': syrup.color }"></div>
</template>

<script setup lang="ts">
  import { SyrupType } from '../types/beverage';

  const { syrup }= defineProps<{
    syrup: SyrupType
  }>();
</script>
<style lang="scss" scoped>

@keyframes pour-layer {
  0% {
    transform: translateY(400%);
  }
  100% {
    transform: translateY(0%);
  }
}
.syrup {
  transform: translateY(400%);
  background-color: #c6c6c6;
  position: relative;
  width: 100%;
  height: 20%;
  animation: pour-tea 2s 1s forwards;
  z-index: 2;

  background: repeating-linear-gradient(
    45deg,
    white,
    white 10px,
    var(--syrup-color) 10px,
    var(--syrup-color) 20px
  );
}
</style>
