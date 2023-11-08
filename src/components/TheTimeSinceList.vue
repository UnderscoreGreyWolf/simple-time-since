<script setup lang="ts">
import TimeSinceItem from './TimeSinceItem.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useTimesStore } from '@/stores/times'
import { storeToRefs } from 'pinia'

import type { Ref } from 'vue'
import { ref } from 'vue'

const newTimeEntryName: Ref<String> = ref('')
const newTimeEntryDate: Ref<Date> = ref(new Date())
const store = useTimesStore()

const { times } = storeToRefs(store)

// Adapted from https://vuejs.org/tutorial/#step-7
function addTimeEntry() {
  store.addTimeEntry({
    id: store.next_id,
    name: newTimeEntryName.value,
    date: newTimeEntryDate.value
  })
  newTimeEntryName.value = ''
}
</script>

<template>
  <form @submit.prevent="addTimeEntry">
    <label for="EntryDate">Date and Time of the Entry</label>
    <VueDatePicker name="EntryDate" id="EntryDate" v-model="newTimeEntryDate" enable-seconds />
    <label for="EntryName">Name of the Entry</label>
    <div><input name="EntryName" id="EntryName" v-model="newTimeEntryName" /></div>
    <button>Add Entry</button>
  </form>
  <TimeSinceItem
    v-for="time_entry in times"
    :key="time_entry.id"
    :time_entry="time_entry"
    @removeTimeEntry="store.removeTimeEntry"
  >
  </TimeSinceItem>
</template>
