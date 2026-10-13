import type { Preview } from "@storybook/react-vite";

import "@haitigov/design-system/styles.css";
import "@haitigov/ui/styles.css";
import "../src/storybook.css";

const preview: Preview = {
  parameters: {
    a11y: {
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
        },
      },
      test: "error",
    },
    controls: {
      expanded: true,
    },
    layout: "fullscreen",
  },
};

export default preview;
