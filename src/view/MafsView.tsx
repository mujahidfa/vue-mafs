import {
  computed,
  defineComponent,
  onMounted,
  provide,
  ref,
  watch,
  type PropType,
} from "vue";
import coordinateInjectionKey, {
  type CoordinateContextShape,
} from "./CoordinateContext";
import PaneManager from "./PaneManager";
import mapInjectionKey, { type MapContextShape } from "./MapContext";
import { useDraggable, useResizeObserver } from "@vueuse/core";

import scaleInjectionKey, { type ScaleContextShape } from "./ScaleContext";
import { round } from "../math";
import * as vec from "../vec";

export interface MafsViewProps {
  width?: number | string;
  height?: number;
  pan?: boolean;
  viewBox?: { x?: vec.Vector2; y?: vec.Vector2; padding?: number };
  preserveAspectRatio?: "contain" | false;

  /**
   * Enable rendering on the server side. If false, an empty view will still be rendered, with
   * nothing in it.
   *
   * Note that server-side rendering complicated graphs can really bloat your HTML.
   */
  ssr?: boolean;
}

const MafsView = defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Mafs",
  props: {
    width: { type: [Number, String], default: "auto" },
    height: { type: Number, default: 500 },
    pan: { type: Boolean, default: true },
    viewBox: {
      type: Object as PropType<{
        x?: vec.Vector2;
        y?: vec.Vector2;
        padding?: number;
      }>,
      default: () => ({ x: [-3, 3], y: [-3, 3] }),
    },
    preserveAspectRatio: { type: [String, Boolean], default: "contain" },
    ssr: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const visible = ref(props.ssr ? true : false);
    const desiredCssWidth = computed(() =>
      props.width === "auto" ? "100%" : `${props.width}px`
    );

    const containerRef = ref<HTMLDivElement | null>(null);
    // const width = ref(props.ssr ? 500 : 1);
    const width = ref(props.width as number);
    useResizeObserver(containerRef, (entries) => {
      const entry = entries[0];
      const { width: containerWidth } = entry.contentRect;
      console.log(containerWidth);
      width.value = containerWidth;
    });

    onMounted(() => {
      visible.value = true;
    });

    const aspect = computed(() => width.value / props.height);

    const offset = ref<vec.Vector2>([0, 0]);

    const aoi = computed(() => {
      const padding = props.viewBox?.padding ?? 0.5;
      return {
        xMin: (props.viewBox?.x?.[0] ?? 0) - padding + offset.value[0],
        xMax: (props.viewBox?.x?.[1] ?? 0) + padding + offset.value[0],
        yMin: (props.viewBox?.y?.[0] ?? 0) - padding + offset.value[1],
        yMax: (props.viewBox?.y?.[1] ?? 0) + padding + offset.value[1],
      };
    });

    const coor = computed(() => {
      // Default behavior for `preserveAspectRatio == false`
      let xMin = aoi.value.xMin;
      let xMax = aoi.value.xMax;
      let yMin = aoi.value.yMin;
      let yMax = aoi.value.yMax;

      if (props.preserveAspectRatio === "contain") {
        const aoiAspect =
          (aoi.value.xMax - aoi.value.xMin) / (aoi.value.yMax - aoi.value.yMin);
        if (aoiAspect > aspect.value) {
          const yCenter = (aoi.value.yMax + aoi.value.yMin) / 2;
          const ySpan = (aoi.value.xMax - aoi.value.xMin) / aspect.value / 2;
          yMin = yCenter - ySpan;
          yMax = yCenter + ySpan;
        } else {
          const xCenter = (aoi.value.xMax + aoi.value.xMin) / 2;
          const xSpan = ((aoi.value.yMax - aoi.value.yMin) * aspect.value) / 2;
          xMin = xCenter - xSpan;
          xMax = xCenter + xSpan;
        }
      }

      return {
        xMin,
        xMax,
        yMin,
        yMax,
      };
    });

    const xMin = computed(() => coor.value.xMin);
    const xMax = computed(() => coor.value.xMax);
    const yMin = computed(() => coor.value.yMin);
    const yMax = computed(() => coor.value.yMax);

    const xSpan = computed(() => xMax.value - xMin.value);
    const ySpan = computed(() => yMax.value - yMin.value);

    // const {
    //   x: mx,
    //   y: my,
    //   style,
    // } = useDraggable(containerRef, {
    //   initialValue: { x: 40, y: 40 },
    // });

    // watch([mx, my], () => {
    //   offset.value = [
    //     (-mx.value / width.value) * xSpan,
    //     (my.value / props.height) * ySpan,
    //   ];
    // });

    const mapX = (x: number) =>
      round(((x - xMin.value) / (xMax.value - xMin.value)) * width.value);

    const mapY = (y: number) =>
      round(((y - yMax.value) / (yMin.value - yMax.value)) * props.height);

    const scaleX = computed(
      () => (x: number) => round((x / xSpan.value) * width.value, 5)
    );
    const scaleY = computed(
      () => (y: number) => round((-y / ySpan.value) * props.height, 5)
    );

    const unscaleX = (x: number) => round((x / width.value) * xSpan.value, 5);
    const unscaleY = (y: number) => round((-y / props.height) * ySpan.value, 5);

    const pixelMatrix = computed(() =>
      vec.matrixBuilder().scale(scaleX.value(1), scaleY.value(1)).get()
    );
    const inversePixelMatrix = computed(() =>
      vec.matrixBuilder().scale(unscaleX(1), unscaleY(1)).get()
    );

    const cssScale = computed(
      () => `scale(${scaleX.value(1)} ${scaleY.value(1)})`
    );

    const coordinateContext: CoordinateContextShape = {
      xMin,
      xMax,
      yMin,
      yMax,
      height: props.height,
      width: width.value,
    };
    const scaleContext: ScaleContextShape = {
      scaleX,
      scaleY,
      pixelMatrix,
      inversePixelMatrix,
      cssScale,
      xSpan,
      ySpan,
    };
    const mapContext: MapContextShape = { mapX, mapY };

    provide(coordinateInjectionKey, coordinateContext);
    provide(scaleInjectionKey, scaleContext);
    provide(mapInjectionKey, mapContext);

    return () => (
      <div
        class="MafsView"
        style={`width:${desiredCssWidth.value};`}
        // style={`${style.value}width:${desiredCssWidth.value};`}
        tabindex={props.pan ? 0 : -1}
        ref="containerRef"
      >
        <PaneManager>
          <svg
            width={width.value}
            height={props.height}
            viewBox={`${-mapX(0)} ${-mapY(0)} ${width.value} ${props.height}`}
            preserveAspectRatio="xMidYMin"
            style={{
              width: desiredCssWidth.value,
              touchAction: props.pan ? "none" : "auto",
            }}
          >
            {visible.value && slots.default?.()}
          </svg>
        </PaneManager>
      </div>
    );
  },
});

export default MafsView;
