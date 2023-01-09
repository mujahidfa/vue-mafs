import {
  computed,
  defineComponent,
  ref,
  type ComputedRef,
  type DefineComponent,
  type Ref,
} from "vue";
import { Theme } from "../display/Theme";
import type * as vec from "../vec";
import { MovablePoint } from "./MovablePoint";

export type ConstraintFunction = (position: vec.Vector2) => vec.Vector2;

export interface UseMovablePointArguments {
  color?: string;

  /**
   * Constrain the point to only horizontal movement, vertical movement, or mapped movement.
   *
   * In mapped movement mode, you must provide a function that maps the user's attempted position
   * (x, y) to the position the point should "snap" to.
   */
  constrain?: "horizontal" | "vertical" | ConstraintFunction;
}

export interface UseMovablePoint {
  x: Ref<number>;
  y: Ref<number>;
  point: Ref<vec.Vector2>;
  element: ComputedRef<DefineComponent>;
}

export function useMovablePoint(
  initialPoint: vec.Vector2,
  { constrain, color = Theme.pink }: UseMovablePointArguments = {}
): UseMovablePoint {
  const [initialX, initialY] = initialPoint;
  const point = ref<vec.Vector2>(initialPoint);

  const x = computed(() => point.value[0]);
  const y = computed(() => point.value[1]);

  const constraintFunction = computed<ConstraintFunction>(() => {
    if (constrain === "horizontal") {
      return ([x]) => [x, initialY];
    } else if (constrain === "vertical") {
      return ([, y]) => [initialX, y];
    } else if (typeof constrain === "function") {
      return constrain;
    }

    return ([x, y]) => [x, y];
  });

  const element = computed<DefineComponent>(() => {
    return defineComponent({
      setup() {
        return () => (
          <MovablePoint
            point={point.value}
            color={color}
            constrain={constraintFunction.value}
            onMove={(newPoint: vec.Vector2) => {
              point.value = newPoint;
            }}
          />
        );
      },
    });
  });

  return {
    x,
    y,
    point,
    element,
  };
}
