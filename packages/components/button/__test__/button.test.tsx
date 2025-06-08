import {describe, it, expect, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import NButton from '../src/button.vue'
import ButtonGroup from '../src/button-group.vue'

describe('NButton', () => {
    it('should render primary button type', () => {
        const wrapper = mount(() => <NButton type="primary">Primary</NButton>)
        expect(wrapper.text()).toBe('Primary')
        expect(wrapper.classes()).toContain('n-button--primary')
    })

    it('should apply correct size class', () => {
        const wrapper = mount(() => <NButton size="default">Small</NButton>)
        expect(wrapper.classes()).toContain('n-button--default')
    })

    it('should render icon and suffix icon', () => {
        const wrapper = mount(() => (
            <NButton icon="check" suffixIcon="arrow-right">Icon</NButton>
        ))
        expect(wrapper.find('.n-icon').exists()).toBe(true)
    })

    it('should show loading spinner and disable button', () => {
        const wrapper = mount(() => <NButton loading>Loading</NButton>)
        expect(wrapper.find('.is-loading').exists()).toBe(true)
        expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('should prevent click when disabled', async () => {
        const onClick = vi.fn()
        const wrapper = mount(() => <NButton disabled onClick={onClick}>Disabled</NButton>)
        await wrapper.trigger('click')
        expect(onClick).not.toHaveBeenCalled()
    })

    it('should debounce click event', async () => {
        vi.useFakeTimers()
        const onClick = vi.fn()
        const wrapper = mount(() => <NButton debounce onClick={onClick}>Debounced</NButton>)
        await wrapper.trigger('click')
        vi.advanceTimersByTime(300)
        expect(onClick).toHaveBeenCalledTimes(1)
        await wrapper.trigger('click')
        expect(onClick).toHaveBeenCalledTimes(1)  // still debounced
        vi.useRealTimers()
    })

    it('should render plain, round, and circle classes', () => {
        const wrapper = mount(() => (
            <NButton plain round circle>Props</NButton>
        ))
        expect(wrapper.classes()).toContain('is-plain')
        expect(wrapper.classes()).toContain('is-round')
        expect(wrapper.classes()).toContain('is-circle')
    })

    it('should set native type for button tag', () => {
        const wrapper = mount(() => <NButton nativeType="submit"/>)
        expect(wrapper.attributes('type')).toBe('submit')
    })

    it('should omit native type for non-button tag', () => {
        const wrapper = mount(() => <NButton tag="a" nativeType="submit"/>)
        expect(wrapper.attributes('type')).toBeUndefined()
    })

    it('should set autofocus attribute', () => {
        const wrapper = mount(() => <NButton autofocus/>)
        expect(wrapper.attributes('autofocus')).toBeDefined()
    })

    it('should render custom loading icon', () => {
        const wrapper = mount(() => (
            <NButton loading loadingIcon="loading-custom">Loading</NButton>
        ))
        const icon = wrapper.findComponent({name: 'NIcon'})
        expect(icon.exists()).toBe(true)
        expect(icon.props('icon')).toBe('loading-custom')
    })

    it('should render default slot content', () => {
        const wrapper = mount(() => <NButton>Click me</NButton>)
        expect(wrapper.text()).toContain('Click me')
    })

    it('should render named loading slot', () => {
        const wrapper = mount({
            components: {NButton},
            template: `
              <NButton loading>
                <template #loading>
                  <span class="custom-loading">Loading...</span>
                </template>
              </NButton>
            `
        })
        expect(wrapper.find('.custom-loading').exists()).toBe(true)
    })

    it('should throttle click handler when useThrottle is true', async () => {
        vi.useFakeTimers()
        const onClick = vi.fn()
        const wrapper = mount(() => <NButton useThrottle throttleDuration={1000}
                                              onClick={onClick}>Throttled</NButton>)
        await wrapper.trigger('click')
        await wrapper.trigger('click')
        vi.advanceTimersByTime(500)
        await wrapper.trigger('click')
        vi.advanceTimersByTime(1000)
        await wrapper.trigger('click')
        expect(onClick).toHaveBeenCalledTimes(2)
        vi.useRealTimers()
    })

    it('should emit click without throttle if useThrottle is false', async () => {
        const onClick = vi.fn()
        const wrapper = mount(() => <NButton useThrottle={false} onClick={onClick}>NoThrottle</NButton>)
        await wrapper.trigger('click')
        await wrapper.trigger('click')
        expect(onClick).toHaveBeenCalledTimes(2)
    })
})

describe("ButtonGroup.vue", () => {
    it("basic button group", async () => {
        const wrapper = mount(() => (
            <ButtonGroup>
                <NButton>button 1</NButton>
                <NButton>button 2</NButton>
            </ButtonGroup>
        ));

        expect(wrapper.classes()).toContain("n-button-group");
    });

    it("button group size", () => {
        const sizes = ["large", "default", "small"];
        sizes.forEach((size) => {
            const wrapper = mount(() => (
                <ButtonGroup size={size as any}>
                    <NButton>button 1</NButton>
                    <NButton>button 2</NButton>
                </ButtonGroup>
            ));

            const buttonWrapper = wrapper.findComponent(NButton);
            expect(buttonWrapper.classes()).toContain(`n-button--${size}`);
        });
    });

    it("button group type", () => {
        const types = ["primary", "success", "warning", "danger", "info"];
        types.forEach((type) => {
            const wrapper = mount(() => (
                <ButtonGroup type={type as any}>
                    <NButton>button 1</NButton>
                    <NButton>button 2</NButton>
                </ButtonGroup>
            ));

            const buttonWrapper = wrapper.findComponent(NButton);
            expect(buttonWrapper.classes()).toContain(`n-button--${type}`);
        });
    });

    it("button group disabled", () => {
        const _disabled = true
        const wrapper = mount(() => (
            <ButtonGroup disabled={_disabled as boolean}>
                <NButton>button 1</NButton>
                <NButton>button 2</NButton>
            </ButtonGroup>
        ));

        const buttonWrapper = wrapper.findComponent(NButton);
        expect(buttonWrapper.classes()).toContain(`is-disabled`);
    });
});

