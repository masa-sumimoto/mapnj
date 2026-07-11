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

  test('selectArea()/reset() で外部から操作でき、subscribe() が発火するべき', () => {
    const container = buildFixture();
    const mapnj = new MapNJ('#stage');
    const listener = vi.fn();
    const off = mapnj.subscribe(listener);

    mapnj.selectArea('red');
    expect(mapnj.activeAreaId).toBe('red');
    expect(container.getAttribute('data-mapnj-active-area')).toBe('red');
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ activeAreaId: 'red' }),
    );

    mapnj.reset();
    expect(mapnj.activeAreaId).toBe('');
    expect(mapnj.prevActiveAreaId).toBe('red');
    expect(container.getAttribute('data-mapnj-active-area')).toBeNull();

    off();
    const callCount = listener.mock.calls.length;
    mapnj.selectArea('blue');
    expect(listener).toHaveBeenCalledTimes(callCount);
  });

  test('getState() はスナップショットを返すべき (内部状態と別オブジェクト)', () => {
    buildFixture();
    const mapnj = new MapNJ('#stage');
    const snapshot = mapnj.getState();
    mapnj.selectArea('red');
    expect(snapshot.activeAreaId).toBe('');
    expect(mapnj.getState().activeAreaId).toBe('red');
  });

  test('pointerdownでoutlineが打ち消され、blurで復元されるべき (クリック時フォーカスリング対策)', () => {
    buildFixture();
    new MapNJ('#stage');
    const red = document.getElementById('mapnj-area-red') as unknown as HTMLElement;

    red.dispatchEvent(new Event('pointerdown'));
    expect(red.style.outline).toBe('none');

    // click 自体は通常どおり機能する (preventDefaultはしていない)
    red.dispatchEvent(new Event('click'));
    expect(red.getAttribute('aria-pressed')).toBe('true');

    // キーボードフォーカスに備えて blur で復元される
    red.dispatchEvent(new Event('blur'));
    expect(red.style.outline).toBe('');
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
