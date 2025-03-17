import Label from './Label';
import { MapNJState, MapNJConfig } from './types';
import { getDummyConfig } from './utils/index';

const defaultConfig: MapNJConfig = getDummyConfig();

describe('Label', () => {
  let label: Label;
  let mockElm: SVGElement;
  let mockState: MapNJState;
  let mockConfig: MapNJConfig;
  let mockGetState: jest.Mock;
  let mockSetState: jest.Mock;

  beforeEach(() => {
    mockElm = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mockElm.setAttribute('data-name', 'mapnj-label-neoim');
    mockState = { activeAreaId: '', prevActiveAreaId: '', hoverAreaId: '' };
    mockConfig = { ...defaultConfig };
    mockGetState = jest.fn(() => mockState);
    mockSetState = jest.fn();

    // animateメソッドのモック化
    Element.prototype.animate = jest.fn();
  });

  afterEach(() => {
    if (label) label.destroy();
    jest.clearAllMocks();
  });

  test('1. should add event listeners on construction', () => {
    const spy = jest.spyOn(mockElm, 'addEventListener');
    label = new Label({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });
    expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
    expect(spy).toHaveBeenCalledWith('mouseover', expect.any(Function));
    expect(spy).toHaveBeenCalledWith('mouseout', expect.any(Function));
    expect(spy).toHaveBeenCalledTimes(3);
  });

  test('2. should not add event listeners for noEventLabels', () => {
    mockConfig.noEventLabels = ['neoim'];
    const spy = jest.spyOn(mockElm, 'addEventListener');
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

  test('3. should set cursor style to pointer for non-noEventLabels', () => {
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

  test('4. should not set cursor style to pointer for noEventLabels', () => {
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

  // animateメソッドの削除
  afterAll(() => {
    // @ts-ignore
    delete Element.prototype.animate;
  });
});
