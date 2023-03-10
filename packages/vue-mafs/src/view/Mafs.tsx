import { computed, defineComponent, provide, ref, type PropType } from "vue";
import {
  coordinateInjectionKey,
  type CoordinateContextShape,
} from "../context/CoordinateContext";
import { PaneManager } from "../context/PaneContext";
import { useElementSize } from "@vueuse/core";

import { normalizeProps, useDrag } from "vuse-gesture";
import { round } from "../math";
import { vec } from "../vec";
import { transformInjectionKey } from "../context/TransformContext";
import { spanInjectionKey } from "../context/SpanContext";

export interface MafsProps {
  width?: number | "auto";
  height?: number;
  /** Whether to enable panning with the mouse and keyboard */
  pan?: boolean;
  /**
   * A way to declare the "area of interest" of your visualizations. Mafs will center and zoom to
   * this area.
   */
  viewBox?: { x?: vec.Vector2; y?: vec.Vector2; padding?: number };
  /**
   * Whether to squish the graph to fill the Mafs viewport or to preserve the aspect ratio of the
   * coordinate space.
   */
  preserveAspectRatio?: "contain" | false;
}

export const Mafs = defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Mafs",
  props: {
    width: {
      type: [Number, String] as PropType<number | "auto">,
      default: "auto",
      required: false,
    },
    height: {
      type: Number,
      default: 500,
      required: false,
    },
    /** Whether to enable panning with the mouse and keyboard */
    pan: {
      type: Boolean,
      default: true,
      required: false,
    },
    /**
     * A way to declare the "area of interest" of your visualizations. Mafs will center and zoom to
     * this area.
     */
    viewBox: {
      type: Object as PropType<{
        x?: vec.Vector2;
        y?: vec.Vector2;
        padding?: number;
      }>,
      default: () => ({ x: [-3, 3], y: [-3, 3] }),
      required: false,
    },
    /**
     * Whether to squish the graph to fill the Mafs viewport or to preserve the aspect ratio of the
     * coordinate space.
     */
    preserveAspectRatio: {
      type: [String, Boolean] as PropType<"contain" | boolean>,
      default: "contain",
      required: false,
      validator(prop: string | boolean) {
        return ["contain", false].includes(prop);
      },
    },
  },
  setup(props, { slots }) {
    const visible = ref(true);
    const desiredCssWidth = computed(() =>
      props.width === "auto" ? "100%" : `${props.width}px`
    );

    const containerRef = ref<HTMLDivElement | null>(null);
    const { width } = useElementSize(containerRef, {
      width: 500,
      height: 1,
    });

    const aspect = computed(() => width.value / props.height);

    const offset = ref<vec.Vector2>([0, 0]);

    const aoi = computed(() => {
      const padding = (props as MafsProps).viewBox?.padding ?? 0.5;
      return {
        xMin: (props.viewBox?.x?.[0] ?? 0) - padding + offset.value[0],
        xMax: (props.viewBox?.x?.[1] ?? 0) + padding + offset.value[0],
        yMin: (props.viewBox?.y?.[0] ?? 0) - padding + offset.value[1],
        yMax: (props.viewBox?.y?.[1] ?? 0) + padding + offset.value[1],
      };
    });

    const coor = computed(() => {
      let xMin = aoi.value.xMin;
      let xMax = aoi.value.xMax;
      let yMin = aoi.value.yMin;
      let yMax = aoi.value.yMax;

      // Default behavior for `preserveAspectRatio == false`
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

    const bind = useDrag(
      ({ offset: [mx, my], event, type }) => {
        // Prevent document scroll
        if (type.includes("key")) event.preventDefault();
        offset.value = [
          (-mx / width.value) * xSpan.value,
          (my / props.height) * ySpan.value,
        ];
      },
      { enabled: props.pan }
    );

    const viewTransform = computed(() => {
      const scaleX = round((1 / xSpan.value) * width.value, 5);
      const scaleY = round((-1 / ySpan.value) * props.height, 5);
      return vec.matrixBuilder().scale(scaleX, scaleY).get();
    });

    const toPxCSS = computed(() => vec.toCSS(viewTransform.value));

    const coordinateContext: CoordinateContextShape = {
      xMin,
      xMax,
      yMin,
      yMax,
      height: props.height,
      width: width.value,
    };

    const viewBoxX = computed(() =>
      round((xMin.value / (xMax.value - xMin.value)) * width.value, 2)
    );
    const viewBoxY = computed(() =>
      round((yMax.value / (yMin.value - yMax.value)) * props.height, 2)
    );

    provide(coordinateInjectionKey, coordinateContext);
    provide(spanInjectionKey, { xSpan, ySpan });
    provide(transformInjectionKey, {
      userTransform: ref(vec.identity),
      viewTransform: viewTransform,
    });

    return () => (
      <div
        class="MafsView"
        style={{ width: desiredCssWidth.value }}
        tabindex={props.pan ? 0 : -1}
        ref={containerRef}
        {...normalizeProps(bind())}
      >
        <PaneManager>
          <svg
            width={width.value}
            height={props.height}
            viewBox={`${viewBoxX.value} ${viewBoxY.value} ${width.value} ${props.height}`}
            preserveAspectRatio="xMidYMin"
            style={{
              width: desiredCssWidth.value,
              touchAction: props.pan ? "none" : "auto",
              "--mafs-view-transform": toPxCSS.value,
              "--mafs-user-transform": "translate(0, 0)",
            }}
          >
            {visible.value && slots.default?.()}
          </svg>
        </PaneManager>
      </div>
    );
  },
});
