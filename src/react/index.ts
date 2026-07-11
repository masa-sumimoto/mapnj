import { useCallback, useEffect, useRef, useState } from 'react';

import MapNJ from '../MapNJ';
import type { MapNJOpts, MapNJState } from '../types';

export interface UseMapNJReturn<T extends HTMLElement = HTMLElement> {
  /** SVGを含むコンテナ要素に渡す callback ref */
  ref: (node: T | null) => void;
  /** 生成された MapNJ インスタンス (マウント前は null) */
  mapnj: MapNJ | null;
  /** 現在の選択・ホバー状態 (Reactの再レンダリングに追従する) */
  state: MapNJState;
  /** プログラムからのエリア選択 */
  selectArea: (areaId: string) => void;
  /** 選択解除 */
  reset: () => void;
}

// MapNJ を React から使うためのフック。
//
// 使い方:
//   const { ref, state, selectArea, reset } = useMapNJ({ areaActiveFillColor: '#f00' });
//   return <div ref={ref}>{/* mapnj-area-* のidを持つインラインSVG */}</div>;
//
// オプションはインスタンス生成時 (refがDOMに繋がった時) に評価される。
export function useMapNJ<T extends HTMLElement = HTMLElement>(
  options: MapNJOpts = {},
): UseMapNJReturn<T> {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const instanceRef = useRef<MapNJ | null>(null);

  const [node, setNode] = useState<T | null>(null);
  const [mapnj, setMapnj] = useState<MapNJ | null>(null);
  const [state, setState] = useState<MapNJState>({
    activeAreaId: options.activeAreaId || '',
    prevActiveAreaId: '',
    hoverAreaId: '',
  });

  // ref自体はノードを覚えるだけの軽い存在にする
  const ref = useCallback((n: T | null) => {
    setNode(n);
  }, []);

  // インスタンスの生成・破棄はrefコールバックではなくeffectで行う。
  // React 19ではrefコールバックがdangerouslySetInnerHTMLの反映より先に
  // 発火することがあり (facebook/react#31600)、コンテナが空の時点で
  // 初期化してしまう。effectはコミット完了後に走るため、この順序問題を
  // 回避できる。クリーンアップがあるのでStrictModeの二重マウントでも安全
  useEffect(() => {
    if (!node) return;

    const instance = new MapNJ(node, optionsRef.current);
    instanceRef.current = instance;
    const unsubscribe = instance.subscribe((s) => setState({ ...s }));
    setState(instance.getState());
    setMapnj(instance);

    return () => {
      unsubscribe();
      instance.destroy();
      instanceRef.current = null;
      setMapnj(null);
    };
  }, [node]);

  const selectArea = useCallback((areaId: string) => {
    instanceRef.current?.selectArea(areaId);
  }, []);

  const reset = useCallback(() => {
    instanceRef.current?.reset();
  }, []);

  return { ref, mapnj, state, selectArea, reset };
}

export { MapNJ };
export type { MapNJOpts, MapNJState };
