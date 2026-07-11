import { vi, type Mock } from 'vitest';
import Label from './Label';
import { MapNJState, MapNJConfig } from './types';
import { getDummyConfig } from './utils/index';

const defaultConfig: MapNJConfig = getDummyConfig();

describe('Label', () => {
  let label: Label;
  let mockElm: SVGElement;
  let mockState: MapNJState;
  let mockConfig: MapNJConfig;
  let mockGetState: Mock;
  let mockSetState: Mock;

  beforeEach(() => {
    mockElm = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mockElm.setAttribute('data-name', 'mapnj-label-neoim');
    mockState = { activeAreaId: '', prevActiveAreaId: '', hoverAreaId: '' };
    mockConfig = { ...defaultConfig };
    mockGetState = vi.fn(() => mockState);
    mockSetState = vi.fn();

    // animateメソッドのモック化
    Element.prototype.animate = vi.fn();
  });

  afterEach(() => {
    if (label) label.destroy();
    vi.clearAllMocks();
  });

  test('1. 構築時、イベントリスナーが設定されているべき', () => {
    const spy = vi.spyOn(mockElm, 'addEventListener');
    label = new Label({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });
    expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
    expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(spy).toHaveBeenCalledWith('pointerdown', expect.any(Function));
    expect(spy).toHaveBeenCalledWith('pointerenter', expect.any(Function));
    expect(spy).toHaveBeenCalledWith('pointerleave', expect.any(Function));
    expect(spy).toHaveBeenCalledWith('blur', expect.any(Function));
    expect(spy).toHaveBeenCalledTimes(6);
  });

  test('2. should not add event listeners for noEventLabels', () => {
    mockConfig.noEventLabels = ['neoim'];
    const spy = vi.spyOn(mockElm, 'addEventListener');
    label = new Label({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });
    expect(spy).not.toHaveBeenCalled();
  });

  test('3. 構築時、カーソルにはpointerスタイルが付与されているべき', () => {
    label = new Label({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });
    expect(mockElm.style.cursor).toBe('pointer');
  });

  test('4. 構築時、noEventLabelssが有効な場合、カーソルにはpointerスタイルは付与されないべき', () => {
    mockConfig.noEventLabels = ['neoim'];
    label = new Label({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });
    expect(mockElm.style.cursor).not.toBe('pointer');
  });

  test('5.ラベルアクティブ時、アクティブ用スタイルがあればそれが適用されるべき', () => {
    mockState.activeAreaId = 'neoim';
    mockConfig.labelActiveFillColor = 'green';
    mockConfig.labelActiveStrokeColor = 'yellow';
    label = new Label({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });

    label.render();
    expect(mockElm.style.fill).toBe('green');
    expect(mockElm.style.stroke).toBe('yellow');
  });

  test('6.ラベルデフォルト時、デフォルト用スタイルがあればそれが適用されるべき', () => {
    mockState.activeAreaId = '';
    mockConfig.labelDefaultFillColor = 'red';
    mockConfig.labelDefaultStrokeColor = 'blue';
    label = new Label({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });

    label.render();
    expect(mockElm.style.fill).toBe('red');
    expect(mockElm.style.stroke).toBe('blue');
  });

  test('7.ラベルデフォルト時、透明オプションが指定されている場合、ラベルは透明であるべき', () => {
    mockConfig.transparentDefaultLabels = true;
    label = new Label({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });

    label.render();
    expect(mockElm.style.fill).toBe('transparent');
    expect(mockElm.style.stroke).toBe('transparent');
  });

  test('8.ラベルデフォルト時、透明オプションが指定されていない場合、ラベルはデフォルト用スタイルが適用されるべき', () => {
    mockConfig.transparentDefaultLabels = false;
    mockConfig.labelDefaultFillColor = 'red';
    mockConfig.labelDefaultStrokeColor = 'blue';
    label = new Label({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });

    label.render();
    expect(mockElm.style.fill).toBe('red');
    expect(mockElm.style.stroke).toBe('blue');
  });

  // animateメソッドの削除
  afterAll(() => {
    // @ts-ignore
    delete Element.prototype.animate;
  });
});
