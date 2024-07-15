export function removeClassesWithCommonPrefix(
  elm: HTMLElement,
  pertialStr: string,
): void {
  if (elm.classList && elm.classList.length) {
    // 削除すべきクラスを配列で抽出
    const classesToRemove = Array.from(elm.classList).filter(
      (className: string) => className.startsWith(pertialStr),
    );

    // 対象のクラス群を削除
    classesToRemove.forEach((className) => {
      elm.classList.remove(className);
    });
  }
}

export function hasStroke(elm: SVGElement | HTMLElement): boolean {
  if (elm instanceof SVGElement) {
    return window.getComputedStyle(elm).getPropertyValue('stroke') !== 'none';
  }
  return false;
}

export function hasFill(elm: SVGElement | HTMLElement): boolean {
  if (elm instanceof SVGElement) {
    return window.getComputedStyle(elm).getPropertyValue('fill') !== 'none';
  }
  return false;
}
