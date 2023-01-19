import { computed, defineComponent } from "vue";
import { vec } from "../vec";
import { Theme } from "../display/Theme";
import { useMovablePoint } from "../interaction/useMovablePoint";
import { Transform } from "../display/Transform";
import { Circle } from "../display/Circle";
import { Polygon } from "../display/Polygon";

export const TransformWidget = defineComponent({
  name: "DebugTransformWidget",
  setup(_, { slots }) {
    const t = useMovablePoint([0, 0]);
    const s = useMovablePoint([1, 1], { color: Theme.blue });
    const r = useMovablePoint([1, 0], {
      color: Theme.green,
      constrain: (p) => vec.normalize(p),
    });
    const angle = computed(() =>
      Math.atan2(r.point.value[1], r.point.value[0])
    );

    return () => (
      <>
        <Transform translate={t.point.value}>
          <Transform rotate={angle.value}>
            <Transform scale={s.point.value}>
              {slots.default?.()}

              <Polygon
                points={[
                  [0, 0],
                  [0, 1],
                  [1, 1],
                  [1, 0],
                ]}
                color={Theme.blue}
              />
            </Transform>

            <Circle
              center={[0, 0]}
              radius={1}
              strokeStyle="dashed"
              strokeOpacity={0.5}
              fillOpacity={0}
              color={Theme.green}
            />

            <s.element.value />
          </Transform>

          <r.element.value />
        </Transform>

        <t.element.value />
      </>
    );
  },
});
