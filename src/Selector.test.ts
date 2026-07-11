import { vi, type Mock } from 'vitest';
import AreaSelector from './Selector';
import { MapNJState, MapNJConfig } from './types';
import { getDummyConfig } from './utils/index';

const defaultConfig: MapNJConfig = getDummyConfig();

describe('Selector', () => {
  let selector: AreaSelector;
  let mockElm: HTMLElement;
  let mockState: MapNJState;
  let mockConfig: MapNJConfig;
  let mockGetState: Mock;
  let mockSetState: Mock;

  beforeEach(() => {
    mockElm = document.createElement('button');
    mockState = { activeAreaId: '', prevActiveAreaId: '', hoverAreaId: '' };
    mockConfig = defaultConfig;
    mockGetState = vi.fn(() => mockState);
    mockSetState = vi.fn();
  });

  test('1. should add event listeners on construction', () => {
    const spy = vi.spyOn(mockElm, 'addEventListener');
    new AreaSelector({
      props: {
        elm: mockElm,
        config: mockConfig,
        getState: mockGetState,
        setState: mockSetState,
      },
    });

    expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
    expect(spy).toHaveBeenCalledWith('pointerenter', expect.any(Function));
    expect(spy).toHaveBeenCalledWith('pointerleave', expect.any(Function));
    expect(spy).toHaveBeenCalledTimes(3);
  });

  afterEach(() => {
    if (selector) selector.destroy();
    vi.clearAllMocks();
  });
});
