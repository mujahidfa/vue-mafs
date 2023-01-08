import { computed, defineComponent, type PropType } from "vue";
import { clamp } from "../math";
import * as vec from "../vec";
import { usePaneContext } from "../view/PaneManager";
import { useScaleContext } from "../view/ScaleContext";
import { Theme } from "./Theme";

export interface VectorFieldProps {
  xy: (x: number, y: number) => [number, number];
  xyOpacity?: (x: number, y: number) => number;
  step: number;
  opacityStep?: number;
  color?: string;
}

const xyOpacityDefault = () => 1;

export const VectorField = defineComponent({
  props: {
    xy: {
      type: Function as PropType<(x: number, y: number) => [number, number]>,
      required: true,
    },
    step: {
      type: Number,
      default: 1,
      required: false,
    },
    xyOpacity: {
      type: Function as PropType<(x: number, y: number) => number>,
      default: xyOpacityDefault,
      required: false,
    },
    opacityStep: {
      type: Number,
      required: false,
    },
    color: {
      type: String,
      default: Theme.foreground,
      required: false,
    },
  },
  setup(props) {
    const { pixelMatrix } = useScaleContext();
    const { xPanes, yPanes } = usePaneContext();

    const layers = computed(() => {
      let localOpacityStep: number =
        props.xyOpacity === xyOpacityDefault ? 1 : 0.2;

      if (props.opacityStep !== undefined) {
        localOpacityStep = props.opacityStep;
      } else {
        localOpacityStep = props.xyOpacity === xyOpacityDefault ? 1 : 0.2;
      }

      // Impose restrictions on opacityStep
      const opacityStep = Math.min(1, Math.max(0.01, localOpacityStep));

      const opacityGrainularity = Math.ceil(1 / opacityStep);
      const layers = generateOpacityLayers(opacityGrainularity);
      for (const [xMin, xMax] of xPanes.value) {
        for (const [yMin, yMax] of yPanes.value) {
          for (
            let x = Math.floor(xMin);
            x <= Math.ceil(xMax);
            x += props.step
          ) {
            for (
              let y = Math.floor(yMin);
              y <= Math.ceil(yMax);
              y += props.step
            ) {
              const tail: vec.Vector2 = [x, y];
              const trueOffset = props.xy(x, y);
              const trueMag = vec.mag(trueOffset);
              const scaledOffset = vec.scale(
                vec.normalize(trueOffset),
                Math.min(trueMag, props.step * 0.75)
              );
              const tip = vec.add(tail, scaledOffset);

              const pixelTail = vec.transform(tail, pixelMatrix.value);
              const pixelTipOffset = vec.transform(
                scaledOffset,
                pixelMatrix.value
              );
              const pixelSize = vec.mag(pixelTipOffset);
              const pixelTip = vec.transform(tip, pixelMatrix.value);

              const arrowVector = vec.scale(
                vec.normalize(pixelTipOffset),
                Math.min(pixelSize, 5)
              );
              const left = vec.add(
                pixelTip,
                vec.rotate(arrowVector, (5 / 6) * Math.PI)
              );
              const right = vec.add(
                pixelTip,
                vec.rotate(arrowVector, -(5 / 6) * Math.PI)
              );

              const trueOpacity = props.xyOpacity(x, y);
              const layer = findClosetLayer(layers, trueOpacity);
              layer.d +=
                ` M ${pixelTail[0]} ${pixelTail[1]}` +
                ` L ${pixelTip[0]} ${pixelTip[1]} ` +
                ` L ${left[0]} ${left[1]} ` +
                ` L ${right[0]} ${right[1]} ` +
                ` L ${pixelTip[0]} ${pixelTip[1]} `;
            }
          }
        }
      }

      return layers;
    });

    return () => (
      <>
        {layers.value.map((layer, index) => (
          <path
            d={layer.d}
            key={index}
            style={{
              stroke: props.color,
              fill: props.color,
              opacity: layer.opacity,
              fillOpacity: layer.opacity,
              strokeOpacity: layer.opacity,
            }}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        ))}
      </>
    );
  },
});

interface Layer {
  d: string;
  opacity: number;
}

/**
 * Generates a list of layers. Each layer will eventually be convereted to a <path>
 * with a certain opacity.
 *
 * The higher the opacityGrainularity, the more fidelity you get accross opacities,
 * however the more layers you have, the more lag you get.
 *
 * @param opacityGrainularity the granulity of the opacity layers
 * @returns a list of layers
 */
function generateOpacityLayers(opacityGrainularity: number): Layer[] {
  const layers: Layer[] = [];
  const step = 1 / opacityGrainularity;
  for (let i = 1; i > 0; i -= step) {
    const layer: Layer = {
      d: "",
      opacity: i,
    };
    layers.push(layer);
  }
  return layers;
}

/**
 * Takes in a pointOpacity (a number) and returns the layer it belongs to from layers.
 *
 * @param layers the layers to catagorize pointOpacity to.
 * @param pointOpacity the opacity to categorize to a layer.
 * @return the layer that this opacity value belongs to.
 */
function findClosetLayer(layers: Layer[], pointOpacity: number): Layer {
  pointOpacity = clamp(pointOpacity, 0, 1);
  const index =
    layers.length - 1 - Math.round(pointOpacity * (layers.length - 1));
  return layers[index];
}
