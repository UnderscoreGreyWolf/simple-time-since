// https://dev.to/snehalkadwe/digital-clock-using-vue-3-composition-api-5cmc
import type { Ref } from 'vue'
import { ref, onBeforeUnmount } from 'vue'

export const useCurrentTime = () => {
  const currentTime: Ref<Date> = ref(new Date())
  const updateCurrentTime = () => {
    currentTime.value = new Date()
  }
  const updateTimeInterval = setInterval(updateCurrentTime, 1000)
  onBeforeUnmount(() => {
    clearInterval(updateTimeInterval)
  })
  return {
    currentTime
  }
}
