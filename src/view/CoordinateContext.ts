import { inject, type InjectionKey, type Ref } from "vue";
import invariant from "tiny-invariant";

// TODO: to see if xMin, xMax, yMin and yMax need to be made reactive types
export interface CoordinateContextShape {
  xMin: Ref<number>;
  xMax: Ref<number>;
  yMin: Ref<number>;
  yMax: Ref<number>;
  width: number;
  height: number;
}

const coordinateInjectionKey = Symbol() as InjectionKey<CoordinateContextShape>;

export function useCoordinateContext(): CoordinateContextShape {
  const coordinateInjection = inject(coordinateInjectionKey);
  invariant(
    coordinateInjection,
    "coordinateInjection is not loaded. Are you rendering a Mafs component outside of a MafsView?"
  );

  return coordinateInjection;
}

export default coordinateInjectionKey;
