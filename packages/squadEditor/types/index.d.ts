/**
 * + `select` selects the newly inserted text.
 * + `start`moves the selection to just before the inserted text.
 * + `end` moves the selection to just after the inserted text.
 * + `preserve` attempts to preserve the selection. This is the default.
 */
export type SelectionModeType = 'end' | 'preserve' | 'select' | 'start';

export type SelectionType = [number, number];

export type ReplaceValueType = (replacement: string, selectMode?: SelectionModeType, selection?: SelectionType) => void;

export type FileUploadResponseType = {
  name: string;
  url: string;
}

export type FileUploadActionType = {
  (file: File): Promise<FileUploadResponseType>
}
