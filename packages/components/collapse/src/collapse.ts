import type { Ref } from "vue"

export type collapseItemName = string | number

export interface collapseProps {
    modelValue?: collapseItemName[];
    accordion?: boolean;
}

export interface collapseItemProps{
    name: collapseItemName;
    title?: string;
    disabled?: boolean;
}

export interface collapseEmits {
    (e: 'update:modelValue', value: collapseItemName[]): void;
    (e: 'change', value: collapseItemName[]): void;
}

export interface collapseContext{
    activeNames: Ref<collapseItemName[]>;
    handleItemClick: (name: collapseItemName) => void;
}