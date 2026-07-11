import { useCallback, useRef, useState } from 'react';

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
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const [mapnj, setMapnj] = useState<MapNJ | null>(null);
  const [state, setState] = useState<MapNJState>({
    activeAreaId: options.activeAreaId || '',
    prevActiveAreaId: '',
    hoverAreaId: '',
  });

  // callback ref: ノードの着脱に合わせてインスタンスを生成・破棄する
  // (StrictModeの二重マウントでも安全)
  const ref = useCallback((node: T | null) => {
    if (instanceRef.current) {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
      instanceRef.current.destroy();
      instanceRef.current = null;
      setMapnj(null);
    }

    if (node) {
      const instance = new MapNJ(node, optionsRef.current);
      instanceRef.current = instance;
      unsubscribeRef.current = instance.subscribe((s) => setState({ ...s }));
      setState(instance.getState());
      setMapnj(instance);
    }
  }, []);

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
