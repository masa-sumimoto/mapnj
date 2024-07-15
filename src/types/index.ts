export type MapTargetAttributeType = 'id' | 'data-name';

export type Action =
  | 'INIT'
  | 'AREA_CLICK'
  | 'AREA_MOUSEOVER'
  | 'AREA_MOUSEOUT'
  | 'LABEL_CLICK'
  | 'LABEL_MOUSEOVER'
  | 'LABEL_MOUSEOUT'
  | 'SELECTOR_CLICK'
  | 'SELECTOR_MOUSEOVER'
  | 'SELECTOR_MOUSEOUT'
  | 'RESET_SELECTOR_CLICK'
  | 'AREA_CHANGE';

export interface Observers {
  [key: string]: Array<{ render: () => void }>;
  INIT: Array<{ render: () => void }>;
  AREA_CLICK: Array<{ render: () => void }>;
  AREA_MOUSEOVER: Array<{ render: () => void }>;
  AREA_MOUSEOUT: Array<{ render: () => void }>;
  LABEL_CLICK: Array<{ render: () => void }>;
  LABEL_MOUSEOVER: Array<{ render: () => void }>;
  LABEL_MOUSEOUT: Array<{ render: () => void }>;
  SELECTOR_CLICK: Array<{ render: () => void }>;
  SELECTOR_MOUSEOVER: Array<{ render: () => void }>;
  SELECTOR_MOUSEOUT: Array<{ render: () => void }>;
  RESET_SELECTOR_CLICK: Array<{ render: () => void }>;
  AREA_CHANGE: Array<{ render: () => void }>;
}

export type SetState = (
  newState: Partial<MapNJState>,
  actions?: Action[],
) => void;

export type LabelDispAnim =
  | 'static'
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInRight'
  | 'fadeInDown'
  | 'fadeInLeft';

type MonoColor = string;
type IndivisualColors = {
  [key: string]: string;
};

export interface DomElements {
  allArea: Element | null;
  title: Element | null;
  areas: NodeListOf<Element>;
  labels: NodeListOf<Element>;
  selectors: NodeListOf<Element>;
  resetSelectors: NodeListOf<Element>;
  contents: NodeListOf<Element>;
}

export interface MapNJOpts {
  // for config
  attributeType?: MapTargetAttributeType;

  areaDefaultFillColor?: MonoColor;
  areaDefaultFillColors?: IndivisualColors;
  areaDefaultStrokeColor?: MonoColor;
  areaDefaultStrokeColors?: IndivisualColors;
  areaActiveFillColor?: MonoColor;
  areaActiveFillColors?: IndivisualColors;
  areaActiveStrokeColor?: MonoColor;
  areaActiveStrokeColors?: IndivisualColors;
  areaChangeSpeed?: number;

  labelDefaultFillColor?: MonoColor;
  labelDefaultFillColors?: IndivisualColors;
  labelActiveFillColor?: MonoColor;
  labelActiveFillColors?: IndivisualColors;

  labelDefaultStrokeColor?: MonoColor;
  labelDefaultStrokeColors?: IndivisualColors;
  labelActiveStrokeColor?: MonoColor;
  labelActiveStrokeColors?: IndivisualColors;

  labelDispAnim?: LabelDispAnim;
  noEventLabels?: string[];

  contentChangeSpeed?: number;

  bgImages?: {
    [key: string]: string;
  };
  bgDefaultImage?: string | undefined;
  bgBrightness?: number;
  bgChangeSpeed?: number;

  // for state
  activeAreaId?: string;
}

export interface MapNJConfig {
  attributeType: MapTargetAttributeType;

  areaDefaultFillColor: MonoColor;
  areaDefaultFillColors: IndivisualColors;
  areaDefaultStrokeColor: MonoColor;
  areaDefaultStrokeColors: IndivisualColors;
  areaActiveFillColor?: MonoColor;
  areaActiveFillColors: IndivisualColors;
  areaActiveStrokeColor?: MonoColor;
  areaActiveStrokeColors: IndivisualColors;
  areaChangeSpeed: number;

  labelDefaultFillColor: MonoColor;
  labelDefaultFillColors: IndivisualColors;
  labelActiveFillColor?: MonoColor;
  labelActiveFillColors: IndivisualColors;

  labelDefaultStrokeColor: MonoColor;
  labelDefaultStrokeColors: IndivisualColors;
  labelActiveStrokeColor?: MonoColor;
  labelActiveStrokeColors: IndivisualColors;

  labelDispAnim: LabelDispAnim;
  noEventLabels: string[];

  contentChangeSpeed: number;

  bgDefaultImage: string | undefined;
  bgImages: {
    [key: string]: string;
  };
  bgBrightness: number;
  bgChangeSpeed: number;

  dom: DomElements;
}

export interface MapNJState {
  prevActiveAreaId: string;
  activeAreaId: string;
  hoverAreaId: string;
}
