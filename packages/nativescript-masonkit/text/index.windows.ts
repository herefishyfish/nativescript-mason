import { TextBase, textContentProperty } from '../common';
import { Style } from '../style';
import { Tree } from '../tree';
import { style_, isText_, isMasonView_, native_ } from '../symbols';

export class Text extends TextBase {
  [style_];
  _inBatch = false;
  private _type: number;
  constructor(type = 0) {
    super();
    this._type = type;
    this[isText_] = true;
    this[isMasonView_] = true;
  }

  get _view(): NativeScript.Mason.Text {
    if (!this[native_]) {
      this[native_] = Tree.instance.createTextView(null, this._type) as never;
    }
    return this[native_] as never as NativeScript.Mason.Text;
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
