import { inject, type InjectionKey } from "vue";
import invariant from "tiny-invariant";

// TODO: to see if mapX and mapY need to be made reactive types
export interface MapContextShape {
  mapX: (x: number) => number;
  mapY: (y: number) => number;
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
