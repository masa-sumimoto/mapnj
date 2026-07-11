import { vi } from 'vitest';
import MapNJ from './MapNJ';

function buildFixture(): HTMLElement {
  document.body.innerHTML = `
    <div id="stage">
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <circle id="mapnj-area-red" cx="100" cy="200" r="40" fill="red" />
        <circle id="mapnj-area-blue" cx="300" cy="200" r="40" fill="blue" />
      </svg>
    </div>`;
  return document.getElementById('stage')!;
}

describe('MapNJ v1 core', () => {
  beforeEach(() => {
    // Label の登場アニメーション用 (jsdom には animate が無い)
    Element.prototype.animate = vi.fn();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  test('エリアクリックで選択状態・aria-pressed・data属性が更新されるべき', () => {
    const container = buildFixture();
    new MapNJ('#stage');
    const red = document.getElementById('mapnj-area-red')!;

    // 初期状態
    expect(red.getAttribute('role')).toBe('button');
    expect(red.getAttribute('tabindex')).toBe('0');
    expect(red.getAttribute('aria-pressed')).toBe('false');

    red.dispatchEvent(new Event('click'));

    expect(red.getAttribute('aria-pressed')).toBe('true');
    expect(red.getAttribute('data-mapnj-state')).toBe('active');
    expect(container.getAttribute('data-mapnj-active-area')).toBe('red');

    // 別エリアを選択すると切り替わる
    const blue = document.getElementById('mapnj-area-blue')!;
    blue.dispatchEvent(new Event('click'));

    expect(red.getAttribute('aria-pressed')).toBe('false');
    expect(container.getAttribute('data-mapnj-active-area')).toBe('blue');
  });

  test('キーボード (Enter) でエリアを選択できるべき', () => {
    const container = buildFixture();
    new MapNJ('#stage');
    const red = document.getElementById('mapnj-area-red')!;

    red.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(red.getAttribute('aria-pressed')).toBe('true');
    expect(container.getAttribute('data-mapnj-active-area')).toBe('red');
  });

  test('on() は購読解除関数を返すべき', () => {
    buildFixture();
    const mapnj = new MapNJ('#stage');
    const red = document.getElementById('mapnj-area-red')!;

    const callback = vi.fn();
    const off = mapnj.on('AREA_CLICK', callback);

    red.dispatchEvent(new Event('click'));
    expect(callback).toHaveBeenCalledTimes(1);

    off();
    red.dispatchEvent(new Event('click'));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('ホバーでcontainerにdata-mapnj-hover-areaが付くべき', () => {
    const container = buildFixture();
    new MapNJ('#stage');
    const red = document.getElementById('mapnj-area-red')!;

    red.dispatchEvent(new Event('pointerenter'));
    expect(container.getAttribute('data-mapnj-hover-area')).toBe('red');

    red.dispatchEvent(new Event('pointerleave'));
    expect(container.getAttribute('data-mapnj-hover-area')).toBeNull();
  });
});
