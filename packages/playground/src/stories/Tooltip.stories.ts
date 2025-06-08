import type {Meta, StoryObj} from "@storybook/vue3";
import {ErTooltip, ErButton} from "n-ui";
import {fn, userEvent, waitFor, within, expect} from '@storybook/test'

type Story = StoryObj<typeof ErTooltip>
import 'n-ui/dist/esm/theme/button.css'
import 'n-ui/dist/esm/theme/tooltip.css'

const meta: Meta<typeof ErTooltip> = {
  title: "Example/Tooltip",
  component: ErTooltip,
  tags: ["autodocs"],
  argTypes: {
    trigger: {
      options: ['hover', 'click', 'contextmenu'],
      control: {
        type: "select"
      },
    },
    placement: {
      options: ['top', 'bottom', 'right', 'left'],
      control: {
        type: "select"
      },
    }
  },
  args: {
    "onVisible-change": fn()
  }
};

export const Default: Story = {
  render: (args) => ({
    components: {ErTooltip},
    subcomponents: {ErButton:ErButton},
    setup() {
      return {args}
    },
    template: `
      <ErTooltip v-bind="args">
        <ErButton type="primary">Hover me</ErButton>
      </ErTooltip>
    `
  }),
  args: {
    content: "This is a tooltip",
    placement: 'right',
    trigger: 'hover',
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    const triggerButton = canvas.getByText(/Hover me/i)

    await userEvent.hover(triggerButton)

    await waitFor(() => {
      expect(canvas.getByRole('tooltip')).toBeInTheDocument()
    })
  }
}
export default meta;
