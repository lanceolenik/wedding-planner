<script setup>
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import { onMounted, ref, onUpdated, onUnmounted, inject } from 'vue'

// accept the text prop so message can be customized
const props = defineProps({
  // ...
  options: {
    // ⬅️ define options as a prop
    type: Object,
    default() {
      return {} // ⬅️ default it to an empty object
    },
  },
})

// a template ref to get the span DOM element in the template
const tooltip = ref(null)

// tippyInstance used for destroying if it already exists before create a new one
let tippyInstance = null

// initialize tippy on the proper element with the proper content
function initTippy() {
  //...
  tippyInstance = tippy(tooltip.value.parentNode, {
    content: props.text,
    ...props.options, // ⬅️ spread the options into tippy's options
  })
}

// we should initialize tippy on mounted so that it works on app load
onMounted(initTippy)

// but we should also initialize it again on update
// so that the tooltip text is reactive
onUpdated(initTippy)

// Finally we should clean up things and prevent memory leaks by destorying
// tippy whenever the component is unmounted
onUnmounted(() => tippyInstance.destroy())
</script>
<template>
  <span ref="tooltip"></span>
</template>

<style lang="scss" scoped></style>
