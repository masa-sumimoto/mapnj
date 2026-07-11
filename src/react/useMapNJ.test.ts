import { vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useMapNJ } from './index';

function createStage(): {
  stage: HTMLElement;
  red: Element;
  blue: Element;
} {
  const stage = document.createElement('div');
  stage.innerHTML = `
    <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <circle id="mapnj-area-red" cx="100" cy="200" r="40" fill="red" />
      <circle id="mapnj-area-blue" cx="300" cy="200" r="40" fill="blue" />
    </svg>`;
  document.body.appendChild(stage);
  return {
    stage,
    red: stage.querySelector('#mapnj-area-red')!,
    blue: stage.querySelector('#mapnj-area-blue')!,
  };
}

describe('useMapNJ', () => {
  beforeEach(() => {
    // Label の登場アニメーション用 (jsdom には animate が無い)
    Element.prototype.animate = vi.fn();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  test('refを繋ぐとインスタンスが生成され、クリックがReactのstateに反映されるべき', () => {
    const { stage, red } = createStage();
    const { result } = renderHook(() => useMapNJ());

    expect(result.current.mapnj).toBeNull();

    act(() => {
      result.current.ref(stage);
    });
    expect(result.current.mapnj).not.toBeNull();
    expect(result.current.state.activeAreaId).toBe('');

    act(() => {
      red.dispatchEvent(new Event('click'));
    });
    expect(result.current.state.activeAreaId).toBe('red');
  });

  test('selectArea / reset で外部から状態を操作できるべき', () => {
    const { stage, blue } = createStage();
    const { result } = renderHook(() => useMapNJ());

    act(() => {
      result.current.ref(stage);
    });

    act(() => {
      result.current.selectArea('blue');
    });
    expect(result.current.state.activeAreaId).toBe('blue');
    expect(blue.getAttribute('aria-pressed')).toBe('true');

    act(() => {
      result.current.reset();
    });
    expect(result.current.state.activeAreaId).toBe('');
    expect(result.current.state.prevActiveAreaId).toBe('blue');
    expect(blue.getAttribute('aria-pressed')).toBe('false');
  });

  test('ref(null) でインスタンスが破棄され、以後のクリックは反映されないべき', () => {
    const { stage, red } = createStage();
    const { result } = renderHook(() => useMapNJ());

    act(() => {
      result.current.ref(stage);
    });

    act(() => {
      result.current.ref(null);
    });
    expect(result.current.mapnj).toBeNull();

    act(() => {
      red.dispatchEvent(new Event('click'));
    });
    expect(result.current.state.activeAreaId).toBe('');
  });

  test('activeAreaId オプションが初期状態に反映されるべき', () => {
    const { stage, red } = createStage();
    const { result } = renderHook(() => useMapNJ({ activeAreaId: 'red' }));

    act(() => {
      result.current.ref(stage);
    });
    expect(result.current.state.activeAreaId).toBe('red');
    expect(red.getAttribute('aria-pressed')).toBe('true');
  });
});
