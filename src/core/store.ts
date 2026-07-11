import { Action, MapNJState } from '../types';

export type StateListener = (state: MapNJState) => void;
type ActionHandler = (actions?: Action[]) => void;

// MapNJの状態を保持するheadlessなストア。
// DOMを一切知らないため、フレームワークアダプタ (React等) から直接利用できる
export default class MapStore {
  private state: MapNJState;
  private listeners = new Set<StateListener>();
  private onAction: ActionHandler;

  constructor(initialState: MapNJState, onAction: ActionHandler) {
    this.state = { ...initialState };
    this.onAction = onAction;
  }

  // アロー関数にして、パーツ (Area/Label等) へそのまま渡せるようにする
  getState = (): MapNJState => {
    return this.state;
  };

  setState = (newState: Partial<MapNJState>, actions?: Action[]): void => {
    this.state = { ...this.state, ...newState };
    this.onAction(actions);
    this.listeners.forEach((listener) => listener(this.state));
  };

  // アクション種別を問わない状態変化の購読。解除関数を返す
  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  clearSubscribers(): void {
    this.listeners.clear();
  }

  reset(state: MapNJState): void {
    this.state = { ...state };
  }
}
