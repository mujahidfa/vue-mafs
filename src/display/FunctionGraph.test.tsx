import {
  FunctionGraphOfX,
  // FunctionGraphParametric,
  Theme,
} from "..";
import renderToImage from "../tests/renderToImage";

import { beforeAll, describe, it, expect } from "vitest";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { preview, type PreviewServer } from "vite";
import { chromium, type Browser, type Page } from "@playwright/test";

expect.extend({ toMatchImageSnapshot });

describe("<FunctionGraphOfX />", () => {
  let server: PreviewServer;
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    server = await preview({ preview: { port: 5173 } });
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  it("Renders", async () => {
    const screenshot = await renderToImage(
      <>
        <FunctionGraphOfX y={(x) => (x - 5) ** 2} />
        <FunctionGraphOfX
          y={(x) => 5 - Math.sin(x)}
          style="dashed"
          weight={5}
        />
        <FunctionGraphOfX y={(x) => 5 - (x - 5) ** 2} color="red" />
        <FunctionGraphOfX y={(x) => 5 + Math.sin(x)} color="var(--mafs-blue)" />
      </>,
      {},
      page
    );

    console.log("===================");
    console.log(screenshot);
    console.log("===================");
    expect(screenshot).toMatchImageSnapshot();
  });
});

// describe("<FunctionGraphParametric />", () => {
//   it("Renders", async () => {
//     expect(
//       await renderToImage(
//         <>
//           {/* Good defaults test */}
//           <FunctionGraph.Parametric
//             t={[0, 4 * Math.PI]}
//             xy={(t) => [7 + (t * Math.cos(t)) / 5, 3 + (t * Math.sin(t)) / 5]}
//           />

//           {/* Styles and sample rate */}
//           <FunctionGraph.Parametric
//             t={[0, 2 * Math.PI]}
//             xy={(t) => [3 - (t * Math.cos(t)) / 3, 6 - (t * Math.sin(t)) / 3]}
//             style="dashed"
//             color={Theme.blue}
//             weight={5}
//           />

//           {/* When `t` is a backwards range (higher to lower) */}
//           <FunctionGraph.Parametric
//             t={[5, 0]}
//             xy={(t) => [t, 2 + Math.sin(t)]}
//             color={Theme.red}
//           />
//         </>
//       )
//     ).toMatchImageSnapshot();
//   });
// });
