import { createSSRApp, type App, type RendererNode, type VNode } from "vue";
import { renderToString } from "vue/server-renderer";
import * as fs from "fs";
import * as path from "path";
import type { Page } from "@playwright/test";

import { Mafs, CartesianCoordinates } from "..";

const css = fs
  .readFileSync(path.join(process.cwd(), "src/index.css"))
  .toString();

export default async function renderToImage(
  children: App<any> | VNode<RendererNode>,
  { coordinates = true } = {},
  page: Page
): Promise<Buffer | string | void> {
  const app = createSSRApp({
    setup() {
      return () => (
        <>
          <head>
            <style
              innerHTML={`
                    body {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                    }
      
                    .MafsView text {
                      opacity: 0;
                    }
      
                    ${css}
                  `}
            ></style>
          </head>

          <body>
            <Mafs
              width={500}
              height={500}
              viewBox={{ x: [0, 10], y: [0, 10] }}
              pan={false}
            >
              {coordinates ? <CartesianCoordinates /> : null}
              {children}
            </Mafs>
          </body>
        </>
      );
    },
  });

  const html = await renderToString(app);

  await page.setContent(html);
  await page.evaluateHandle("document.fonts.ready");
  return await page.screenshot();
}
