import Area from './Area';
import Label from './Label';
import Selector from './Selector';
import ResetSelector from './ResetSelector';
import Content from './Content';
import Bg from './Bg';

import {
  MapNJOpts,
  MapNJState,
  MapNJConfig,
  Observers,
  DomElements,
} from './types';

import { removeClassesWithCommonPrefix } from './Utils';

type EventCallback = (state: MapNJ) => void;

class MapNJ {
  private container: HTMLElement;
  private config: MapNJConfig;
  private initialState: MapNJState;
  private state: MapNJState;

  private areas: Area[];
  private labels: Label[];
  private selectors: Selector[];
  private resetSelectors: ResetSelector[];
  private contents: Content[];
  private bg?: Bg;

  private observers: Observers;

  constructor(
    selectorOrElement: string | HTMLElement,
    options: MapNJOpts = {},
  ) {
    const {
      // config
      attributeType,

      areaDefaultFillColor,
      areaDefaultFillColors,
      areaDefaultStrokeColor,
      areaDefaultStrokeColors,
      areaActiveFillColor,
      areaActiveFillColors,
      areaActiveStrokeColor,
      areaActiveStrokeColors,
      areaChangeSpeed,

      labelDefaultFillColor,
      labelDefaultFillColors,
      labelActiveFillColor,
      labelActiveFillColors,

      labelDefaultStrokeColor,
      labelDefaultStrokeColors,
      labelActiveStrokeColor,
      labelActiveStrokeColors,

      labelDispAnim,
      noEventLabels,

      contentChangeSpeed,

      bgImages,
      bgDefaultImage,
      bgBrightness,
      bgChangeSpeed,

      // state
      activeAreaId,
    } = options;

    // 初期Error対処
    if (typeof selectorOrElement === 'string') {
      const elm = document.querySelector(selectorOrElement);
      if (!elm) {
        throw new Error(
          `Element with selector "${selectorOrElement}" not found.`,
        );
      }
      this.container = elm as HTMLElement;
    } else if (selectorOrElement instanceof HTMLElement) {
      this.container = selectorOrElement;
    } else {
      throw new Error(
        'Invalid argument: expected a CSS selector string or an HTMLElement.',
      );
    }

    // info
    //
    this.config = {
      attributeType: attributeType || 'id',

      areaDefaultFillColor: areaDefaultFillColor || '#eee',
      areaDefaultFillColors: areaDefaultFillColors || {},
      areaDefaultStrokeColor: areaDefaultStrokeColor || '#fff',
      areaDefaultStrokeColors: areaDefaultStrokeColors || {},
      areaActiveFillColor: areaActiveFillColor || undefined,
      areaActiveFillColors: areaActiveFillColors || {},
      areaActiveStrokeColor: areaActiveStrokeColor || undefined,
      areaActiveStrokeColors: areaActiveStrokeColors || {},
      areaChangeSpeed: areaChangeSpeed ?? 0.5,

      labelDefaultFillColor: labelDefaultFillColor || '#555',
      labelDefaultFillColors: labelDefaultFillColors || {},
      labelActiveFillColor: labelActiveFillColor || undefined,
      labelActiveFillColors: labelActiveFillColors || {},

      labelDefaultStrokeColor: labelDefaultStrokeColor || '#fff',
      labelDefaultStrokeColors: labelDefaultStrokeColors || {},
      labelActiveStrokeColor: labelActiveStrokeColor || undefined,
      labelActiveStrokeColors: labelActiveStrokeColors || {},

      labelDispAnim: labelDispAnim || 'fadeIn',
      noEventLabels: noEventLabels ?? [],

      contentChangeSpeed: contentChangeSpeed || 0.5,

      bgImages: bgImages || {},
      bgDefaultImage: bgDefaultImage || undefined,
      bgBrightness: bgBrightness || 100,
      bgChangeSpeed: bgChangeSpeed || 0.5,
      dom: this.initDom(attributeType || 'id'),
    };

    // [todo] optionで受け取った値が全て有効かどうかの検証
    // 現在attributeTypeのみ検証
    if (
      this.config.attributeType !== 'id' &&
      this.config.attributeType !== 'data-name'
    ) {
      throw new Error(
        'Invalid argument: expected attributeType id or data-name.',
      );
    }

    this.initialState = {
      prevActiveAreaId: '',
      activeAreaId: activeAreaId || '',
      hoverAreaId: '',
    };
    this.state = { ...this.initialState };

    this.observers = {
      INIT: [],
      AREA_CLICK: [],
      AREA_MOUSEOVER: [],
      AREA_MOUSEOUT: [],
      LABEL_CLICK: [],
      LABEL_MOUSEOVER: [],
      LABEL_MOUSEOUT: [],
      SELECTOR_CLICK: [],
      SELECTOR_MOUSEOVER: [],
      SELECTOR_MOUSEOUT: [],
      RESET_SELECTOR_CLICK: [],
      AREA_CHANGE: [],
    };

    // nodes
    //
    this.areas = [];
    this.labels = [];
    this.selectors = [];
    this.resetSelectors = [];
    this.contents = [];

    this.config.dom.areas.forEach((elm) => {
      const area = new Area({
        props: {
          elm: elm as SVGElement | HTMLElement,
          state: this.state,
          config: this.config,
          setState: this.setState.bind(this),
        },
      });
      this.areas.push(area);
      this.observers.INIT.push(area);
      this.observers.AREA_CLICK.push(area);
      this.observers.AREA_MOUSEOVER.push(area);
      this.observers.AREA_MOUSEOUT.push(area);
      this.observers.LABEL_CLICK.push(area);
      this.observers.LABEL_MOUSEOVER.push(area);
      this.observers.LABEL_MOUSEOUT.push(area);
      this.observers.SELECTOR_CLICK.push(area);
      this.observers.SELECTOR_MOUSEOVER.push(area);
      this.observers.SELECTOR_MOUSEOUT.push(area);
      this.observers.RESET_SELECTOR_CLICK.push(area);
    });

    this.config.dom.labels.forEach((elm) => {
      const label = new Label({
        props: {
          elm: elm as SVGElement | HTMLElement,
          state: this.state,
          config: this.config,
          setState: this.setState.bind(this),
        },
      });
      this.labels.push(label);
      this.observers.INIT.push(label);
      this.observers.AREA_CLICK.push(label);
      this.observers.AREA_MOUSEOVER.push(label);
      this.observers.AREA_MOUSEOUT.push(label);
      this.observers.LABEL_CLICK.push(label);
      this.observers.LABEL_MOUSEOVER.push(label);
      this.observers.LABEL_MOUSEOUT.push(label);
      this.observers.SELECTOR_CLICK.push(label);
      this.observers.SELECTOR_MOUSEOVER.push(label);
      this.observers.SELECTOR_MOUSEOUT.push(label);
      this.observers.RESET_SELECTOR_CLICK.push(label);
    });

    this.config.dom.selectors.forEach((elm) => {
      this.selectors.push(
        new Selector({
          props: {
            elm: elm as HTMLElement,
            state: this.state,
            config: this.config,
            setState: this.setState.bind(this),
          },
        }),
      );
    });

    this.config.dom.resetSelectors.forEach((elm) => {
      this.resetSelectors.push(
        new ResetSelector({
          props: {
            elm: elm as HTMLElement,
            config: this.config,
            getState: this.getState,
            setState: this.setState.bind(this),
          },
        }),
      );
    });

    this.config.dom.contents.forEach((elm) => {
      const content = new Content({
        props: {
          elm: elm as HTMLElement,
          state: this.state,
          config: this.config,
        },
      });
      this.contents.push(content);
      this.observers.INIT.push(content);
      this.observers.AREA_CLICK.push(content);
      this.observers.LABEL_CLICK.push(content);
      this.observers.SELECTOR_CLICK.push(content);
      this.observers.RESET_SELECTOR_CLICK.push(content);
    });

    if (this.config.bgDefaultImage || this.config.bgImages) {
      this.bg = new Bg({
        props: {
          state: this.state,
          config: this.config,
        },
      });
      this.observers.INIT.push(this.bg);
      this.observers.AREA_CLICK.push(this.bg);
      this.observers.LABEL_CLICK.push(this.bg);
      this.observers.SELECTOR_CLICK.push(this.bg);
      this.observers.RESET_SELECTOR_CLICK.push(this.bg);

      // ラップ要素側にもデザイン調整が必要
      this.container.style.position = 'relative';
      this.container.style.zIndex = '1';
      this.container.append(this.bg.elm);
    }

    // init
    // [note] INITのみアプリ内部で使うオブザーバー
    this.setState({}, ['INIT']);
  }

