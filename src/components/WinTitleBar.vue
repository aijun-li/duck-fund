<template>
  <div class="draggable title-bar">
    <div
      class="pin-button undraggable"
      :style="{ color: isPinned ? 'orange' : 'grey' }"
      @click="pinWindow"
    >
      <font-awesome-icon
        :icon="['fas', 'thumbtack']"
        class="pin-button"
      ></font-awesome-icon>
    </div>
    <div>
      <div
        class="regular-control minimize-button undraggable"
        @click="minimizeWindow"
      >
        <i class="el-icon-minus"></i>
      </div>
      <div
        class="regular-control close-button undraggable"
        @click="closeWindow"
      >
        <i class="el-icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { remote } from 'electron'

function useWindowControl() {
  const win = remote.getCurrentWindow()
  const isPinned = ref(win.isAlwaysOnTop())

  function pinWindow() {
    isPinned.value = !isPinned.value
    win.setAlwaysOnTop(isPinned.value)
  }

  function minimizeWindow() {
    win.minimize()
  }

  function closeWindow() {
    win.close()
  }

  return { isPinned, pinWindow, minimizeWindow, closeWindow }
}

export default defineComponent({
  setup() {
    const {
      isPinned,
      pinWindow,
      minimizeWindow,
      closeWindow
    } = useWindowControl()

    return { isPinned, pinWindow, minimizeWindow, closeWindow }
  }
})
</script>

<style lang="scss" scoped>
.draggable {
  -webkit-app-region: drag;
}

.undraggable {
  -webkit-app-region: no-drag;
}

.title-bar {
  height: 27px;
  font-size: 20px;

  display: flex;
  justify-content: space-between;

  .pin-button {
    padding: 3px 0 0 5px;
    font-size: 15px;
  }

  .regular-control {
    display: inline-block;
    width: 55px;
    height: 27px;
    line-height: 27px;
    text-align: center;
    transition: all 0.2s;
  }

  .minimize-button:hover {
    background-color: #e5e5e5;
  }

  .close-button:hover {
    color: white;
    background-color: red;
  }
}
</style>
