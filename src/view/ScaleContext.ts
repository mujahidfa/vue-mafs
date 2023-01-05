import { inject, type InjectionKey, type Ref } from "vue";
import invariant from "tiny-invariant";

import type { Matrix } from "../vec";

export interface ScaleContextShape {
  scaleX: Ref<(x: number) => number>;
  scaleY: Ref<(y: number) => number>;
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
