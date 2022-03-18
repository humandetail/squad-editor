import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import PreviewWrapper from '../components/editor/preview/index.vue';

describe('preview wrapper', async () => {
  it('Wrapper is truthy', () => {
    expect(PreviewWrapper).toBeTruthy();
  });

  it('inject:isCollapsed', () => {
    const wrapper = mount(PreviewWrapper, {
      global: {
        provide: {
          isCollapsed: ref(true)
        }
      }
    });

    expect(wrapper.classes()).toContain('collapsed');
  });

  it('inject:inputValue header', () => {
    const wrapper = mount(PreviewWrapper, {
      global: {
        provide: {
          inputValue: ref('# header')
        }
      }
    });

    expect(wrapper.find('h1')?.element).toBeTruthy();
  });

  it('inject:inputValue bold', () => {
    const wrapper = mount(PreviewWrapper, {
      global: {
        provide: {
          inputValue: ref('**Bold**')
        }
      }
    });

    expect(wrapper.find('strong')?.element).toBeTruthy();
  });

  it('inject:inputValue italic', () => {
    const wrapper = mount(PreviewWrapper, {
      global: {
        provide: {
          inputValue: ref('_italic_')
        }
      }
    });

    expect(wrapper.find('em')?.element).toBeTruthy();
  });

  it('inject:inputValue unorderedList', () => {
    const wrapper = mount(PreviewWrapper, {
      global: {
        provide: {
          inputValue: ref('+ unorderedList')
        }
      }
    });

    expect(wrapper.find('ul')?.element).toBeTruthy();
    expect(wrapper.find('li')?.element).toBeTruthy();
  });

  it('inject:inputValue orderedList', () => {
    const wrapper = mount(PreviewWrapper, {
      global: {
        provide: {
          inputValue: ref('1. 2')
        }
      }
    });

    expect(wrapper.find('ol')?.element).toBeTruthy();
    expect(wrapper.find('li')?.element).toBeTruthy();
  });

  it('inject:inputValue link', () => {
    const wrapper = mount(PreviewWrapper, {
      global: {
        provide: {
          inputValue: ref('[link](link.com)')
        }
      }
    });

    expect(wrapper.find('a')?.element).toBeTruthy();
  });

  it('inject:inputValue bold', () => {
    const wrapper = mount(PreviewWrapper, {
      global: {
        provide: {
          inputValue: ref('![img](img.com)')
        }
      }
    });

    expect(wrapper.find('img')?.element).toBeTruthy();
  });

  it('inject:inputValue inlined code', () => {
    const wrapper = mount(PreviewWrapper, {
      global: {
        provide: {
          inputValue: ref('`code`')
        }
      }
    });

    expect(wrapper.find('code')?.element).toBeTruthy();
  });

  it('inject:inputValue blocked code', () => {
    const wrapper = mount(PreviewWrapper, {
      global: {
        provide: {
          inputValue: ref('```\ncode```')
        }
      }
    });

    expect(wrapper.find('code')?.element).toBeTruthy();
  });
});
