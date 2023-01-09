import { computed, defineComponent, type PropType } from "vue";
import { triangleArea } from "../../math";
import type * as vec from "../../vec";
import type { Stroked } from "../../display/Theme";
import { useScaleContext } from "../../view/ScaleContext";

export interface ParametricProps extends Stroked {
  xy: (t: number) => vec.Vector2;
  t: [number, number];
  /**
   * How deep the interpolation algorithm will go in terms of subdividing the function to find
   * points that minimize the jaggedness of the function. Defaults to 8.
   *
   * Most functions will not need to override this. It's mainly to support functions that are
   * very jagged.
   *
   * This value affects performance exponentially, O(2ⁿ). The default value is 8, meaning functions
   * will be subdivided into at least 256 points. For any three consecutive points, if the area of
   * the triangle formed by those points is larger than 0.1 square pixels, the points will be
   * further, recursively subdivided.
   */
  minimumSamplingDepth?: number;
}

export const ParametricFunction = defineComponent({
  name: "FunctionGraphParametric",
  props: {
    xy: {
      type: Function as PropType<(t: number) => vec.Vector2>,
      required: true,
    },
    t: {
      type: Object as PropType<[number, number]>,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    lineStyle: {
      type: String as PropType<"solid" | "dashed">,
      default: "solid",
      required: false,
    },
    weight: {
      type: Number,
      default: 2,
      required: false,
    },
    opacity: {
      type: Number,
      default: 1.0,
      required: false,
    },
    /**
     * How deep the interpolation algorithm will go in terms of subdividing the function to find
     * points that minimize the jaggedness of the function. Defaults to 8.
     *
     * Most functions will not need to override this. It's mainly to support functions that are
     * very jagged.
     *
     * This value affects performance exponentially, O(2ⁿ). The default value is 8, meaning functions
     * will be subdivided into at least 256 points. For any three consecutive points, if the area of
     * the triangle formed by those points is larger than 0.1 square pixels, the points will be
     * further, recursively subdivided.
     */
    minimumSamplingDepth: {
      type: Number,
      default: 8,
      required: false,
    },
  },
  setup(props) {
    const { cssScale, scaleX, scaleY } = useScaleContext();

    const tMin = computed(() => props.t[0]);
    const tMax = computed(() => props.t[1]);
    const areaThreshold = computed(
      () => -0.1 / (scaleX.value(1) * scaleY.value(1))
    );

    const svgPath = computed(() => {
      let pathDescriptor = "M ";

      function smartSmooth(
        min: number,
        max: number,
        pushLeft: boolean,
        pushRight: boolean,
        depth = 0
      ) {
        const mid = (min + max) / 2;

        const xyMin = props.xy(min);
        const xyMid = props.xy(mid);
        const xyMax = props.xy(max);

        const area = triangleArea(xyMin, xyMid, xyMax);

        if (depth < props.minimumSamplingDepth || area > areaThreshold.value) {
          smartSmooth(min, mid, true, false, depth + 1);
          smartSmooth(mid, max, false, true, depth + 1);
        } else {
          if (pushLeft) pathDescriptor += `${xyMin[0]} ${xyMin[1]} L `;
          pathDescriptor += `${xyMid[0]} ${xyMid[1]} L `;
          if (pushRight) pathDescriptor += `${xyMax[0]} ${xyMax[1]} L `;
        }
      }

      smartSmooth(tMin.value, tMax.value, true, true);

      return pathDescriptor.substring(0, pathDescriptor.length - 3);
    });

    return () => (
      <path
        d={svgPath.value}
        stroke-width={props.weight}
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray={props.lineStyle === "dashed" ? "1,10" : undefined}
        transform={cssScale.value}
        style={{
          stroke: props.color || "var(--mafs-fg)",
          strokeOpacity: props.opacity,
          vectorEffect: "non-scaling-stroke",
        }}
      />
    );
  },
});
