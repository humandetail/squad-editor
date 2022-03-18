import throttle from 'lodash.throttle';

const isWin = typeof window !== 'undefined';

export default () => {
  if (!isWin) return;

  const oInputWrapper = document.querySelector('#J_squad-editor-input-wrapper') as HTMLElement;
  const oPreviewWrapper = document.querySelector('#J_squad-editor-preview-wrapper') as HTMLElement;

  let inputWrapperScrolling = false;
  let previewWrapperScrolling = false;

  if (!oInputWrapper || !oPreviewWrapper) return;

  const handleScroll = throttle((e: Event) => {
    const target = e.target as HTMLElement;

    const isInputWrapper = target === oInputWrapper;

    if (isInputWrapper) {
      inputWrapperScrolling = true;
      if (previewWrapperScrolling) {
        inputWrapperScrolling = false;
        return;
      }
    } else {
      previewWrapperScrolling = true;
      if (inputWrapperScrolling) {
        previewWrapperScrolling = false;
        return;
      }
    }
    const anotherTarget = isInputWrapper ? oPreviewWrapper : oInputWrapper;

    const { height: targetHeight } = target.getBoundingClientRect();
    const { height: anotherWrapperHeight } = anotherTarget.getBoundingClientRect();

    const rate = target.scrollTop / (target.scrollHeight - targetHeight);

    anotherTarget.scroll({
      left: 0,
      top: (anotherTarget.scrollHeight - anotherWrapperHeight) * rate
      // behavior: 'smooth'
    });
  }, 8);

  oInputWrapper.addEventListener('scroll', handleScroll, false);
  oPreviewWrapper.addEventListener('scroll', handleScroll, false);

  oInputWrapper.addEventListener('mouseleave', () => {
    inputWrapperScrolling = false;
  }, false);

  oPreviewWrapper.addEventListener('mouseleave', () => {
    previewWrapperScrolling = false;
  }, false);
}
