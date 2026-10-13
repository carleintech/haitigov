import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentsShowcase } from "./components-showcase.js";

const meta = {
  component: ComponentsShowcase,
  parameters: { a11y: { test: "error" } },
  title: "Components/Foundation",
} satisfies Meta<typeof ComponentsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
