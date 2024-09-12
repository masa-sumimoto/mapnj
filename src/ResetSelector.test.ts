import ResetSelector from './ResetSelector';
import { MapNJState, MapNJConfig, SetState } from './types';

describe('ResetSelector', () => {
  let resetSelector: ResetSelector;
  let mockElm: HTMLElement;
  let mockState: MapNJState;
  let mockConfig: MapNJConfig;
  let mockSetState: SetState;

  beforeEach(() => {
    // Mock Settings
    mockElm = document.createElement('button');
    mockState = { activeAreaId: '', prevActiveAreaId: '', hoverAreaId: '' };
    mockConfig = {} as MapNJConfig;
    mockSetState = jest.fn();

    // ResetSelectorのインスタンス作成
    resetSelector = new ResetSelector({
      props: {
        elm: mockElm,
        state: mockState,
        config: mockConfig,
        setState: mockSetState,
      },
    });
  });

  afterEach(() => {
    resetSelector.destroy();
  });

  // コンストラクタ
  test('should add click event listener on construction', () => {
    // mockElmオブジェクトのaddEventListenerメソッドにスパイを設置
    // スパイは、メソッドの呼び出しを監視し、その呼び出し回数や引数を追跡
    const spy = jest.spyOn(mockElm, 'addEventListener');
    new ResetSelector({
      props: {
        elm: mockElm,
        state: mockState,
        config: mockConfig,
        setState: mockSetState,
      },
    });

    expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
  });

  // activeAreaIdが空の場合のhandleClickの動作
  test('should call setState with empty object when activeAreaId is already empty', () => {
    mockElm.click();
    expect(mockSetState).toHaveBeenCalledWith({}, ['RESET_SELECTOR_CLICK']);
  });

  // activeAreaIdが空でない場合のhandleClickの動作
  test('should call setState with new state when activeAreaId is not empty', () => {
    resetSelector.updateState({ ...mockState, activeAreaId: 'area1' });
    mockElm.click();
    expect(mockSetState).toHaveBeenCalledWith(
      { activeAreaId: '', prevActiveAreaId: 'area1' },
      ['RESET_SELECTOR_CLICK', 'AREA_CHANGE'],
    );
  });

  // updateStateメソッドが内部状態を正しく更新するか
  test('should update internal state when updateState is called', () => {
    const newState = {
      activeAreaId: 'area2',
      prevActiveAreaId: 'area1',
      hoverAreaId: 'area2',
    };
    resetSelector.updateState(newState);
    mockElm.click();
    expect(mockSetState).toHaveBeenCalledWith(
      { activeAreaId: '', prevActiveAreaId: 'area2' },
      ['RESET_SELECTOR_CLICK', 'AREA_CHANGE'],
    );
  });

  // destroyメソッドがイベントリスナーを正しく削除するか
  test('should remove event listener when destroy is called', () => {
    const spy = jest.spyOn(mockElm, 'removeEventListener');
    resetSelector.destroy();
    expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
  });
});
