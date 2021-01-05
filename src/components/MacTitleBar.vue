<template>
  <div
    class="draggable title-bar"
    :style="{ 'background-color': isFocused ? '#3a3739' : '#2f292f' }"
  >
    <div class="wrapper">
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { remote } from 'electron'

function useWindowControl() {
  const win = remote.getCurrentWindow()
  const isPinned = ref(win.isAlwaysOnTop())
  const isFocused = ref(win.isFocused())

  function focus() {
    isFocused.value = true
  }
  function blur() {
    isFocused.value = false
  }

  win.addListener('focus', focus)
  win.addListener('blur', blur)

  // remove listeners before refreshing to prevent memory leak
  window.onbeforeunload = () => {
    win.removeListener('focus', focus)
    win.removeListener('blur', blur)
  }

  function pinWindow() {
    isPinned.value = !isPinned.value
    win.setAlwaysOnTop(isPinned.value)
  }

  return { isPinned, isFocused, pinWindow }
}

export default defineComponent({
  setup() {
    const { isPinned, isFocused, pinWindow } = useWindowControl()

    return { isPinned, isFocused, pinWindow }
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
  padding: 0 10px;
  font-size: 20px;

  .wrapper {
    padding-top: 5px;
    display: flex;
    justify-content: flex-end;

    .pin-button {
      padding-top: 1px;
      font-size: 13px;
    }
  }
}
</style>
