import { computed, defineComponent, ref, type PropType } from "vue";
import GridPattern from "./GridPattern.vue";
import { range, round } from "../math";
import { usePaneContext } from "../view/PaneManager";
import { useScaleContext } from "../view/ScaleContext";

export type LabelMaker = (value: number) => number | string;

// This is sort of a hack—every SVG pattern on a page needs a unique ID, otherwise they conflict.
const incrementer = ref(0);

export type AxisOptions = {
  axis: boolean;
  lines: number | false;
  subdivisions: number | false;
  labels: false | LabelMaker;
};

const defaultAxisOptions: Partial<AxisOptions> = {
  axis: true,
  lines: 1,
  labels: (x) => x,
};

export interface CartesianCoordinatesProps {
  xAxis?: Partial<AxisOptions>;
  yAxis?: Partial<AxisOptions>;
  subdivisions?: number | false;
}

const CartesianCoordinates = defineComponent({
  name: "CartesianCoordinates",
  props: {
    xAxis: {
      type: Object as PropType<Partial<AxisOptions>>,
    },
    yAxis: {
      type: Object as PropType<Partial<AxisOptions>>,
    },
    subdivisions: { type: [Number, Boolean], default: false },
  },
  setup(props) {
    const xAxis = computed(
      () =>
        ({
          subdivisions: props.subdivisions,
          ...defaultAxisOptions,
          ...props.xAxis,
        } as AxisOptions)
    );
    const yAxis = computed(
      () =>
        ({
          subdivisions: props.subdivisions,
          ...defaultAxisOptions,
          ...props.yAxis,
        } as AxisOptions)
    );

    const id = computed(() => `mafs-grid-${incrementer.value++}`);

    const { xPaneRange, yPaneRange } = usePaneContext();
    const { scaleX, scaleY } = useScaleContext();

    const xCoor = computed(() => xPaneRange.value.map(scaleX.value));
    const yCoor = computed(() => yPaneRange.value.map(scaleY.value));

    const minX = computed(() => xCoor.value[0]);
    const maxX = computed(() => xCoor.value[1]);
    const minY = computed(() => yCoor.value[0]);
    const maxY = computed(() => yCoor.value[1]);

    return () => (
      <>
        <defs>
          <GridPattern
            id={id.value}
            xLines={xAxis.value.lines}
            yLines={yAxis.value.lines}
            xSubdivisions={xAxis.value.subdivisions}
            ySubdivisions={yAxis.value.subdivisions}
          />
        </defs>

        <rect
          fill={`url(#${id.value})`}
          x={minX.value}
          y={maxY.value}
          width={maxX.value - minX.value}
          height={-(maxY.value - minY.value)}
        />

        {xAxis.value.labels && (
          <XLabels
            labelMaker={xAxis.value.labels}
            separation={xAxis.value.lines || 1}
          />
        )}
        {yAxis.value.labels && (
          <YLabels
            labelMaker={yAxis.value.labels}
            separation={yAxis.value.lines || 1}
          />
        )}

        {xAxis.value.axis && (
          <line
            x1={-10000000}
            x2={10000000}
            y1={0}
            y2={0}
            style={{ stroke: "var(--mafs-origin-color)" }}
          />
        )}

        {yAxis.value.axis && (
          <line
            x1={0}
            x2={0}
            y1={-10000000}
            y2={10000000}
            style={{ stroke: "var(--mafs-origin-color)" }}
          />
        )}
      </>
    );
  },
});

export interface LabelsProps {
  separation: number;
  labelMaker: LabelMaker;
}

const XLabels = defineComponent({
  name: "XLabels",
  props: {
    separation: { type: Number, required: true },
    labelMaker: { type: Function as PropType<LabelMaker>, required: true },
  },
  setup(props) {
    const { scaleX } = useScaleContext();
    const { xPanes } = usePaneContext();
    const xs = computed(() =>
      snappedRange(
        xPanes.value[0][0] - props.separation,
        xPanes.value[xPanes.value.length - 1][1] + props.separation,
        props.separation
      )
    );

    return () => (
      <g class="mafs-shadow">
        {xs.value
          .filter((x) => Math.abs(scaleX.value(x) - scaleX.value(0)) > 1)
          .map((x) => (
            <text
              key={x}
              x={scaleX.value(x)}
              y={5}
              dominant-baseline="hanging"
              text-anchor="middle"
            >
              {props.labelMaker(x)}
            </text>
          ))}
      </g>
    );
  },
});

const YLabels = defineComponent({
  name: "YLabels",
  props: {
    separation: { type: Number, required: true },
    labelMaker: { type: Function as PropType<LabelMaker>, required: true },
  },
  setup(props) {
    const { scaleY } = useScaleContext();
    const { yPanes } = usePaneContext();
    const ys = computed(() =>
      snappedRange(
        yPanes.value[0][0] - props.separation,
        yPanes.value[yPanes.value.length - 1][1] + props.separation,
        props.separation
      )
    );

    return () => (
      <g className="mafs-shadow">
        {ys.value
          .filter((y) => Math.abs(scaleY.value(y) - scaleY.value(0)) > 1)
          .map((y) => (
            <text key={y} x={5} y={scaleY.value(y)} dominant-baseline="central">
              {props.labelMaker(y)}
            </text>
          ))}
      </g>
    );
  },
});

function snappedRange(min: number, max: number, step: number) {
  return range(
    Math.floor(min / step) * step,
    Math.ceil(max / step) * step,
    step
  );
}

export function autoPi(x: number): string {
  if (x === 0) return "0";
  if (Math.abs(Math.PI - x) < 0.001) return "π";
  if (Math.abs(-Math.PI - x) < 0.001) return "-π";
  return `${round(x / Math.PI, 5)}π`;
}

export default CartesianCoordinates;
