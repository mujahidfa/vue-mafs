export { Mafs, type MafsProps } from "./view/Mafs";

export {
  CartesianCoordinates,
  autoPi as labelPi,
} from "./origin/CartesianCoordinates";
export type {
  CartesianCoordinatesProps,
  AxisOptions,
  LabelMaker,
} from "./origin/CartesianCoordinates";

export {
  PlotOfX,
  PlotOfY,
  PlotParametric,
  PlotVectorField,
} from "./display/Plot";
export type {
  OfXProps,
  OfYProps,
  ParametricProps,
  VectorFieldProps,
} from "./display/Plot";

export {
  LinePointAngle,
  LinePointSlope,
  LineThroughPoints,
  LineSegment,
} from "./display/Line";
export type {
  PointAngleProps,
  PointSlopeProps,
  ThroughPointsProps,
  SegmentProps,
} from "./display/Line";

export { Circle } from "./display/Circle";
export type { CircleProps } from "./display/Circle";

export { Ellipse } from "./display/Ellipse";
export type { EllipseProps } from "./display/Ellipse";

export { Polygon } from "./display/Polygon";
export type { PolygonProps } from "./display/Polygon";

export { Point } from "./display/Point";
export type { PointProps } from "./display/Point";

export { Vector } from "./display/Vector";
export type { VectorProps } from "./display/Vector";

export { Text } from "./display/Text";
export type { TextProps, CardinalDirection } from "./display/Text";

export { Theme } from "./display/Theme";
export type { Filled, Stroked } from "./display/Theme";

export { MovablePoint } from "./interaction/MovablePoint";
export type { MovablePointProps } from "./interaction/MovablePoint";

export { useMovablePoint } from "./interaction/useMovablePoint";
export type {
  ConstraintFunction,
  UseMovablePoint,
  UseMovablePointArguments,
} from "./interaction/useMovablePoint";

export { useStopwatch } from "./animation/useStopwatch";
export type { Stopwatch, StopwatchArguments } from "./animation/useStopwatch";

export type { Interval } from "./math";
export { vec } from "./vec";

export { Transform, type TransformProps } from "./display/Transform";

export { useTransformContext } from "./context/TransformContext";
export { usePaneContext } from "./context/PaneContext";

export { DebugViewportInfo, DebugTransformWidget } from "./debug";
