<script setup lang="ts">
import {reactive, ref} from "vue"
import {
  NButton,
  NButtonGroup,
  NIcon,
  NMessage,
  NForm,
  NFormItem,
  NInput,
  NSwitch,
  NSelect,
} from 'n-ui-mini'
import type {FormInstance} from "n-ui-mini"

function handleBtnClick() {
  NMessage.info("btn click");
}

const formRef = ref<FormInstance>();
const form = reactive({
  name: "",
  region: "",
  delivery: false,
  desc: "",
});

const options = ref([
  { value: "beijing", label: "Zone One" },
  { value: "shanghai", label: "Zone Two" },
]);

const rules = reactive({
  name: [
    { required: true, message: "请输入活动名称", trigger: "blur" },
    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "change" },
  ],
  region: [{ required: true, message: "请选择活动区域", trigger: "change" }],
  desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
});

const onSubmit = () => {
  formRef.value?.validate().then((valid: boolean) => {
    if (valid) {
      NMessage.success("submit!");
    }
  });
};

const onReset = () => {
  formRef.value?.resetFields();
};
</script>

<template>
  <p>
    <n-button :disabled="true">Default</n-button>
    <n-button type="primary">Primary</n-button>
    <n-button type="success" plain>Success</n-button>
    <n-button type="info" round>Info</n-button>
    <n-button type="warning" icon="star" circle/>
    <n-button type="primary" loading>
      <template #loading>
        <n-icon style="margin-right: 6px" icon="star" spin/>
      </template>
      Loading
    </n-button>
  </p>
  <p>
    <n-button-group disabled>
      <n-button type="primary" icon="arrow-left">Previous Page</n-button>
      <n-button type="primary">
        Next Page
        <n-icon icon="arrow-right" style="margin-left: 8px"/>
      </n-button>
    </n-button-group>
  </p>
  <p>
    <n-button size="large" round>Large</n-button>
    <n-button round>Default</n-button>
    <n-button size="small" round>Small</n-button>
    <n-button size="large" icon="search" round>Search</n-button>
    <n-button icon="search" round>Search</n-button>
    <n-button size="small" icon="search" round>Search</n-button>
  </p>
  <p>
    <n-button>button</n-button>
    <n-button tag="div" role="button" tabindex="0">div</n-button>
    <n-button
      type="primary"
      tag="a"
      href="https://www.baidu.com"
      target="_blank"
      rel="noopenn norefnrn"
    >
      a
    </n-button>
  </p>
  <p>
    <n-button @click="handleBtnClick"> with throttle</n-button>
    <n-button :use-throttle="false" @click="handleBtnClick">without throttle</n-button>
  </p>

  <p>
    <n-form ref="formRef" :model="form" :rules="rules">
      <n-form-item label="Activity name" prop="name">
        <n-input v-model="form.name" />
      </n-form-item>
      <n-form-item label="Activity zone" prop="region">
        <n-select
          v-model="form.region"
          placeholdn="please select your zone"
          :options="options"
        />
      </n-form-item>
      <n-form-item label="Instant delivny" prop="delivny">
        <n-switch v-model="form.delivery" />
      </n-form-item>
      <n-form-item label="Activity form" prop="desc">
        <n-input v-model="form.desc" type="textarea" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSubmit">Create</n-button>
        <n-button @click="onReset">Reset</n-button>
      </n-form-item>
    </n-form>
  </p>
</template>
