import { URL_DEFAULT_RIGHT_SIDE } from '../config/constants';
import { SelectionType } from '../types';

export function isCollapsed ([start, end]: SelectionType) {
  return start === end;
}

export function getRangeText (value: string, [start, end]: SelectionType) {
  return value.substring(start, end);
}

export function getBoundingText (value: string, selection: SelectionType, length: number = 0) {
  const start = selection[0] - length > 0 ? selection[0] - length : 0;
  const end = selection[1];

  return [
    value.substring(start, start + length),
    value.substring(end, end + length)
  ]
}

export function getLinkOrPictureBoundingText (value: string, selection: SelectionType, linkOrPicture: 'link' | 'picture' = 'link') {
  const len = linkOrPicture === 'link' ? 1 : 2;
  const start = selection[0] > 0 ? selection[0] - len : 0;
  const end = selection[1];

  return [
    value.substring(start, start + len),
    value.substring(end, end + URL_DEFAULT_RIGHT_SIDE.length)
  ]
}

export function getLeftSideText (value: string, selection: SelectionType): [string, number] {
  let [start] = selection;
  if (start <= 0) return ['', start];

  let leftSide = '';

  while (!leftSide.startsWith('\n') && start > 0) {
    leftSide = value.substring(--start, selection[1]);
  }

  return leftSide.startsWith('\n') ? [leftSide.substring(1), start + 1] : [leftSide, start];
}

export function getRightSideText (value: string, selection: SelectionType): [string, number] {
  let [, end] = selection;
  if (end >= value.length) return ['', end];

  let rightSide = '';

  while (!rightSide.endsWith('\n') && end < value.length) {
    rightSide = value.substring(selection[1], ++end);
  }

  return rightSide.endsWith('\n') ? [rightSide.substring(0, end - 1), end - 1] : [rightSide, end];
}

export function isCtrlKeyDown (e: KeyboardEvent) {
  return e.metaKey || e.ctrlKey;
}
