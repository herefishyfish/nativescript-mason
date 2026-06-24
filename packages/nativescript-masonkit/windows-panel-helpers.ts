declare const Microsoft: any;
export function appendNativeChild(panel: any, child: any, atIndex: number): boolean {
  const nativeChild = child?.nativeViewProtected ?? child?.windows; // as Microsoft.UI.Xaml.UIElement;
  if (!nativeChild) return false;
  child._isMasonChild = true;
  if (!panel?.Children) return false;
  try {
    NativeScript.Mason.Css.ReparentChild(panel, nativeChild, atIndex);
    return true;
  } catch {
    return false;
  }
}

export function removeNativeChild(panel: any, child: any): void {
  const nativeChild = child?.nativeViewProtected ?? child?.windows; // as Microsoft.UI.Xaml.UIElement;
  if (!nativeChild || !panel?.Children) return;
  try {
    NativeScript.Mason.Css.RemoveChild(panel, nativeChild);
  } catch {
    // empty
  }
}
