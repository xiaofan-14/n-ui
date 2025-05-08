import type {Meta, StoryObj, ArgTypes} from '@storybook/vue3'
import {fn, within, userEvent, expect} from '@storybook/test'
import {ErButton, ErButtonGroup} from 'learn-ui'

type Story = StoryObj<typeof ErButton> & { argsType?: ArgTypes }

const meta: Meta<typeof ErButton> = {
    title: 'Example/Button',
    component: ErButton,
    subcomponents: { ButtonGroup: ErButtonGroup },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: {type: 'select'},
            options: ['primary', 'success', 'warning', 'danger', 'info', ''],
        },
        size: {
            control: {type: 'select'},
            options: ['large', 'default', 'small', ''],
        },
        disabled: {control: 'boolean'},
        loading: {control: 'boolean'},
        useThrottle: {control: 'boolean'},
        throttleDuration: {control: 'number'},
        autofocus: {control: 'boolean'},
        tag: {
            control: {type: 'select'},
            options: ['button', 'a', 'div'],
        },
        nativeType: {
            control: {type: 'select'},
            options: ['button', 'submit', 'reset', ''],
        },
        icon: {control: 'text'},
        suffixIcon: {control: 'text'},
        loadingIcon: {control: 'text'},
    },
    args: {
        onClick: fn(),
    },
}

const container = (val: string) => `
  <div style="margin: 5px">${val}</div>
`

export default meta

// ======================== Default Button ========================
export const Default: Story & { args: { content: string } } = {
    argsType: {
        content: {control: {type: 'text'}},
    },
    args: {
        type: 'primary',
        content: 'Button',
    },
    render: (args: any) => ({
        components: {ErButton},
        setup: () => ({args}),
        template: container(`<ErButton v-bind="args">{{ args.content }}</ErButton>`),
    }),
    play: async ({canvasElement, args, step}) => {
        const canvas = within(canvasElement)
        await step('click btn', async () => {
            await userEvent.click(canvas.getByRole('button'))
        })
        await expect(args.onClick).toHaveBeenCalled()
    },
}

// ======================== Loading State ========================
export const WithLoading: Story = {
    args: {
        loading: true,
        content: 'Loading...',
    },
    render: (args: any) => ({
        components: {ErButton},
        setup: () => ({args}),
        template: `
          <ErButton v-bind="args">{{ args.content }}</ErButton>`,
    }),
    play: async ({canvasElement}) => {
        const canvas = within(canvasElement)
        const btn = canvas.getByRole('button')
        await expect(btn).toHaveAttribute('disabled')
        const icon = canvas.getByTestId('er-icon')
        await expect(icon).toBeTruthy()
    },
}

// ======================== Disabled Click ========================
export const DisabledClick: Story = {
    args: {
        disabled: true,
        content: 'Disabled',
        onClick: fn(),
    },
    render: (args: any) => ({
        components: {ErButton},
        setup: () => ({args}),
        template: `
          <ErButton v-bind="args">{{ args.content }}</ErButton>`,
    }),
    play: async ({canvasElement, args}) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button'))
        await expect(args.onClick).not.toHaveBeenCalled()
    },
}

// ======================== With Icons ========================
export const WithIcon: Story = {
    args: {
        icon: 'check',
        suffixIcon: 'arrow-right',
        content: 'With Icons',
    },
    render: (args: any) => ({
        components: {ErButton},
        setup: () => ({args}),
        template: `
          <ErButton v-bind="args">{{ args.content }}</ErButton>`,
    }),
    play: async ({canvasElement}) => {
        const canvas = within(canvasElement)
        const icons = canvas.getAllByTestId('er-icon')
        await expect(icons.length).toBeGreaterThanOrEqual(1)
    },
}

// ======================== Throttle Click ========================
export const ThrottleClick: Story = {
    args: {
        useThrottle: true,
        throttleDuration: 1000,
        content: 'Throttle',
        onClick: fn(),
    },
    render: (args: any) => ({
        components: {ErButton},
        setup: () => ({args}),
        template: `
          <ErButton v-bind="args">{{ args.content }}</ErButton>`,
    }),
    play: async ({canvasElement, args}) => {
        const canvas = within(canvasElement)
        const btn = canvas.getByRole('button')
        await userEvent.click(btn)
        await userEvent.click(btn)
        await expect(args.onClick).toHaveBeenCalledTimes(1)
    },
}

// ======================== Tag & NativeType ========================
export const AsAnchorTag: Story = {
    args: {
        tag: 'a',
        content: 'Link Button',
        href: 'https://example.com',
    },
    render: (args: any) => ({
        components: {ErButton},
        setup: () => ({args}),
        template: `
          <ErButton v-bind="args">{{ args.content }}</ErButton>`,
    }),
    play: async ({canvasElement}) => {
        const canvas = within(canvasElement)
        const anchor = canvas.getByRole('link')
        await expect(anchor).toHaveAttribute('href', 'https://example.com')
    },
}

export const Group: Story & { args: { content1: string; content2: string } } = {
    argTypes: {
        groupType: {
            control: { type: "select" },
            options: ["primary", "success", "warning", "danger", "info", ""],
        },
        groupSize: {
            control: { type: "select" },
            options: ["large", "default", "small", ""],
        },
        groupDisabled: {
            control: "boolean",
        },
        content1: {
            control: { type: "text" },
            defaultValue: "Button1",
        },
        content2: {
            control: { type: "text" },
            defaultValue: "Button2",
        },
    },
    args: {
        round: true,
        content1: "Button1",
        content2: "Button2",
    },
    render: (args) => ({
        components: { ErButton, ErButtonGroup },
        setup() {
            return { args };
        },
        template: container(`
       <er-button-group :type="args.groupType" :size="args.groupSize" :disabled="args.groupDisabled">
         <er-button v-bind="args">{{args.content1}}</er-button>
         <er-button v-bind="args">{{args.content2}}</er-button>
       </er-button-group>
    `),
    }),
    play: async ({ canvasElement, args, step }) => {
        const canvas = within(canvasElement);
        await step("click btn1", async () => {
            await userEvent.click(canvas.getByText("Button1"));
        });
        await step("click btn2", async () => {
            await userEvent.click(canvas.getByText("Button2"));
        });
        await expect(args.onClick).toHaveBeenCalled();
    },
};

