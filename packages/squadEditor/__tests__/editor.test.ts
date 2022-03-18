import { DOMWrapper, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import SquadEditor from '..';

const checkInput = ({ inputComp, outputComp, input, expectDom }: {
  inputComp: DOMWrapper<Element>;
  outputComp: DOMWrapper<Element>;
  input: string;
  expectDom: string;
}) => {
  inputComp.setValue(input);
  nextTick().then(() => {
    expect(outputComp.find(expectDom)).toBeTruthy();
  })
}

const checkKeydownClear = async ({
  inputComp,
  inputElement,
  input
}: {
  inputComp: DOMWrapper<Element>;
  inputElement: HTMLTextAreaElement;
  input: string;
}) => {
  inputComp.setValue(input);
  await nextTick();
  await inputComp.trigger('keydown.enter');
  await nextTick();
  expect(inputElement.value).toBeFalsy();
}

describe('squad editor', () => {
  expect(SquadEditor).toBeTruthy();

  it('should converted to markdown', async () => {
    const wrapper = mount(SquadEditor, {
      props: {
        value: 'Welcome'
      }
    });

    expect(wrapper.emitted('update:value')![0]).toEqual(['Welcome']);

    const inputComp = wrapper.find('#J_squad-editor-input-wrapper');
    const outputComp = wrapper.find('#J_squad-editor-preview-wrapper');

    [
      ['# header', 'h1'],
      ['## header', 'h2'],
      ['### header', 'h3'],
      ['#### header', 'h4'],
      ['##### header', 'h5'],
      ['###### header', 'h6'],
      ['_italic_', 'em'],
      ['**bold**', 'strong'],
      ['~~~~', 'del'],
      ['[text](link)', 'a'],
      ['![text](link)', 'img'],
      ['+ list', 'ul'],
      ['+ list', 'li'],
      ['1. list', 'ol'],
      ['1. list', 'li'],
      ['`code`', 'code'],
      ['```code\n```', 'code'],
      ['```code\n```', 'pre'],
      ['||||\n||||\n||||', 'table']
    ].forEach(([input, expectDom]) => {
      checkInput({
        inputComp,
        outputComp,
        input,
        expectDom
      });
    });
  });

  it('should clear current row when keydown.enter', async () => {
    const wrapper = mount(SquadEditor, {
      props: {
        value: ''
      }
    });

    const inputComp = wrapper.find('#J_squad-editor-input-wrapper');

    const inputElement = inputComp.element as HTMLTextAreaElement;

    const rules = [
      '- ',
      '+ ',
      '1. ',
      '- [] ',
      '- [x] '
    ];

    for (let i = 0; i < rules.length; i++) {
      await checkKeydownClear({
        inputComp,
        inputElement,
        input: rules[i]
      });
    }
  });

  it('sholud input value equal props.tabKey when keydown.tab', async () => {
    const tabKey = '    ';
    const wrapper = mount(SquadEditor, {
      props: {
        value: '',
        tabKey
      }
    });

    const inputComp = wrapper.find('#J_squad-editor-input-wrapper');

    const inputElement = inputComp.element as HTMLTextAreaElement;
    await inputComp.trigger('keydown.tab');
    await nextTick();
    expect(inputElement.value === tabKey).toBeTruthy();
  });
});
