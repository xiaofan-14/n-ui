import DefaultTheme from "vitepress/theme";
import { type App } from "vue";
import NUI from "n-ui-mini";
import { ElementPlusContainer } from "@vitepress-preview/component";

import "@vitepress-preview/component/style.css";
import "n-ui-mini/dist/index.css";

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component("demo-preview", ElementPlusContainer);
    app.use(NUI);
  },
};
