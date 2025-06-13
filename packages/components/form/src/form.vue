<script setup lang="ts">
import { provide, reactive, toRefs } from "vue"
import { FORM_CTX_KEY } from "./constants"
import { filter, includes, size, each } from "lodash-es";
import type {
  FormContext,
  FormEmits,
  FormInstance,
  FormItemContext,
  FormProps
} from './form'
import { useNamespace } from '@n-ui/hooks'
import type { ValidateFieldsError } from "async-validator"

const COMPONENT_NAME = 'NForm'

defineOptions({ name: COMPONENT_NAME })

const ns = useNamespace('form')
const props = withDefaults(defineProps<FormProps>(), {
  showMessage: true,
  hideRequiredAsterisk: false,
  labelPosition: 'right'
})

const emits = defineEmits<FormEmits>()

const fields: FormItemContext[] = []

const addField: FormContext['addField'] = function (field) {
  if (!field.prop) return
  fields.push(field)
}

const removeField: FormContext['removeField'] = function (field) {
  if (!field.prop) return
  fields.splice(fields.indexOf(field), 1)
}

async function doValidateField(fields: FormItemContext[] = []) {
  let validateErrors: ValidateFieldsError = {}

  for (const field of fields) {
    try {
      await field.validate('')
    } catch (e) {
      validateErrors = {
        ...validateErrors,
        ...(e as ValidateFieldsError)
      }
    }
  }
  if (!size(Object.keys(validateErrors))) return true
  return Promise.reject(validateErrors)
}

const validateField: FormInstance['validateField'] = async function (keys, callback) {
  try {
    const result = await doValidateField(filterFields(fields, keys ?? []))
    if (result) {
      callback?.(true)
    }
    return result
  } catch (e) {
    if (e instanceof Error) throw e
    const invalidFields = e as ValidateFieldsError
    callback?.(false, invalidFields)
    return Promise.reject(invalidFields)
  }
}

const validate: FormInstance['validate'] = async function (callback) {
  return await validateField([], callback)
}

const resetFields: FormInstance['resetFields'] = function (keys) {
  each(filterFields(fields, keys ?? []), field => field.resetField())
}

const clearValidate: FormInstance['clearValidate'] = function (keys) {
  each(filterFields(fields, keys ?? []), field => field.clearValidate())
}

function filterFields(fields: FormItemContext[], keys: string[]) {
  return size(keys)
    ? filter(fields, filed => includes(keys, filed.prop))
    : fields
}

const formCtx: FormContext = reactive({
  ...toRefs(props),
  emits,
  addField,
  removeField
})

provide(FORM_CTX_KEY, formCtx)

defineExpose<FormInstance>({
  validate,
  validateField,
  resetFields,
  clearValidate
})
</script>

<template>
  <form :class="ns.b()">
    <slot></slot>
  </form>
</template>

<style scoped></style>
