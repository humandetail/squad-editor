import type { InjectionKey, Ref } from 'vue'
import type { SelectionType } from '../types'

type handler<T> = (value: T) => void
type isCollapsedType = Ref<boolean>
type setIsCollapseType = handler<boolean>

type inputValueType = Ref<string>
type setInputValueType = handler<string>

type selectionType = Ref<SelectionType>
type setSelectionType = handler<number[]>

type handleKeyDownType = handler<KeyboardEvent>
type handlePasteType = handler<ClipboardEvent>

export const isCollapsedKey: InjectionKey<isCollapsedType> = Symbol('isCollapsed')
export const setIsCollapseKey: InjectionKey<setIsCollapseType> = Symbol('setIsCollapsed')

export const inputValueKey: InjectionKey<inputValueType> = Symbol('inputValue')
export const setInputValueKey: InjectionKey<setInputValueType> = Symbol('setInputValue')

export const selectionKey: InjectionKey<selectionType> = Symbol('selection')
export const setSelectionKey: InjectionKey<setSelectionType> = Symbol('setSelection')

export const handleKeyDownKey: InjectionKey<handleKeyDownType> = Symbol('handleKeyDown')
export const handlePasteKey: InjectionKey<handlePasteType> = Symbol('handlePaste')
