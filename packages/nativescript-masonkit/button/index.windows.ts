import { CSSType } from '@nativescript/core';
import { ButtonBase, textContentProperty } from '../common';
import { Style } from '../style';
import { Tree } from '../tree';
import { style_, isText_, isMasonView_, native_ } from '../symbols';

@CSSType('Button')
export class Button extends ButtonBase {
  [style_];
  _inBatch = false;
  constructor() {
    super();
    this[isText_] = true;
    this[isMasonView_] = true;
  }

  get _view(): NativeScript.Mason.Button {
    if (!this[native_]) {
      this[native_] = Tree.instance.createButtonView() as never;
    }
    return this[native_] as never as NativeScript.Mason.Button;
  }

  // @ts-ignore
  get windows() {
    return this._view;
  }

  get _styleHelper(): Style {
    if (this[style_] === undefined) {
      this[style_] = Style.fromView(this as never, this._view);
    }
    return this[style_];
  }

  createNativeView() {
    return this._view;
  }

  [textContentProperty.setNative](value) {
    const nativeView = this._view;
    if (nativeView) {
      nativeView.Content = value ?? '';
    }
  }
}
