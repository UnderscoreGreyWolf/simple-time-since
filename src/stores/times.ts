import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type TimeEntry from '@/types/TimeEntry.ts'

// Adopted from https://runthatline.com/how-to-use-local-storage-pinia/
const STORE_NAME = 'times'

const getDefaultTimes = (): TimeEntry[] => [
  { id: 0, name: 'Beginn der Entwicklung', date: new Date(2023, 11 - 1, 7, 8, 5, 0) }
]
const getTimes = (): TimeEntry[] => {
  const times = localStorage.getItem(STORE_NAME)

  return times ? JSON.parse(times) : getDefaultTimes()
}

export const useTimesStore = defineStore(STORE_NAME, {
  state: () => {
    const times = ref<TimeEntry[]>(getTimes())
    const next_id = computed(
      () =>
        Math.max(
          -1, // Handling for empty array
          ...times.value.map((t) => t.id)
        ) + 1
    )

    return { times, next_id }
  },
  actions: {
    updateTimes(times: TimeEntry[]) {
      this.times = times
      localStorage.setItem(STORE_NAME, JSON.stringify(this.times))
    },
    removeTimeEntry(time_entry: TimeEntry) {
      console.debug(`Removing ${time_entry}`)
      this.times = this.times.filter((t) => t !== time_entry)
      localStorage.setItem(STORE_NAME, JSON.stringify(this.times))
    },
    addTimeEntry(time_entry: TimeEntry) {
      console.debug(`Adding ${time_entry}`)
      this.times.push(time_entry)
      localStorage.setItem(STORE_NAME, JSON.stringify(this.times))
    }
  }
})