  private initDom(attributeType: string): DomElements {
    const prefix = attributeType === 'data-name' ? 'data-name' : 'id';
    const selector = (name: string) => `[${prefix}${name}]`;
    const selectorStartsWith = (name: string) => `[${prefix}^="${name}"]`;

    return {
      allArea: this.container.querySelector(selector('="mapnj-allArea"')),
      title: this.container.querySelector('[data-name="mapnj-title"]'),
      areas: this.container.querySelectorAll(selectorStartsWith('mapnj-area-')),
      labels: this.container.querySelectorAll(
        selectorStartsWith('mapnj-label-'),
      ),
      selectors: this.container.querySelectorAll('[data-mapnj="selector"]'),
      resetSelectors: this.container.querySelectorAll(
        '[data-mapnj="reset-selector"]',
      ),
      contents: this.container.querySelectorAll('[data-mapnj="content"]'),
    };
  }

  private updateDesignClasses() {
    // mapnjデザインクラス群の総削除と状態に対応したクラスの付加
    removeClassesWithCommonPrefix(this.container as HTMLElement, '--mapnj-');

    if (this.state.activeAreaId) {
      this.container.classList.add(
        `--mapnj-active-area_${this.state.activeAreaId}`,
        '--mapnj-is-active-area_true',
      );
    } else {
      this.container.classList.add('--mapnj-is-active-area_false');
    }

    if (this.state.hoverAreaId) {
      this.container.classList.add(
        `--mapnj-hover-area_${this.state.hoverAreaId}`,
      );
    }
  }

