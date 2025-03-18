import ResetSelector from './ResetSelector';
import { MapNJState, MapNJConfig } from './types';
import { getDummyConfig } from './utils/index';

const defaultConfig: MapNJConfig = getDummyConfig();

describe('ResetSelector', () => {
  let resetSelector: ResetSelector;
  let mockElm: HTMLElement;
  let mockState: MapNJState;
  let mockConfig: MapNJConfig;
  let mockGetState: jest.Mock;
  let mockSetState: jest.Mock;

  beforeEach(() => {
    mockElm = document.createElement('button');
    mockState = { activeAreaId: '', prevActiveAreaId: '', hoverAreaId: '' };
    mockConfig = defaultConfig;
    mockGetState = jest.fn(() => mockState);
    mockSetState = jest.fn();
  });

  afterEach(() => {
    resetSelector.destroy();
    jest.clearAllMocks();
  });

  test('1. should add click event listener on construction', () => {
    const spy = jest.spyOn(mockElm, 'addEventListener');
    resetSelector = new ResetSelector({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });
    expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
  });

  test('2. should call setState with empty object when activeAreaId is already empty', () => {
    resetSelector = new ResetSelector({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });
    mockElm.click();
    expect(mockSetState).toHaveBeenCalledWith({}, ['RESET_SELECTOR_CLICK']);
  });

  // 3. activeAreaIdが空でない場合のhandleClickの動作
  test('3. should call setState with new state when activeAreaId is not empty', () => {
    const mockState = {
      activeAreaId: 'neoim',
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
        prevActiveAreaId: 'neoim',
      },
      ['RESET_SELECTOR_CLICK', 'AREA_CHANGE'],
    );
  });

  test('4. should remove event listener when destroy is called', () => {
    const spy = jest.spyOn(mockElm, 'removeEventListener');
    resetSelector = new ResetSelector({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });
    if (resetSelector) resetSelector.destroy();
    expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
  });
});
