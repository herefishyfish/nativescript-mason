import { TextAreaBase } from './common';
export class TextArea extends TextAreaBase {
  value: string;
  rows: number;
  cols: number;
  placeholder: string;
  name: string;
  maxLength: number;
}
