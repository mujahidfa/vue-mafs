import { onMounted, onUnmounted, ref, watch, type Ref } from "vue";

export interface StopwatchArguments {
  /** The start time in seconds */
  startTime?: number;
  /** The end time in seconds */
  endTime?: number;
}

export interface Stopwatch {
  /**
   * The amount of time that has passed since the timer started, in high-precision seconds.
   */
  time: Ref<number>;
  /** Starts the timer (resumes the timer if paused) */
  start: () => void;
  /** Stops and resets the timer. */
  stop: () => void;

  /** Sets the current time to a certain value.
   * @throws an error if the time is outside of the given range.
   */
  setTime: (time: number) => void;
}

export function useStopwatch(options?: StopwatchArguments): Stopwatch {
  const { startTime = 0, endTime: endTimeOption = Infinity } = options || {};

  const endTime = ref(endTimeOption);

  const startClockTime = ref<DOMHighResTimeStamp | null>(null);
  const time = ref(startTime);
  const playing = ref(false);

  const request = ref(-1);

  function tick(now: DOMHighResTimeStamp) {
    now = now / 1000;

    if (!startClockTime.value) startClockTime.value = now;
    const deltaTime = now - startClockTime.value;

    if (deltaTime >= endTime.value) {
      startClockTime.value = null;
      time.value = endTime.value;
      playing.value = false;
      return;
    }

    time.value = Math.min(deltaTime, endTime.value);
    request.value = window.requestAnimationFrame(tick);
  }

  onMounted(() => {
    if (playing.value) {
      request.value = window.requestAnimationFrame(tick);
    } else {
      window.cancelAnimationFrame(request.value);
    }
  });

  watch([playing, endTime], () => {
    if (playing.value) {
      request.value = window.requestAnimationFrame(tick);
    } else {
      window.cancelAnimationFrame(request.value);
    }
  });

  onUnmounted(() => {
    window.cancelAnimationFrame(request.value);
  });

  const start = () => {
    playing.value = true;
  };
  const stop = () => {
    startClockTime.value = null;
    playing.value = false;
    time.value = startTime;
  };

  return {
    time,
    setTime: (newTime) => {
      time.value = newTime * 1000;
    },
    start,
    stop,
  };
}
