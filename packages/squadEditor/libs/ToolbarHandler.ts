import { nextTick } from 'vue';
import { URL_DEFAULT_RIGHT_SIDE } from '../config/constants';
import { SelectionType, ReplaceValueType } from '../types';
import { getBoundingText, getLeftSideText, getLinkOrPictureBoundingText, getRangeText, getRightSideText, isCollapsed } from '../utils/tools';

class ToolbarHandler {
  #replaceValue: ReplaceValueType = () => {};

  #setSelection: (value: SelectionType) => void = () => {};

  #actionsMap: Record<string, any> = {
    heading: this.setHeading,
    bold: this.setBold,
    strikethrough: this.setStrikethrough,
    italic: this.setItalic,
    orderedList: this.setOrderedList,
    unorderedList: this.setUnorderedList,
    code: this.setCode,
    link: this.setLink,
    picture: this.setPicture
  }

  #enterMapper: Record<string, string> = {
    '- [x] ': '- [] ',
    '- [] ': '- [] ',
    '- ': '- ',
    '+ ': '+ '
  }

  constructor (
    replaceValue: ReplaceValueType,
    setSelection: (value: SelectionType) => void
  ) {
    this.#replaceValue = replaceValue;
    this.#setSelection = setSelection;
  }

  /**
   * 清除格式
   * @param value - 原文本
   * @param selection - 选中区
   * @param length - 单侧规则长度
   */
  protected clearRangeTextFormat (value: string, [start, end]: SelectionType, length: number = 0) {
    const rangeText = getRangeText(value, [start, end]);

    this.#setSelection([start - length, end + length]);

    nextTick(() => {
      // 修改后需要恢复之前的选中项
      this.#replaceValue(rangeText, 'select', [start - length, end - length]);
    })
  }

  exec (action: string, oldValue: string, selection: SelectionType) {
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(action)) {
      this.#actionsMap.heading?.call(this, +action.replace('h', ''), oldValue, selection);
      return;
    }
    this.#actionsMap[action]?.call(this, oldValue, selection);
  }

  // 处理回车事件
  async handlerEnterPress (oldValue: string, selection: SelectionType) {
    const [leftSide, leftSideRangeStart] = getLeftSideText(oldValue, selection);
    const match = leftSide.match(/^(-\s{1}\[x?\]|-|\+|\d+\.)\s{1}?/);

    if (!match) {
      this.#replaceValue('\n', 'end');
      return;
    }

    const ruleText = match[0];

    const [rightSide, _rightSideRangeEnd] = (
      // 光标正处理规则开始的地方
      // leftSideRangeStart + ruleText.length === selection[0]
      //   ? oldValue.substring(selection[1], selection[1] + 1)
      //   : oldValue.substring(leftSideRangeStart + ruleText.length, leftSideRangeStart + ruleText.length + 1)
      leftSideRangeStart + ruleText.length === selection[0]
        ? getRightSideText(oldValue, [selection[1], selection[1]])
        : getRightSideText(oldValue, [leftSideRangeStart + ruleText.length, leftSideRangeStart + ruleText.length])
    );

    // 清空规则
    if (!rightSide || rightSide === '\n') {
      this.#setSelection([leftSideRangeStart, selection[1]]);
      await nextTick();
      this.#replaceValue('', 'end');
      return;
    }

    if (/^\d+/.test(ruleText)) {
      this.#replaceValue(`\n${+ruleText.split('.')[0] + 1}. `, 'end');
      return;
    }

    this.#replaceValue(`\n${this.#enterMapper[ruleText]}`, 'end');
  }

  /**
   * 设置对称规则文本
   * @param symbol - 规则符号
   * @param value - 原文本
   * @param selection - 当前选中区
   */
  protected setSymmetricalRuleText (symbol: string, value: string, selection: SelectionType) {
    const symbolLength = symbol.length;
    const boundingText = getBoundingText(value, selection, symbolLength);

    const reversedSymbol = symbol.split('').reverse().join('');

    if (
      (
        symbol === '```\n' ||
        (!boundingText[0].includes('\n') && !boundingText[1].includes('\n'))
      ) &&
      boundingText[0] === symbol &&
      boundingText[1] === reversedSymbol
    ) {
      // 正处理当前设置格式内部，清除当前格式
      this.clearRangeTextFormat(value, selection, symbolLength);
      return;
    }

    if (isCollapsed(selection)) {
      this.#replaceValue(symbol + reversedSymbol, 'end', [selection[0] + symbolLength, selection[0] + symbolLength]);
    } else {
      const rangeText = getRangeText(value, selection);
      const start = selection[0] + symbolLength;
      this.#replaceValue(`${symbol}${getRangeText(value, selection)}${reversedSymbol}`, 'select', [start, start + rangeText.length])
    }
  }

  /**
   * 设置单侧规则文本
   * @param symbol - 规则符号
   * @param value - 原文本
   * @param selection - 当前选中区
   */
  setUnilateralRuleText (symbol: string, value: string, selection: SelectionType) {
    const symbolLength = symbol.length + 1; // 单侧规则都需要带一个空格检测
    const [leftSide, rangeStart] = getLeftSideText(value, selection);

    if (!leftSide) {
      this.#replaceValue(symbol + ' ', 'end');
      return;
    }

    if (leftSide.startsWith(symbol + ' ')) {
      // this.clearUnilateralFormat(selection, symbol + ' ');
      const newSelection: SelectionType = [rangeStart, rangeStart + symbolLength];
      this.#setSelection(newSelection);
      nextTick(() => {
        this.#replaceValue('', 'end', [selection[0] - symbolLength, selection[1] - symbolLength])
      })
      return;
    }

    const newSelection: SelectionType = [rangeStart, selection[1]];
    this.#setSelection(newSelection);
    nextTick().then(() => {
      this.#replaceValue(`${symbol + ' '}${getRangeText(value, newSelection)}`, 'select', [selection[0] + symbolLength, selection[1] + symbolLength]);
    });
  }

  /**
   * 标题
   * @param level
   * @param value
   * @param selection
   * @example
   * # [value]
   * ## [value]
   * ### [value]
   * #### [value]
   * ##### [value]
   * ###### [value]
   */
  protected setHeading (level: number, value: string, selection: SelectionType) {
    this.setUnilateralRuleText('#'.repeat(level), value, selection);
  }

  /**
   * 下划线
   * @param value
   * @param selection
   * @example
   * ~~[value]~~
   */
  protected setStrikethrough (value: string, selection: SelectionType) {
    this.setSymmetricalRuleText('~~', value, selection);
  }

  /**
   * 文本加粗
   * @param value
   * @param selection
   * @example
   * **[value]**
   */
  protected setBold (value: string, selection: SelectionType) {
    this.setSymmetricalRuleText('**', value, selection);
  }

  /**
   * 斜体
   * @param value
   * @param selection
   * @example
   * _[value]_
   */
  protected setItalic (value: string, selection: SelectionType) {
    this.setSymmetricalRuleText('_', value, selection);
  }

  /**
   * 代码块
   * @param value
   * @param selection
   * @example
   * `[value]`
   * ```\n[value]\n```
   */
  protected setCode (value: string, selection: SelectionType) {
    const rangeText = getRangeText(value, selection);

    const isMultiRow = rangeText.includes('\n');
    this.setSymmetricalRuleText(
      isMultiRow ? '```\n' : '`',
      value,
      selection
    )
  }

  protected setLink (value: string, [start, end]: SelectionType) {
    const rangeText = getRangeText(value, [start, end]);

    const [leftSide, rightSide] = getLinkOrPictureBoundingText(value, [start, end]);

    // 清除链接格式
    if (leftSide === '[' && rightSide === URL_DEFAULT_RIGHT_SIDE) {
      const newSelection: SelectionType = [start - 1, end + URL_DEFAULT_RIGHT_SIDE.length];
      this.#setSelection(newSelection);
      nextTick(() => {
        this.#replaceValue(rangeText, 'end', [start - 1, end - 1])
      })
      return;
    }

    // 选中文本时，替换后让选中区域为 `url`
    // 未选中文本时，替换后让选中区域为 `选中文本`
    this.#replaceValue(
      `[${rangeText}](url)`,
      'select',
      !rangeText
        ? [start + 1, end + 1]
        : [end + '['.length + ']('.length, end + '['.length + ']('.length + 'url'.length]
    );
  }

  protected setPicture (value: string, [start, end]: SelectionType) {
    const rangeText = getRangeText(value, [start, end]);

    const [leftSide, rightSide] = getLinkOrPictureBoundingText(value, [start, end], 'picture');

    // 清除链接格式
    if (leftSide === '![' && rightSide === URL_DEFAULT_RIGHT_SIDE) {
      const newSelection: SelectionType = [start - 2, end + URL_DEFAULT_RIGHT_SIDE.length];
      this.#setSelection(newSelection);
      nextTick(() => {
        this.#replaceValue(rangeText, 'end', [start - 2, end - 2])
      })
      return;
    }

    // 选中文本时，替换后让选中区域为 `url`
    // 未选中文本时，替换后让选中区域为 `选中文本`
    this.#replaceValue(
      `![${rangeText}](url)`,
      'select',
      !rangeText
        ? [start + 2, end + 2]
        : [end + '!['.length + ']('.length, end + '!['.length + ']('.length + 'url'.length]
    );
  }

  protected async setOrderedList (value: string, selection: SelectionType) {
    const [leftSide, leftSideRangeStart] = getLeftSideText(value, selection);
    if (/^\d+\.\s{1}/.test(leftSide)) {
      // 处于有序列表规则之内
      this.#setSelection([leftSideRangeStart, leftSide.length]);
      await nextTick();
      this.#replaceValue('', 'end', [selection[0] - leftSide.length, selection[1] - leftSide.length]);
      return;
    }

    this.setUnilateralRuleText('1.', value, selection);
  }

  protected setUnorderedList (value: string, selection: SelectionType) {
    this.setUnilateralRuleText('-', value, selection);
  }
}

export default ToolbarHandler;
