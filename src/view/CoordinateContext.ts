import { inject, type InjectionKey, type Ref } from "vue";
import invariant from "tiny-invariant";

export interface CoordinateContextShape {
  xMin: Ref<number>;
  xMax: Ref<number>;
  yMin: Ref<number>;
  yMax: Ref<number>;
  width: number;
  height: number;
}

export const coordinateInjectionKey =
  Symbol() as InjectionKey<CoordinateContextShape>;

export function useCoordinateContext(): CoordinateContextShape {
  const coordinateInjection = inject(coordinateInjectionKey);
  invariant(
    coordinateInjection,
    "coordinateInjection is not loaded. Are you rendering a Mafs component outside of a MafsView?"
  );

  return coordinateInjection;
}
