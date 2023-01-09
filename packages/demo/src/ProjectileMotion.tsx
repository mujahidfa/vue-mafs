import { computed, defineComponent, watch } from "vue";
import {
  Mafs,
  useStopwatch,
  Point,
  useMovablePoint,
  PlotParametric,
  Vector,
  Polygon,
} from "vue-mafs";

const ProjectileMotion = defineComponent({
  setup() {
    const xSpan = 1.75;
    const ySpan = 1.75;
    const initialVelocity = useMovablePoint([0.5, 1.5]);

    const vectorScale = 4;

    const g = 9.8;
    const xVelocity = computed(() => initialVelocity.x.value * vectorScale);
    const yVelocity = computed(() => initialVelocity.y.value * vectorScale);

    const timeOfFlight = computed(() => {
      const velocityAngle = Math.atan(yVelocity.value / xVelocity.value);
      const velocityMag = Math.sqrt(
        xVelocity.value ** 2 + yVelocity.value ** 2
      );
      return Math.abs(2 * velocityMag * Math.sin(velocityAngle)) / g;
    });

    function positionAtTime(t: number): [number, number] {
      return [xVelocity.value * t, yVelocity.value * t - 0.5 * g * t ** 2];
    }
    const resting = computed(() => positionAtTime(timeOfFlight.value));
    const restingX = computed(() => resting.value[0]);
    const restingY = computed(() => resting.value[1]);

    const {
      time: t,
      start,
      stop,
    } = useStopwatch({
      endTime: timeOfFlight.value,
    });

    // Reset the ball's whenever the resting position changes
    watch([restingX, restingY], () => {
      stop();
    });

    return () => (
      <>
        <Mafs
          viewBox={{
            x: [1 - xSpan, 1 + xSpan],
            y: [1 - ySpan, 1 + ySpan],
          }}
        >
          <Polygon
            points={[
              [-100, 0],
              [100, 0],
              [100, -100],
              [-100, -100],
            ]}
            color="green"
          />

          <Vector
            tip={[xVelocity.value / vectorScale, yVelocity.value / vectorScale]}
          />

          {yVelocity.value > 0 && (
            <>
              <PlotParametric
                xy={positionAtTime}
                t={[0, timeOfFlight.value]}
                opacity={0.4}
                lineStyle="dashed"
              />
              <Point x={restingX.value} y={restingY.value} opacity={0.5} />
            </>
          )}

          <Point
            x={positionAtTime(t.value)[0]}
            y={positionAtTime(t.value)[1]}
          />
          <text
            x={10}
            y={30}
            font-size={20}
            class="transform-to-center"
            fill="white"
          >
            t = {t.value.toFixed(2)}/
            {yVelocity.value > 0 ? timeOfFlight.value.toFixed(2) : "—"} seconds
          </text>

          <initialVelocity.element.value />
        </Mafs>

        {/* These classnames are part of the Mafs docs website—they won't work for you. */}
        <div class="p-4 bg-black border-t border-gray-900 space-x-4">
          <button
            class="bg-gray-200 text-black font-bold px-4 py-1 rounded-sm"
            onClick={start}
            disabled={yVelocity.value <= 0}
          >
            Start
          </button>
          <button
            class="bg-gray-200 text-black font-bold px-4 py-1 rounded-sm"
            onClick={stop}
          >
            Reset
          </button>
        </div>
      </>
    );
  },
});

export default ProjectileMotion;
