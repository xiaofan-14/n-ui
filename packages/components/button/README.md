# Button

## 预设类型 `button.ts`

### type

在按钮类型定义中提供一下类型，不同的类型对应到最终 `css` 会渲染不同的样式来提示用户

- primary 主要样式
- default 默认样式
- success 成功样式
- warning 警告样式
- danger  危险样式

### 原生类型

html5 中按钮标签的原生特性

- submit 提交表单
- reset 重置表单
- button 默认的属性

### 大小

在大小上提供了3种预设，分别是

- small 小
- default 默认
- large 大

### Props

定义好一些基础的 `type` 后，我们来定义按钮组件的 `props`。

在开发中，使用按钮时，我们可能会各种需求通过 `props` 传递，为了方便用户使用，会定义较多的属性

```ts
interface ButtonProps {
  // 渲染dom后唯一的标识符
  id?: string
  // 渲染的标签类型
  tag?: string | VNode
  // 按钮样式类型
  type?: ButtonType
  // 按钮尺寸
  size?: ButtonSize
  // 左侧图标，可以是图标名或 VNode
  icon?: string | VNode
  // 右侧图标，可以是图标名或 VNode
  suffixIcon?: string | VNode
  // 是否显示加载状态
  loading?: boolean
  // 是否禁用按钮
  disabled?: boolean
  // 是否为朴素按钮
  plain?: boolean
  // 是否开启点击节流
  debounce?: boolean
  // 是否为圆形按钮
  circle?: boolean
  // 是否为圆角按钮
  round?: boolean
  // 是否自动聚焦
  autofocus?: boolean
  // 是否启用节流
  useThrottle?: boolean
  // 若为 a 标签时生效的跳转链接
  href?: string
  // 自定义加载状态下的图标
  loadingIcon?: string
  // 节流延迟时间
  throttleDuration?: number
  // 原生 HTML 按钮类型
  nativeType?: NativeType
}
```

