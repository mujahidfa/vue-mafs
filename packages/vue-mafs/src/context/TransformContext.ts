import { inject, type InjectionKey, type Ref } from "vue";
import invariant from "tiny-invariant";
import type * as vec from "../vec";

export interface TransformContextShape {
  /**
   * The resulting transformation matrix from any user-provided transforms (via
   * the `<Transform />` component).
   */
  userTransform: Ref<vec.Matrix>;

  /**
   * A transformation that maps "math" space to pixel space. Note that, in many
   * cases, you don't need to use this transformation directly. Instead, use the
   * `var(--mafs-view-transform)` CSS custom property in combination with the
   * SVG `transform` prop.
   */
  viewTransform: Ref<vec.Matrix>;
}

export const transformInjectionKey =
  Symbol() as InjectionKey<TransformContextShape>;

/**
 * A hook that returns the current transformation context. This is useful for
 * building custom Mafs components that need to be aware of how to map between
 * world space and pixel space, and also need to respond to user-provided
 * transformations.
 */
export function useTransformContext(): TransformContextShape {
  const transformInjection = inject(transformInjectionKey);
  invariant(
    transformInjection,
    "transformInjection is not loaded. Are you rendering a Mafs component outside of <Mafs />?"
  );

  return transformInjection;
}
