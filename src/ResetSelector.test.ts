import ResetSelector from './ResetSelector';
import { MapNJState, MapNJConfig } from './types';

describe('ResetSelector', () => {
  let resetSelector: ResetSelector;
  let mockElm: HTMLElement;
  let mockState: MapNJState;
  let mockConfig: MapNJConfig;
  let mockGetState: jest.Mock;
  let mockSetState: jest.Mock;

  beforeEach(() => {
    // Mock Settings
    mockElm = document.createElement('button');
    mockState = { activeAreaId: '', prevActiveAreaId: '', hoverAreaId: '' };
    mockConfig = {} as MapNJConfig;
    mockGetState = jest.fn(() => mockState);
    mockSetState = jest.fn();

    // ResetSelectorのインスタンス作成
    resetSelector = new ResetSelector({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });
  });

  afterEach(() => {
    resetSelector.destroy();
    jest.clearAllMocks();
  });

  // 1. コンストラクタの実行確認
  test('should add click event listener on construction', () => {
    const spy = jest.spyOn(mockElm, 'addEventListener');
    new ResetSelector({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });

    expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
  });

  // 2. activeAreaIdが空の場合のhandleClickの動作
  test('should call setState with empty object when activeAreaId is already empty', () => {
    mockElm.click();
    expect(mockSetState).toHaveBeenCalledWith({}, ['RESET_SELECTOR_CLICK']);
  });

  // 3. activeAreaIdが空でない場合のhandleClickの動作
  test('should call setState with new state when activeAreaId is not empty', () => {
    const initialActiveAreaId = 'area1';
    const mockState = {
      activeAreaId: initialActiveAreaId,
      prevActiveAreaId: '',
      hoverAreaId: '',
    };
    const mockGetState = jest.fn(() => mockState);
    const mockSetState = jest.fn();

    resetSelector = new ResetSelector({
      props: {
        elm: mockElm,
        config: {} as MapNJConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });

    mockElm.click();
    expect(mockSetState).toHaveBeenCalledWith(
      {
        activeAreaId: '',
        prevActiveAreaId: initialActiveAreaId,
      },
      ['RESET_SELECTOR_CLICK', 'AREA_CHANGE'],
    );
  });

  // 4. destroyメソッドがイベントリスナーを正しく削除するか
  test('should remove event listener when destroy is called', () => {
    const spy = jest.spyOn(mockElm, 'removeEventListener');
    resetSelector.destroy();
    expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
  });
});
