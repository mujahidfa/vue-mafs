import { computed, defineComponent, type PropType } from "vue";
import { range, round } from "../math";
import { usePaneContext } from "../context/PaneContext";
import { useTransformContext } from "../context/TransformContext";
import * as vec from "../vec";
import { GridPattern } from "./GridPattern";

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

    const minX = computed(() => xPaneRange.value[0]);
    const maxX = computed(() => xPaneRange.value[1]);
    const minY = computed(() => yPaneRange.value[0]);
    const maxY = computed(() => yPaneRange.value[1]);

    const { viewTransform } = useTransformContext();
    const minPx = computed(() =>
      vec.transform([minX.value, maxY.value], viewTransform.value)
    );
    const minXPx = computed(() => minPx.value[0]);
    const minYPx = computed(() => minPx.value[1]);

    const px = computed(() =>
      vec.transform(
        [maxX.value - minX.value, maxY.value - minY.value],
        viewTransform.value
      )
    );
    const widthPx = computed(() => px.value[0]);
    const heightPx = computed(() => px.value[1]);

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
          x={minXPx.value}
          y={minYPx.value}
          width={widthPx.value}
          height={-heightPx.value}
        />
        <g style={{ transform: "var(--mafs-view-transform)" }}>
          {props.xAxis !== false && xAxis.value.axis && (
            <line
              x1={minX.value}
              x2={maxX.value}
              y1={0}
              y2={0}
              style={{ stroke: "var(--mafs-origin-color)" }}
              vector-effect="non-scaling-stroke"
            />
          )}

          {props.yAxis !== false && yAxis.value.axis && (
            <line
              x1={0}
              x2={0}
              y1={minY.value}
              y2={maxY.value}
              style={{ stroke: "var(--mafs-origin-color)" }}
              vector-effect="non-scaling-stroke"
            />
          )}
        </g>

        <g class="mafs-shadow" fill="var(--mafs-fg)">
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
        </g>
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
    const { viewTransform } = useTransformContext();
    const { xPanes } = usePaneContext();
    const xs = computed(() =>
      snappedRange(
        xPanes.value[0][0] - props.separation,
        xPanes.value[xPanes.value.length - 1][1] + props.separation,
        props.separation
      ).filter((x) => x !== 0)
    );

    return () => (
      <g>
        {xs.value.map((x) => (
          <text
            key={x}
            x={vec.transform([x, 0], viewTransform.value)[0]}
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
    const { viewTransform: toPx } = useTransformContext();
    const { yPanes } = usePaneContext();
    const ys = computed(() =>
      snappedRange(
        yPanes.value[0][0] - props.separation,
        yPanes.value[yPanes.value.length - 1][1] + props.separation,
        props.separation
      ).filter((y) => y !== 0)
    );

    return () => (
      <g>
        {ys.value.map((y) => (
          <text
            key={y}
            x={5}
            y={vec.transform([0, y], toPx.value)[1]}
            dominant-baseline="central"
          >
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
