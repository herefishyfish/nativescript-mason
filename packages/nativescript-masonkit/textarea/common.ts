import { Property } from '@nativescript/core';
import { InputBase } from '../input/common';

export class TextAreaBase extends InputBase {}

export const rowsProperty = new Property<TextAreaBase, number>({
  name: 'rows',
  defaultValue: 2,
  valueConverter: (v) => Number(v),
});
rowsProperty.register(TextAreaBase);

export const colsProperty = new Property<TextAreaBase, number>({
  name: 'cols',
  defaultValue: 20,
  valueConverter: (v) => Number(v),
});
colsProperty.register(TextAreaBase);

export const maxLengthProperty = new Property<TextAreaBase, number>({
  name: 'maxLength',
  defaultValue: -1,
  valueConverter: (v) => Number(v),
});
maxLengthProperty.register(TextAreaBase);

export const nameProperty = new Property<TextAreaBase, string>({
  name: 'name',
  defaultValue: '',
});
nameProperty.register(TextAreaBase);
