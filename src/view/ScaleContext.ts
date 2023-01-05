import { inject, type ComputedRef, type InjectionKey, type Ref } from "vue";
import invariant from "tiny-invariant";

import type { Matrix } from "../vec";

// TODO: to see if each property need to be made reactive types
export interface ScaleContextShape {
  scaleX: ComputedRef<(x: number) => number>;
  scaleY: ComputedRef<(y: number) => number>;
  // scaleX: Ref<(x: number) => number>;
  // scaleY: Ref<(y: number) => number>;
  // scaleX: (x: number) => number;
  // scaleY: (y: number) => number;
  // xSpan: number;
  // ySpan: number;
  xSpan: Ref<number>;
  ySpan: Ref<number>;
  pixelMatrix: Ref<Matrix>;
  inversePixelMatrix: Ref<Matrix>;
  cssScale: Ref<string>;
}

const scaleInjectionKey = Symbol() as InjectionKey<ScaleContextShape>;

export function useScaleContext(): ScaleContextShape {
  const scaleInjection = inject(scaleInjectionKey);
  invariant(
    scaleInjection,
    "scaleInjection is not loaded. Are you rendering a Mafs component outside of a MafsView?"
  );

  return scaleInjection;
}

export default scaleInjectionKey;
