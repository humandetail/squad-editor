import { nextTick } from 'vue';
import { FileUploadActionType, FileUploadResponseType, ReplaceValueType, SelectionType } from '../types';

class Uploader {
  #replaceValue: ReplaceValueType = () => {};

  #setSelection: (value: SelectionType) => void = () => {};

  #getSelection: () => SelectionType = () => [0, 0];

  #getValue: () => string = () => '';

  #uploadingFiles: string[] = [];

  #uploader: FileUploadActionType = (_file: File) => Promise.resolve({ name: '', url: '' });

  constructor (
    replaceValue: ReplaceValueType,
    setSelection: (value: SelectionType) => void,
    getSelection: () => SelectionType,
    getValue: () => string,
    uploader?: FileUploadActionType
  ) {
    this.#replaceValue = replaceValue;
    this.#setSelection = setSelection;
    this.#getSelection = getSelection;
    this.#getValue = getValue;

    if (uploader) {
      this.#uploader = uploader;
    }
  }

  async requestUpload (files: FileList) {
    let file: File;
    const len = files.length;
    for (let i = 0; i < len; i++) {
      file = files[i];
      await nextTick();

      this.#replaceValue(`\n![Uploading ${file.name}]()\n`, 'end');

      if (this.#uploadingFiles.includes(file.name)) continue;
      this.#uploadingFiles = [...new Set([...this.#uploadingFiles, file.name])];

      this.#uploader(file)
        .then((res) => {
          this.uploaded(res, file.name)
        })
    }
  }

  async uploaded (res: FileUploadResponseType, name: string) {
    const cachedSelection = this.#getSelection();
    const value = this.#getValue();

    // 选中区左侧数据
    const currentLeftSideValue = value.substring(0, cachedSelection[0]);
    // 选中区数据
    const currentSelectionValue = value.substring(...cachedSelection);
    // 选中区右侧数据
    const currentRightSizeValue = value.substring(cachedSelection[1]);

    // 替换数据
    const newLeftSideValue = currentLeftSideValue.replaceAll(`![Uploading ${name}]()`, `<img src="${res.url}" alt="${res.name}" />`);
    const newRightSideValue = currentRightSizeValue.replaceAll(`![Uploading ${name}]()`, `<img src="${res.url}" alt="${res.name}" />`);

    const newSelection: SelectionType = [
      cachedSelection[0] + (newLeftSideValue.length - currentLeftSideValue.length),
      cachedSelection[1] + (newLeftSideValue.length - currentLeftSideValue.length)
    ];
    // const newValue = value.replaceAll(`![Uploading ${name}]()`, `<img src="${res.url}" alt="${res.name}" />`);
    this.#setSelection([0, value.length]);
    await nextTick();
    this.#replaceValue(`${newLeftSideValue}${currentSelectionValue}${newRightSideValue}`, 'end', newSelection);
    this.#uploadingFiles = this.#uploadingFiles.filter(item => item !== name);
  }
}

export default Uploader;
