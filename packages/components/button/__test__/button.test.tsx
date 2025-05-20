import {describe, it, expect, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import ErButton from '../src/button.vue'
import ButtonGroup from '../src/button-group.vue'

describe('ErButton', () => {
    it('should render primary button type', () => {
        const wrapper = mount(() => <ErButton type="primary">Primary</ErButton>)
        expect(wrapper.text()).toBe('Primary')
        expect(wrapper.classes()).toContain('er-button--primary')
    })

    it('should apply correct size class', () => {
        const wrapper = mount(() => <ErButton size="default">Small</ErButton>)
        expect(wrapper.classes()).toContain('er-button--default')
    })

    it('should render icon and suffix icon', () => {
        const wrapper = mount(() => (
            <ErButton icon="check" suffixIcon="arrow-right">Icon</ErButton>
        ))
        expect(wrapper.find('.er-icon').exists()).toBe(true)
    })

    it('should show loading spinner and disable button', () => {
        const wrapper = mount(() => <ErButton loading>Loading</ErButton>)
        expect(wrapper.find('.is-loading').exists()).toBe(true)
        expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('should prevent click when disabled', async () => {
        const onClick = vi.fn()
        const wrapper = mount(() => <ErButton disabled onClick={onClick}>Disabled</ErButton>)
        await wrapper.trigger('click')
        expect(onClick).not.toHaveBeenCalled()
    })

    it('should debounce click event', async () => {
        vi.useFakeTimers()
        const onClick = vi.fn()
        const wrapper = mount(() => <ErButton debounce onClick={onClick}>Debounced</ErButton>)
        await wrapper.trigger('click')
        vi.advanceTimersByTime(300)
        expect(onClick).toHaveBeenCalledTimes(1)
        await wrapper.trigger('click')
        expect(onClick).toHaveBeenCalledTimes(1)  // still debounced
        vi.useRealTimers()
    })

    it('should render plain, round, and circle classes', () => {
        const wrapper = mount(() => (
            <ErButton plain round circle>Props</ErButton>
        ))
        expect(wrapper.classes()).toContain('is-plain')
        expect(wrapper.classes()).toContain('is-round')
        expect(wrapper.classes()).toContain('is-circle')
    })

    it('should set native type for button tag', () => {
        const wrapper = mount(() => <ErButton nativeType="submit"/>)
        expect(wrapper.attributes('type')).toBe('submit')
    })

    it('should omit native type for non-button tag', () => {
        const wrapper = mount(() => <ErButton tag="a" nativeType="submit"/>)
        expect(wrapper.attributes('type')).toBeUndefined()
    })

    it('should set autofocus attribute', () => {
        const wrapper = mount(() => <ErButton autofocus/>)
        expect(wrapper.attributes('autofocus')).toBeDefined()
    })

    it('should render custom loading icon', () => {
        const wrapper = mount(() => (
            <ErButton loading loadingIcon="loading-custom">Loading</ErButton>
        ))
        const icon = wrapper.findComponent({name: 'ErIcon'})
        expect(icon.exists()).toBe(true)
        expect(icon.props('icon')).toBe('loading-custom')
    })

    it('should render default slot content', () => {
        const wrapper = mount(() => <ErButton>Click me</ErButton>)
        expect(wrapper.text()).toContain('Click me')
    })

    it('should render named loading slot', () => {
        const wrapper = mount({
            components: {ErButton},
            template: `
              <ErButton loading>
                <template #loading>
                  <span class="custom-loading">Loading...</span>
                </template>
              </ErButton>
            `
        })
        expect(wrapper.find('.custom-loading').exists()).toBe(true)
    })

    it('should throttle click handler when useThrottle is true', async () => {
        vi.useFakeTimers()
        const onClick = vi.fn()
        const wrapper = mount(() => <ErButton useThrottle throttleDuration={1000}
                                              onClick={onClick}>Throttled</ErButton>)
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
        const wrapper = mount(() => <ErButton useThrottle={false} onClick={onClick}>NoThrottle</ErButton>)
        await wrapper.trigger('click')
        await wrapper.trigger('click')
        expect(onClick).toHaveBeenCalledTimes(2)
    })
})

describe("ButtonGroup.vue", () => {
    it("basic button group", async () => {
        const wrapper = mount(() => (
            <ButtonGroup>
                <ErButton>button 1</ErButton>
                <ErButton>button 2</ErButton>
            </ButtonGroup>
        ));

        expect(wrapper.classes()).toContain("er-button-group");
    });

    it("button group size", () => {
        const sizes = ["large", "default", "small"];
        sizes.forEach((size) => {
            const wrapper = mount(() => (
                <ButtonGroup size={size as any}>
                    <ErButton>button 1</ErButton>
                    <ErButton>button 2</ErButton>
                </ButtonGroup>
            ));

            const buttonWrapper = wrapper.findComponent(ErButton);
            expect(buttonWrapper.classes()).toContain(`er-button--${size}`);
        });
    });

    it("button group type", () => {
        const types = ["primary", "success", "warning", "danger", "info"];
        types.forEach((type) => {
            const wrapper = mount(() => (
                <ButtonGroup type={type as any}>
                    <ErButton>button 1</ErButton>
                    <ErButton>button 2</ErButton>
                </ButtonGroup>
            ));

            const buttonWrapper = wrapper.findComponent(ErButton);
            expect(buttonWrapper.classes()).toContain(`er-button--${type}`);
        });
    });

    it("button group disabled", () => {
        const _disabled = true
        const wrapper = mount(() => (
            <ButtonGroup disabled={_disabled as boolean}>
                <ErButton>button 1</ErButton>
                <ErButton>button 2</ErButton>
            </ButtonGroup>
        ));

        const buttonWrapper = wrapper.findComponent(ErButton);
        expect(buttonWrapper.classes()).toContain(`is-disabled`);
    });
});

