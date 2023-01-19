import { computed, defineComponent, type PropType } from "vue";
import { range } from "../math";
import { useTransformContext } from "../context/TransformContext";
import { vec } from "../vec";

export interface GridPatternProps {
  id: string;
  xLines: number | false;
  yLines: number | false;
  xSubdivisions: number | false;
  ySubdivisions: number | false;
}

/**
 * @private
 *
 * Creates an SVG <pattern> that looks like a cartesian coordinate plane grid.
 *
 * This is a bit more complex than just rendering lines, but is way more performant, since the
 * browser handles making the pattern repeat for us.
 */
export const GridPattern = defineComponent({
  name: "GridPattern",
  props: {
    id: {
      type: String,
      required: true,
    },
    xLines: {
      type: [Number, Boolean] as PropType<number | false>,
      required: true,
    },
    yLines: {
      type: [Number, Boolean] as PropType<number | false>,
      required: true,
    },
    xSubdivisions: {
      type: [Number, Boolean] as PropType<number | false>,
      required: true,
    },
    ySubdivisions: {
      type: [Number, Boolean] as PropType<number | false>,
      required: true,
    },
  },
  setup(props) {
    const { viewTransform } = useTransformContext();

    const dimensions = computed(() =>
      vec.transform([props.xLines || 1, props.yLines || 1], viewTransform.value)
    );

    const width = computed(() => dimensions.value[0]);
    const height = computed(() => -dimensions.value[1]);

    const xs = computed<number[]>(() => {
      if (props.xSubdivisions && props.xSubdivisions > 1) {
        const pixelXDistance = width.value / props.xSubdivisions;
        return range(0, width.value + pixelXDistance * 1.1, pixelXDistance);
      } else {
        return [];
      }
    });

    const ys = computed<number[]>(() => {
      if (props.ySubdivisions && props.ySubdivisions > 1) {
        const pixelYDistance = height.value / props.ySubdivisions;
        return range(0, height.value + pixelYDistance * 1.1, pixelYDistance);
      } else {
        return [];
      }
    });

    return () => (
      <pattern
        id={props.id}
        x="0"
        y="0"
        width={width.value}
        height={height.value}
        patternUnits="userSpaceOnUse"
      >
        {xs.value.map((x) => (
          <line
            key={x}
            x1={x}
            y1={0}
            x2={x}
            y2={height.value}
            style={{ stroke: "var(--grid-line-subdivision-color)" }}
          />
        ))}
        {ys.value.map((y) => (
          <line
            key={y}
            y1={y}
            x1={0}
            y2={y}
            x2={width.value}
            style={{ stroke: "var(--grid-line-subdivision-color)" }}
          />
        ))}

        {props.xLines && (
          <>
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={height.value}
              style={{ stroke: "var(--mafs-line-color)" }}
            />
            <line
              x1={width.value}
              y1={0}
              x2={width.value}
              y2={height.value}
              style={{ stroke: "var(--mafs-line-color)" }}
            />
          </>
        )}

        {props.yLines && (
          <>
            <line
              x1={0}
              y1={0}
              x2={width.value}
              y2={0}
              style={{ stroke: "var(--mafs-line-color)" }}
            />
            <line
              x1={0}
              y1={height.value}
              x2={width.value}
              y2={height.value}
              style={{ stroke: "var(--mafs-line-color)" }}
            />
          </>
        )}
      </pattern>
    );
  },
});
