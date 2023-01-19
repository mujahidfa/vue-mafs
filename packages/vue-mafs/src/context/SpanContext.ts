import { inject, type InjectionKey, type Ref } from "vue";
import invariant from "tiny-invariant";

export interface SpanContextShape {
  xSpan: Ref<number>;
  ySpan: Ref<number>;
}

export const spanInjectionKey = Symbol() as InjectionKey<SpanContextShape>;

export function useSpanContext(): SpanContextShape {
  const spanInjection = inject(spanInjectionKey);
  invariant(spanInjection, "spanInjection is not defined.");

  return spanInjection;
}
