import {
  Mafs,
  CartesianCoordinates,
  MovablePoint,
  type Vector2,
  useMovablePoint,
  LineSegment,
  Theme,
  vec,
} from "../src/index";
import range from "lodash/range";
import { computed, defineComponent } from "vue";

const DynamicMovablePoints = defineComponent({
  setup() {
    const start = useMovablePoint([-3, -1]);
    const end = useMovablePoint([3, 1]);

    function shift(shiftBy: Vector2) {
      start.point.value = vec.add(start.point.value, shiftBy);
      end.point.value = vec.add(end.point.value, shiftBy);
    }

    const betweenPoints = computed(() => {
      const length = vec.dist(start.point.value, end.point.value);
      const betweenPoints = range(1, length - 0.5, 1).map((t) =>
        vec.lerp(start.point.value, end.point.value, t / length)
      );

      return betweenPoints;
    });

    return () => (
      <Mafs>
        <CartesianCoordinates />

        <LineSegment point1={start.point.value} point2={end.point.value} />

        <start.element.value />
        {betweenPoints.value.map((point, i) => (
          <MovablePoint
            key={i}
            point={point}
            color={Theme.blue}
            onMove={(newPoint) => {
              shift(vec.sub(newPoint, point));
            }}
          />
        ))}
        <end.element.value />
      </Mafs>
    );
  },
});

export default DynamicMovablePoints;