对于 `防抖` 和 `节流` 不了解可以看一下 [防抖和节流](https://vue3js.cn/interview/JavaScript/debounce_throttle.html)

### 事件

使用按钮处理最多的事件就是单击事件，为了方便使用，我们也需要定义事件的类型

```ts

/**
 * 触发方式 - click
 * 触发类型 - 鼠标事件
 * 返回值  - void
 */
type ButtonEmits = {
  (event: 'click', evt: MouseEvent): void
}
```

### 导出实例

按钮实例定义
- ref 提供对原生 \<button> DOM 元素的直接访问能力
- disabled 反映当前按钮是否处于禁用状态
- size 提供当前按钮的尺寸信息
- type 暴露按钮类型

```ts
interface ButtonInstance {
  ref: Ref<HTMLButtonElement | void>
  disabled: ComputedRef<boolean>
  size: ComputedRef<ButtonSize | ''>
  type: ComputedRef<ButtonType | ''>
}
```

## SFC组件

### 模板

处理模板时，我们需要根据props来思考如何设计模板的结构和处理条件渲染， 例如需要根据 `tag` 来决定标签的类型和加载状态、前缀和后缀图标

对于 `tag` 我们使用 vue 提供的 `component` 内建组件来渲染不同的标签
对于不同的图标状态，使用 `v-if` 条件渲染指令来处理

```vue
<!--基础结构-->
<script>
  const { tag, loading, icon, suffixIcon } = defineProps()
</script>
<template>
  <component :is="tag">
    <template v-if="loading">
      <!-- 图标组件 -->
      <icon />
    </template>
    <!-- 前缀图标 -->
    <icon v-if="icon" />
    <!-- 按钮组件的内容 -->
    <slot />
    <!-- 后缀图标 -->
    <icon v-if="suffixIcon" />
  </component>
</template>
```

### 脚本

有了基础模板，我们来处理 `script` 中的内容。vue3 主推组合式api的风格，所以我们也使用这样的风格

在 `setup` 语法中更推荐使用 `defineOptions`、 `defineProps`、`defineEmits` 和 `defineExpose`
等编译宏方法来定义组件名、props、emits、导出实例

首先来处理组件需要的 props。在这里需要考虑几个基础默认值，避免用户没有设置出现错误

在 vue3 + TS 中使用 `setup` 时，需要使用 `withDefaults` 函数来配合 `defineProps` 用于为 `props` 设置默认值

对于 `emits` 的处理，使用 `defineEmits` 定义即可

```vue
<script setup lang="ts">
  import type { ButtonProps, ButtonEmits, ButtonInstance } from './src/button.ts'

  defineOptions({name: 'NButton'})

  const props = withDefaults(defineProps<ButtonProps>(), {
    // 默认渲染 button 标签
    tag: 'button',
    // 默认的类似是 primary
    type: 'primary',
    // 默认原生标签属性是 button
    nativeType: 'button',
    // 是否开启节流
    useThrottle: true,
    // 节流的默认延时
    throttleDuration: 300,
  })

  const emits = defineEmits<ButtonEmits>()

  // 暂时没有定义导出的参数，使用虚假值模拟
  defineExpose<ButtonInstance>({
    ref: null,
    disabled: false,
    size: 'small',
    type: 'success'
  })
</script>
```

定义好基础属性后，我们来处理按钮的事件，自定义样式等。为了更好和模板视图分离，我们创建一个 `useButton.ts` 文件

将按钮的状态、大小、类型、props处理在 `.ts` 文件中完成，vue组件直接使用

在这之前，我们还需要定义一个常量，用于在按钮组和按钮之间依赖注入使用， 同时需要完善 `button.ts`，添加对按钮组的props和上下文定义

```ts
// ...

/**
 * 按钮组属性
 *    size: 按钮组下每个按钮的大小
 *    type: 按钮组下每个按钮的类型
 *    disabled: 是否禁用按钮
 */
export interface ButtonGroupProps {
  size?: ButtonSize,
  type?: ButtonType,
  disabled?: boolean
}

/**
 * 按钮组实例上下文，通过依赖注入在按钮中使用
 */
export interface ButtonGroupContext {
  size?: ButtonSize,
  type?: ButtonType,
  disabled?: boolean
}
```

有了按钮组的上下文信息，我们就可以定义一个唯一的key，这里我们使用 `Symbol` 因为它是唯一的
同时使用vue提供的 `InjectionKey` 去约束依赖注入上下文的类型

```ts
import type { InjectionKey } from 'vue'
import type { ButtonGroupContext } from './button.ts'

export const BUTTON_GROUP_CTX:InjectionKey<ButtonGroupContext> =
  Symbol('BUTTON_GROUP_CTX')
```

有了一个唯一的依赖注入key后，就可以定义 `useButton` 中的逻辑了

```ts
import {computed, inject} from "vue"

function useButton(props, emits) {
  // 首先，我们需要获取一下使用按钮的上下文，因为按钮可能在按钮组和表单中使用，
  // 这时需要继承使用它们提供的属性, 如果没有提供，我们使用 void 0 来返回一个 undefined
  const ctx = inject(BUTTON_GROUP_CTX, void 0)

  // 还需要处理按钮在表单中使用时的场景
  // useFormItem 和 formItem 在后面的表单中会介绍，
  // 这个函数主要是基于表单和表单项的依赖注入返回对于表单或表单项提供的一些api、属性等，例如检查表单校验
  const {formItem} = useFormItem()

  // 有了上下文信息，我们就可以计算大小、类型、props这些属性了
  // 对于这些属性，我们直接判断上下文上或者props是否提供对应的值
  const _size = computed(()=> {
    return ctx?.size ?? props?.size ?? ''
  })
  const _type = computed(()=>{
    return ctx?.type ?? props?.type ?? ''
  })
  // 获取按钮是否禁用时，我们使用表单提供的 useFormDisabled
  // 它会检查上下文和props是否禁用按钮, 将按钮组上下文提供的禁用属性通过参数传入
  const _disabled = useFormDisabled(ctx?.disabled)
  // 对于组件实例插槽，我们使用vue提供的api定义就行，不用处理它们的值
  // 实例
  const _ref = ref<HTMLButtonElement>()
  // 插槽 useSlots 是一个运行时函数，它会在运行时访问插槽对象获取插槽内容
  // 详见 https://cn.vuejs.org/api/composition-api-helpers#useslots
  const slots = useSlots()
  // 接下来，我们定义 props 我们需要考虑 按钮 a标签 默认这三种情况
  const _props = computed(() => {
    // 如果 tag 是 'button' 我们提供：id 自动聚焦 类型 是否禁用 这几个属性
    if (props.tag === 'button') {
      return {
        id: props.id,
        autofocus: props.autofocus,
        type: props.tag === 'button' ? props.nativeType : void 0,
        disabled: _disabled.value || props.loading ? true : void 0
      }
    }
    // 如果是 a标签，我们提供 href 用于跳转就行
    if(props.tag === 'a'){
      return {
        href: props.href,
      }
    }
    // 默认时，返回一个空对象就行
    return {}
  })
  // 处理好props属性后，我们来处理点击事件
  // 处理事件时，如果禁用或加载状态，我们不处理任何行为，直接返回
  // 如果时 reset，使用表单提供的重置
  // 对于默认情况，使用 emits 来触发用户委托我们执行的逻辑
  function handleClick(evt: MouseEvent) {
    // 如果没有禁用，并且没有出入加载状态
    if (_disabled.value || props.loading) {
      evt.stopPropagation()
      return
    }
    // 如果是表单的 reset 执行表单提供的 resetField 方法来重置表单中的输入
    if (props.nativeType === 'reset') {
      formItem?.resetField()
    }
    // 通过 emit 触发点击
    emits('click', evt)
  }
  // 然后，我们通过闭包返回这些属性，这样每次访问都是一个私有变量，它们不会互相影响
  return {
    _size,
    _type,
    _disabled,
    _ref,
    slots,
    _props,
    handleClick,
  }
}
```

有了按钮的属性事件后，我们可以继续完善模板。这里我直接使用最终的实现效果了

```vue
<component
  :is="tag"
  ref="_ref"
  v-bind="_props"
  :class="buttonKls"
  @click="(e: MouseEvent) => useThrottle ? handleBtnClickThrottle(e) : handleBtnClick(e)"
>
  <!--  only loading -->
  <template v-if="loading">
    <slot name="loading">
      <n-icon
        class="loading-icon"
        :icon="loadingIcon ?? 'spinner'"
        spin
        :style="iconStyle"
        size="1x"
      />
    </slot>
  </template>

  <n-icon v-if="icon && !loading" :icon="icon" size="1x" :style="iconStyle"/>
  <slot></slot>
  <n-icon v-if="suffixIcon && !loading" :icon="suffixIcon" size="1x" :style="iconStyle"/>
</component>
```

同时按钮的圆角、原型、禁用、朴素按钮等等，每个属性都需要动态计算类名，如果写在模板上会更难维护也不利于查看，所以我们定义一个 `useButtonCustom.ts` 来处理自定义样式

在这里首先要介绍一下 css 的 `BEM`,即 Block（块）、Element（元素）、和 Modifier（修改器）的简称，使用这种方式定义的类名更方便维护阅读

这里我们使用 `packages/hooks/useNamespace.ts` 来处理, 后面再介绍具体的实现

```ts
// 在 useButtonCustom 中我们传入一个 button 标识我们的 namespace 是在 button 下，
// 接下来生成的类名都会是 n-button-xxx 这样的
const ns = useNamespace('button')

const buttonKls = computed(() => [
  ns.b(),
  type.value && ns.m(type.value),
  size.value && ns.m(size.value),
  ns.is('disabled', disabled.value),
  ns.is('loading', props.loading),
  ns.is('plain', props.plain),
  ns.is('round', props.round),
  ns.is('circle', props.circle)
])
// 这里主要是计算按钮的边距，按钮在左右不同位置时，它们需要的边框方向也不一样
const iconStyle = computed(() => {
  const marginValue = slots.default ? '6px' : '0px'
  return {
    ...(props.icon && {marginRight: marginValue}),
    ...(props.suffixIcon && {marginLeft: marginValue})
  }
})

return {
  buttonKls,
  iconStyle
}
```

这样，在模板中直接动态绑定class就行。

在处理事件时，需要考虑是否开启节流所以我们定义两个函数来辅助我们

```ts
function handleBtnClick(evt: MouseEvent) {
  handleClick(evt)
}

const handleBtnClickThrottle = throttle(handleBtnClick, props.throttleDuration, {trailing: false})
```

> 完整实现见代码，全部贴出来太长了

# 按钮组

有了按钮后，按钮组就好定义了，按钮组中主要是多个按钮，我们使用插槽处理传入的按钮就行

```vue
<script setup lang="ts">
import {provide, reactive, toRef} from 'vue'
import {BUTTON_GROUP_CTX} from "./contants"
import {useNamespace} from "@n-ui/hooks"
import type {ButtonGroupProps} from "./button"

defineOptions({name: 'NButtonGroup'})

const props = defineProps<ButtonGroupProps>()

const ns = useNamespace('button')
// 这里需要通过依赖注入为按钮提供上下文信息，让按钮使用相同的大小 type 是否禁用属性
provide(
  BUTTON_GROUP_CTX,
  reactive({
    size: toRef(props, 'size'),
    type: toRef(props, 'type'),
    disabled: toRef(props, 'disabled')
  })
)
</script>

<template>
  <div :class="ns.b('group')">
    <slot></slot>
  </div>
</template>
```

# 导出安装

> 什么时 [插件](https://cn.vuejs.org/guide/reusability/plugins#introduction)

为了能够让vue通过插件的方式安装使用，我们需要使用install方法安装到vue实例的component上

见 `packages/utils/install.ts` 中 `withInstall` 的定义，它会返回一个可安装的插件

在 `index.ts` 中导出

```ts
import Button from './src/button.vue'
import ButtonGroup from "./src/buttonGroup.vue"
import { withInstall } from "@n-ui/utils"

export const NButton = withInstall(Button)
export const NButtonGroup = withInstall(ButtonGroup)
```
