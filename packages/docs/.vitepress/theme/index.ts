import DefaultTheme from "vitepress/theme";
import { type App } from "vue";
import EricUI from "learn-ui-to-me";
import { ElementPlusContainer } from "@vitepress-preview/component";

import "@vitepress-preview/component/style.css";
import "learn-ui-to-me/dist/index.css";

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component("demo-preview", ElementPlusContainer);
    app.use(EricUI);
  },
};
