import { computed, defineComponent, type PropType } from "vue";
import { GridPattern } from "./GridPattern";
import { range, round } from "../math";
import { usePaneContext } from "../view/PaneManager";
import { useScaleContext } from "../view/ScaleContext";

export type LabelMaker = (value: number) => number | string;

// This is sort of a hack—every SVG pattern on a page needs a unique ID, otherwise they conflict.
let incrementer = 0;

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
  xAxis?: Partial<AxisOptions> | false;
  yAxis?: Partial<AxisOptions> | false;
  subdivisions?: number | false;
}

export const CartesianCoordinates = defineComponent({
  name: "CartesianCoordinates",
  props: {
    xAxis: {
      type: [Object, Boolean] as PropType<Partial<AxisOptions> | false>,
      default: undefined,
      required: false,
    },
    yAxis: {
      type: [Object, Boolean] as PropType<Partial<AxisOptions> | false>,
      default: undefined,
      required: false,
    },
    subdivisions: {
      type: [Number, Boolean] as PropType<number | false>,
      default: false,
      required: false,
    },
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

    const id = `mafs-grid-${incrementer++}`;

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
            id={id}
            xLines={props.xAxis !== false ? xAxis.value.lines : false}
            yLines={props.yAxis !== false ? yAxis.value.lines : false}
            xSubdivisions={
              props.xAxis !== false ? xAxis.value.subdivisions : false
            }
            ySubdivisions={
              props.yAxis !== false ? yAxis.value.subdivisions : false
            }
          />
        </defs>

        <rect
          fill={`url(#${id})`}
          x={minX.value}
          y={maxY.value}
          width={maxX.value - minX.value}
          height={-(maxY.value - minY.value)}
        />

        {props.xAxis !== false && xAxis.value.labels && (
          <XLabels
            labelMaker={xAxis.value.labels}
            separation={xAxis.value.lines || 1}
          />
        )}
        {props.yAxis !== false && yAxis.value.labels && (
          <YLabels
            labelMaker={yAxis.value.labels}
            separation={yAxis.value.lines || 1}
          />
        )}

        {props.xAxis !== false && xAxis.value.axis && (
          <line
            x1={-10000000}
            x2={10000000}
            y1={0}
            y2={0}
            style={{ stroke: "var(--mafs-origin-color)" }}
          />
        )}

        {props.yAxis !== false && yAxis.value.axis && (
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
      <g class="mafs-shadow">
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
