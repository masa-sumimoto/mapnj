import { MapNJConfig } from '../types';

// for test
export function getDummyConfig(): MapNJConfig {
  return {
    attributeType: 'data-name',
    noEventLabels: [],
    labelDispAnim: 'static',
    labelActiveFillColor: '#000000',
    labelActiveStrokeColor: '#000000',
    labelDefaultFillColor: '#FFFFFF',
    labelDefaultStrokeColor: '#FFFFFF',
    transparentDefaultAreas: false,
    areaDefaultFillColor: '#eee',
    areaDefaultFillColors: {},
    areaDefaultStrokeColor: '#fff',
    areaDefaultStrokeColors: {},
    areaActiveFillColor: undefined,
    areaActiveFillColors: {},
    areaActiveStrokeColor: undefined,
    areaActiveStrokeColors: {},
    areaChangeSpeed: 0.5,
    labelDefaultFillColors: {},
    labelActiveFillColors: {},
    labelDefaultStrokeColors: {},
    labelActiveStrokeColors: {},
    contentChangeSpeed: 0.5,
    bgImages: {},
    bgDefaultImage: undefined,
    bgBrightness: 100,
    bgChangeSpeed: 0.5,
    dom: {} as any, // 実際のDOMオブジェクトの代わりに空のオブジェクトを使用
  };
}
