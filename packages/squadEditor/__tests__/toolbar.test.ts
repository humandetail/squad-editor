import { mount } from '@vue/test-utils';
import { expect, test } from 'vitest';

import ToolbarWrapper from '../components/toolbar/index.vue';

test('toolbar wrapper', async () => {
  expect(ToolbarWrapper).toBeTruthy();

  const wrapper = mount(ToolbarWrapper, {
    props: {
      canRedo: true,
      canUndo: true
    }
  });

  expect(wrapper.find('.btn-toolbar-item')).toBeTruthy();
});
