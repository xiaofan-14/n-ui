<script setup lang="ts">
import {
  inject,
  onMounted,
  reactive,
  toRefs,
  computed,
  onUnmounted,
  ref,
  provide,
  nextTick
} from 'vue'
import {
  FORM_CTX_KEY,
  FORM_ITEM_CTX_KEY
} from './constants'
import {
  filter,
  get,
  includes,
  isNil,
  isString,
  size,
  keys,
  map,
  isArray,
  cloneDeep, some, isNumber, endsWith
} from "lodash-es"
import { useId } from '@learn-ui-to-me/hooks'
import Schema, { type RuleItem } from 'async-validator'
import type {
  FormItemContext,
  FormItemInstance,
  FormItemProps,
  FormItemRule,
  FormValidateCallback,
  FormValidateFailuer,
  ValidateStatus
} from './form'

defineOptions({ name: 'ErFormItem' })

const props = withDefaults(defineProps<FormItemProps>(), {
  required: void 0,
  showMessage: true
})

const slots = defineSlots()
const ctx = inject(FORM_CTX_KEY)

const labelId = useId().value

const validateStatus = ref<ValidateStatus>('init')
const errorMsg = ref('')
const inputIds = ref<string[]>([])

const isDisabled = computed(() => ctx?.disabled || props.disabled)
const isRequired = computed(()=> {
  return ctx?.hideRequiredAsterisk && (some(itemRules.value, 'required') || props.required)
})
const innerVal = computed(() => {
  const model = ctx?.model
  return getValueByProp(model)
})
const propString = computed(() => {
  if (!props.prop) return ''
  return isString(props.prop) ? props.prop : props.prop.join('.')
})
const itemRules = computed(() => {
  const { required } = props
  const rules: FormItemRule[] = []

  if (props.rules) {
    rules.push(...props.rules)
  }
  const formRules = ctx?.rules
  if (formRules && props.prop) {
    const _rules = getValueByProp(formRules)
    if (_rules) {
      rules.push(..._rules)
    }
  }

  if (!isNil(required)) {
    const requiredRules = filter(
      map(rules, (rule, i) => [rule, i]),
      (item: [FormItemRule, number]) => includes(keys(item[0]), 'required')
    )

    if (size(requiredRules)) {
      for (const item of requiredRules) {
        const [rule, i] = item as [FormItemRule, number]
        if (rule.required === required) continue
        rules[i] = { ...rule, required }
      }
    } else {
      rules.push({ required })
    }
  }

  return rules
})
const hasLabel = computed(()=> !!(props.label || slots.lable))
const labelFor = computed(()=>props.for || (inputIds.value.length ? inputIds.value[0] : ''))
const currentLabel = computed(() => `${props.label ?? ''}${ctx?.labelSuffix ?? ''}` )
const normalizeLabelWidth = computed(()=>{
  const _normalizeStyle = (val: number|string) => {
    if(isNumber(val)) return `${val}px`
    return endsWith(val, 'px') ? val : `${val}px`
  }
  if(props.labelWidth) return _normalizeStyle(props.labelWidth)
  if(ctx?.labelWidth) return _normalizeStyle(ctx.labelWidth)
  return '150px'
})

let initialVal: any = null
let isResetting: boolean = false

function getValueByProp(target: Record<string, any> | void){
  if (target && props.prop && !isNil(get(target, props.prop))) {
    return get(target, props.prop)
  }
  return null
}

function getTriggerRules(trigger: string) {
  const rules = itemRules.value
  if (!rules) return []
  return filter(rules, r => {
    if (!r?.trigger || !trigger) return true
    if (isArray(r?.trigger)) return r?.trigger.includes(trigger)
    return r.trigger === trigger
  }).map(({ trigger, ...rule }) => rule as RuleItem)
}

async function doValidate(roles: RuleItem[]) {
  const modelName = propString.value
  const validator = new Schema({ [modelName]: roles })
  return validator.validate(
    { [modelName]: innerVal.value },
    { firstFields: true }
  ).then(() => {
    validateStatus.value = 'success'
    ctx?.emits('validate', props, true, '')
    return true
  }).catch(e => {
    const { error } = e
    validateStatus.value = 'error'
    errorMsg.value = error && size(size) > 0 ? error[0].message : ''
    ctx?.emits('validate', props, false, errorMsg.value)
    return Promise.reject(e)
  })
}

const validate: FormItemInstance['validate'] = async function (
  trigger: string,
  callback?: FormValidateCallback
) {
  if (isResetting || !props.prop || isDisabled.value) return false

  if (!validateStatus.value) {
    callback?.(false)
    return false
  }

  const rules = getTriggerRules(trigger)
  if (!size(rules)) {
    callback?.(true)
    return true
  }

  validateStatus.value = 'validating'
  return doValidate(rules).then(() => {
    callback?.(true)
    return true
  }).catch((err: FormValidateFailuer) => {
    const { errors } = err
    validateStatus.value = 'error'
    errorMsg.value = errors && size(errors) > 0 ? errors[0].message ?? "" : "";
    ctx?.emits("validate", props, false, errorMsg.value);
    return Promise.reject(err);
  })
}

const resetField:FormItemInstance['resetField'] = function (){
  const model = ctx?.model
  if(model && propString.value && !isNil(get(model, propString.value))) {
    isResetting = true
    model[propString.value] = cloneDeep(initialVal)
  }
  nextTick(()=>clearValidate())
}

const clearValidate:FormItemInstance['clearValidate'] = function(){
  validateStatus.value = 'init'
  errorMsg.value = ''
  isResetting = false
}

const addInputId: FormItemContext['addInputId'] = function(id){
  if(!includes(inputIds.value, id)) inputIds.value.push(id)
}

const removeInputId: FormItemContext['removeInputId'] = function(id){
  inputIds.value = filter(inputIds.value, _id => _id !== id )
}

const formItemCtx: FormItemContext = reactive({
  ...toRefs(props),
  disabled: isDisabled.value,
  validate,
  resetField,
  clearValidate,
  addInputId,
  removeInputId
})

onMounted(() => {
  if (!props.prop) return
  ctx?.addField(formItemCtx)
  initialVal = innerVal.value
})

onUnmounted(() => {
  if (!props.prop) return
  ctx?.removeField(formItemCtx)
})

provide<FormItemContext>(FORM_ITEM_CTX_KEY, formItemCtx)

defineExpose<FormItemInstance>({
  validateMessage: errorMsg,
  validateStatus,
  validate,
  resetField,
  clearValidate
})
</script>

<template>
  <div
    class="er-form-item"
    :class="{
      'is-error': validateStatus === 'error',
      'is-disabled': isDisabled,
      'is-required': isRequired,
      'asterisk-left': ctx?.requiredAsteriskPosition === 'left',
      'asterisk-right': ctx?.requiredAsteriskPosition === 'right',
    }"
  >
    <component
      v-if="hasLabel"
      class="er-form-item__label"
      :class="`position-${ctx?.labelPosition ?? 'right'}`"
      :is="labelFor ? 'label' : 'div'"
      :id="labelId"
      :for="labelFor"
    >
      <slot name="label" :label="currentLabel">
        {{ currentLabel }}
      </slot>
    </component>
    <div class="er-form-item__content">
      <slot :validate="validate"></slot>
      <div class="er-form-item__error-msg" v-if="validateStatus === 'error'">
        <template v-if="ctx?.showMessage && showMessage">
          <slot name="error" :error="errorMsg">{{ errorMsg }}</slot>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../style/style.css';

.er-form-item {
  --er-form-label-width: v-bind(normalizeLabelWidth) !important;
}
</style>
