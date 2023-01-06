import {
  computed,
  defineComponent,
  inject,
  provide,
  type InjectionKey,
  type PropType,
} from "vue";
import * as vec from "../vec";

export interface TransformProps {
  matrix?: vec.Matrix;
  translate?: vec.Vector2;
  scale?: number | vec.Vector2;
  rotate?: number;
  shear?: vec.Vector2;
}

export const transformInjectionKey = Symbol() as InjectionKey<vec.Matrix>;

export function useTransformContext() {
  return inject(transformInjectionKey, vec.matrixBuilder().get());
}

export const Transform = defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Transform",
  props: {
    matrix: {
      type: Object as PropType<vec.Matrix>,
      required: false,
    },
    translate: {
      type: Object as PropType<vec.Vector2>,
      required: false,
    },
    scale: {
      type: [Number, Object] as PropType<number | vec.Vector2>,
      required: false,
    },
    rotate: {
      type: Number,
      required: false,
    },
    shear: {
      type: Object as PropType<vec.Vector2>,
      required: false,
    },
  },
  setup(props, { slots }) {
    const existingTransform = useTransformContext();

    const newTransform = computed(() => {
      let builder = vec.matrixBuilder();

      if (props.matrix) builder = builder.mult(props.matrix);

      for (const [name, value] of Object.entries({
        translate: props.translate,
        scale: props.scale,
        rotate: props.rotate,
        shear: props.shear,
      })) {
        if (value === null || value === undefined) continue;
        switch (name) {
          case "translate":
            builder = builder.translate(...(value as vec.Vector2));
            break;
          case "scale":
            if (typeof value === "number")
              builder = builder.scale(value, value);
            else builder = builder.scale(...(value as vec.Vector2));
            break;
          case "shear":
            builder = builder.shear(...(value as vec.Vector2));
            break;
          case "rotate":
            builder = builder.rotate(value as number);
            break;
        }
      }

      builder = builder.mult(existingTransform);

      return builder.get();
    });

    provide(transformInjectionKey, newTransform.value);

    return () => slots.default?.();
  },
});
