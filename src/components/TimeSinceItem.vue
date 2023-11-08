<script setup lang="ts">
import type TimeEntry from '@/types/TimeEntry'
import { useCurrentTime } from '@/composables/useCurrentTime'
// @ts-ignore: Untyped Dependency
import ClockOutline from 'vue-material-design-icons/ClockOutline.vue'

import type { Ref } from 'vue'
import { computed, unref, ref, defineEmits, defineProps } from 'vue'
import type { Locale, Interval } from 'date-fns'
import { parseISO, formatDuration, intervalToDuration, isBefore } from 'date-fns'
import timeago from 'vue-timeago3'

// adopted from https://github.com/MrDeerly/vue-timeago3/blob/master/src/converter/defaultConverter.ts
var converter = (date: string | Date, now: Date, locale?: Locale): string => {
  if (typeof date === 'string') {
    console.log(date)
    date = parseISO(date)
  }

  var duration: Interval = { start: date, end: unref(now) }
  if (!isBefore(date, unref(now))) {
    console.warn('This is called Time *Since*!')
    duration = { start: unref(now), end: date }
  }
  console.log(duration)
  return formatDuration(intervalToDuration(duration), {
    locale: locale
  })
}
const showPreciseTime: Ref<boolean> = ref(true)
const props = defineProps<{
  time_entry: TimeEntry
}>()

const emit = defineEmits(['removeTimeEntry'])

const { currentTime } = useCurrentTime()
const time_elapsed = computed(() => converter(props.time_entry.date, unref(currentTime)))
</script>

<template>
  <div class="item">
    <i>
      <ClockOutline />
    </i>
    <div class="details">
      <h3>
        {{ props.time_entry.name }}
      </h3>
      <slot></slot>
      <div v-if="showPreciseTime">
        {{ time_elapsed }}
      </div>
      <timeago v-else :datetime="props.time_entry.date" />
    </div>
    <i>
      <button @click="emit('removeTimeEntry', time_entry)" alt="Remove entry">X</button>
    </i>
  </div>
</template>

<style scoped>
.item {
  margin-top: 2rem;
  display: flex;
  position: relative;
}

.details {
  flex: 1;
  margin-left: 1rem;
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;

  color: var(--color-text);
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--color-heading);
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }

  i {
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }

  .item:before {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>