  private render(actions?: string[]): void {
    // 自身のデザインクラス管理
    this.updateDesignClasses();

    if (actions?.length) {
      actions.forEach((action) => {
        this.observers[action].forEach((observer: any) => observer.render());
      });
    }
  }

  destroy(): void {
    this.areas.forEach((node) => node.destroy());
    this.labels.forEach((node) => node.destroy());
    this.selectors.forEach((node) => node.destroy());
    this.resetSelectors.forEach((node) => node.destroy());
    this.areas = [];
    this.labels = [];
    this.selectors = [];
    this.resetSelectors = [];
    this.state = { ...this.initialState };
  }

  private getState = (): MapNJState => {
    return this.state;
  };

  private setState(newState: Partial<MapNJState>, actions?: string[]): void {
    this.state = { ...this.state, ...newState };
    this.areas.forEach((node) => node.updateState(this.state));
    this.labels?.forEach((node) => node.updateState(this.state));
    this.selectors?.forEach((node) => node.updateState(this.state));
    this.contents?.forEach((node) => node.updateState(this.state));
    this.bg?.updateState(this.state);

    this.render(actions);
  }

  on(actionName: string, callback: EventCallback): void {
    if (this.observers[actionName]) {
      this.observers[actionName].push({
        render: () => {
          callback(this);
        },
      });
    } else {
      console.warn(`Event "${actionName}" is not supported.`);
    }
  }
}

// グローバルスコープに追加
if (typeof window !== 'undefined') {
  (window as any).MapNJ = MapNJ;
}

export default MapNJ;
