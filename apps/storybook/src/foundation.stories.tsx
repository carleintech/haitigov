import type { Meta, StoryObj } from "@storybook/react-vite";

import { FoundationShowcase } from "./foundation-showcase.js";

const meta = {
  component: FoundationShowcase,
  globals: {
    a11y: {
      manual: true,
    },
  },
  parameters: {
    a11y: {
      test: "error",
    },
  },
  title: "Foundation/Design tokens",
} satisfies Meta<typeof FoundationShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Foundation: Story = {};
