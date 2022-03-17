import { mount } from '@vue/test-utils';
import { expect, test } from 'vitest';
import HelloWorld from '../components/HelloWorld.vue';

test('mount component', async () => {
  expect(HelloWorld).toBeTruthy();

  const wrapper = mount(HelloWorld, {
    props: {
      msg: 'Hello world!'
    }
  });

  expect(wrapper.html()).toContain('Hello world!');
})
