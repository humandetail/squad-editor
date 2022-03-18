import { Ref, ref, UnwrapRef } from 'vue';

const useState = <T>(initialValue: T): [Ref<UnwrapRef<T>>, (value: UnwrapRef<T>) => void] => {
  const state = ref<T>(initialValue);

  const setState = (value: UnwrapRef<T>) => {
    state.value = value;
  }

  return [state, setState];
}

export default useState;
