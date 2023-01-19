import {
  computed,
  defineComponent,
  inject,
  provide,
  ref,
  type InjectionKey,
  type Ref,
} from "vue";
import { useCoordinateContext } from "./CoordinateContext";
import { range, type Interval } from "../math";

interface PaneContextShape {
  xPanes: Ref<Interval[]>;
  yPanes: Ref<Interval[]>;
  xPaneRange: Ref<Interval>;
  yPaneRange: Ref<Interval>;
}

const paneInjectionKey = Symbol() as InjectionKey<PaneContextShape>;

export function usePaneContext(): PaneContextShape {
  return inject(paneInjectionKey, {
    xPanes: ref([]),
    yPanes: ref([]),
    xPaneRange: ref([0, 0] as Interval),
    yPaneRange: ref([0, 0] as Interval),
  });
}

export const PaneManager = defineComponent({
  name: "PaneManager",
  setup(_, { slots }) {
    const { xMin, xMax, yMin, yMax } = useCoordinateContext();
    const base = 2;

    const xStep = computed(() => {
      const xSpan = xMax.value - xMin.value;
      return base ** Math.round(Math.log10(xSpan) / Math.log10(base));
    });
    const xLowerBound = computed(
      () => Math.floor(xMin.value / xStep.value) * xStep.value
    );
    const xUpperBound = computed(
      () => Math.ceil(xMax.value / xStep.value) * xStep.value
    );
    const xPanes = computed(() =>
      range(xLowerBound.value, xUpperBound.value, xStep.value).map(
        (xMin) => [xMin, xMin + xStep.value] as Interval
      )
    );

    const yStep = computed(() => {
      const ySpan = yMax.value - yMin.value;
      return base ** Math.round(Math.log10(ySpan) / Math.log10(base));
    });
    const yLowerBound = computed(
      () => Math.floor(yMin.value / yStep.value) * yStep.value
    );
    const yUpperBound = computed(
      () => Math.ceil(yMax.value / yStep.value) * yStep.value
    );
    const yPanes = computed(() =>
      range(yLowerBound.value, yUpperBound.value, yStep.value).map(
        (yMin) => [yMin, yMin + yStep.value] as Interval
      )
    );

    const xPaneRange = computed(
      () => [xLowerBound.value, xUpperBound.value] as unknown as Interval
    );
    const yPaneRange = computed(
      () => [yLowerBound.value, yUpperBound.value] as unknown as Interval
    );

    provide(paneInjectionKey, {
      xPanes,
      yPanes,
      xPaneRange,
      yPaneRange,
    });

    return () => slots.default?.();
  },
});
