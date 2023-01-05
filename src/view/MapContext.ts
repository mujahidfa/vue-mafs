import { inject, type InjectionKey, type Ref } from "vue";
import invariant from "tiny-invariant";

export interface MapContextShape {
  mapX: Ref<(x: number) => number>;
  mapY: Ref<(x: number) => number>;
}

const mapInjectionKey = Symbol() as InjectionKey<MapContextShape>;

export function useMapContext(): MapContextShape {
  const mapInjection = inject(mapInjectionKey);
  invariant(
    mapInjection,
    "mapInjection is not loaded. Are you rendering a Mafs component outside of a MafsView?"
  );

  return mapInjection;
}

export default mapInjectionKey;
