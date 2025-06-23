import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Form from '../src/form.vue'
import FormItem from '../src/formItem.vue'
import {defineComponent, nextTick, reactive, ref} from 'vue'

describe('Form.vue', () => {
  it('renders slot content', () => {
    const wrapper = mount(Form, {
      props: {
        model: {}
      },
      slots: {
        default: '<div class="slot-content">content</div>'
      },
    })
    expect(wrapper.find('.slot-content').exists()).toBe(true)
  })
  it('calls addField/removeField on FormItem mount/unmount', async () => {
    const show = ref(true)
    const model = reactive({ name: 'john' })

    const wrapper = mount(defineComponent({
      components: { NForm: Form, NFormItem: FormItem },
      setup() {
        return { show, model }
      },
      template: `
        <NForm ref="form" :model="model">
          <NFormItem v-if="show" prop="name" />
        </NForm>
      `
    }))

    const formWrapper = wrapper.findComponent(Form)
    const form = formWrapper.vm as any

    expect(form.fields.length).toBe(1)

    show.value = false
    await wrapper.vm.$nextTick()

    expect(form.fields.length).toBe(0)
  })
})


describe('FormItem', () => {
  it('displays label and error', async () => {
    const model = reactive({ name: '' })
    const wrapper = mount(Form, {
      props: {
        model,
        rules: {
          name: [{ required: true, message: 'name required', trigger: 'blur' }]
        }
      },
      slots: {
        default: `<NFormItem label="姓名" prop="name">
                    <input />
                  </NFormItem>`
      },
      global: {
        components: { NFormItem: FormItem }
      }
    })

    const itemWrapper = wrapper.findComponent(FormItem)

    let result = true
    try {
      await (itemWrapper.vm as any).validate('blur')
    } catch (err: any) {
      result = false
      expect(err.errors?.[0]?.message).toBe('name required')
    }

    expect(result).toBe(false)
    expect(itemWrapper.find('.n-form-item__error-msg').text()).toBe('name required')
  })

  it('resetField restores initial value', async () => {
    const model = reactive({ age: 25 })
    const wrapper = mount(Form, {
      props: { model },
      slots: {
        default: `<NFormItem label="年龄" prop="age">
                    <input />
                  </NFormItem>`
      },
      global: {
        components: { NFormItem: FormItem }
      }
    })

    const item = wrapper.findComponent(FormItem)
    model.age = 99
    ;(item.vm as any).resetField()
    await nextTick()
    expect(model.age).toBe(25)
  })
})

