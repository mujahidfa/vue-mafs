import {
  Mafs,
  useMovablePoint,
  FunctionGraphOfX,
  Polygon,
  Text,
  CartesianCoordinates,
} from "vue-mafs";

import sumBy from "lodash/sumBy";
import range from "lodash/range";
import { computed, defineComponent, ref } from "vue";

interface Partition {
  polygon: [number, number][];
  area: number;
}

const RiemannSum = defineComponent({
  setup() {
    const maxNumPartitions = 200;

    // Inputs
    const numPartitions = ref(40);
    const lift = useMovablePoint([0, -1], {
      constrain: "vertical",
    });
    const a = useMovablePoint([1, 0], {
      constrain: "horizontal",
    });
    const b = useMovablePoint([11, 0], {
      constrain: "horizontal",
    });

    // The function
    const wave = (x: number) =>
      Math.sin(3 * x) + x ** 2 / 20 - 2 + lift.y.value + 2;
    const integral = (x: number) =>
      (1 / 60) * (x ** 3 - 20 * Math.cos(3 * x)) + lift.y.value * x;

    // Outputs
    const exactArea = computed(() => integral(b.x.value) - integral(a.x.value));

    const partitions = computed<Partition[]>(() => {
      const dx = (b.x.value - a.x.value) / numPartitions.value;

      return range(a.x.value, b.x.value - dx / 2, dx).map((x) => {
        const yMid = wave(x + dx / 2);

        return {
          polygon: [
            [x, 0],
            [x, yMid],
            [x + dx, yMid],
            [x + dx, 0],
          ],
          area: dx * yMid,
        };
      });
    });

    const areaApprox = computed(() => sumBy(partitions.value, "area"));

    return () => (
      <>
        <Mafs viewBox={{ x: [-1, 12], y: [-3, 10] }}>
          <CartesianCoordinates subdivisions={2} />

          <FunctionGraphOfX y={wave} color="#358CF1" />

          {partitions.value.map((partition, index) => (
            <Polygon
              key={index}
              points={partition.polygon}
              fillOpacity={numPartitions.value / maxNumPartitions}
              color={
                partition.area >= 0
                  ? "hsl(112, 100%, 47%)"
                  : "hsl(0, 100%, 47%)"
              }
            />
          ))}

          <Text attach="e" x={1.2} y={5.5} size={20}>
            Midpoint Riemann sum:
          </Text>

          <Text attach="e" x={1.2} y={4.5} size={30}>
            {areaApprox.value.toFixed(4)}
          </Text>

          <Text attach="e" x={1.2} y={3.5} size={20}>
            True area:
          </Text>

          <Text attach="e" x={1.2} y={2.5} size={30}>
            {exactArea.value.toFixed(4)}
          </Text>

          <lift.element.value />
          <a.element.value />
          <b.element.value />
        </Mafs>

        {/* These classnames are part of the Mafs docs website—they won't work for you. */}
        <div class="p-4 border-gray-700 border-t bg-black text-white">
          Partitions:{" "}
          <input
            type="range"
            min={20}
            max={200}
            value={numPartitions}
            onInput={(event) => {
              numPartitions.value = +(event.target as HTMLInputElement).value;
            }}
          />
        </div>
      </>
    );
  },
});

export default RiemannSum;
