import { hasStroke, hasFill } from './Utils';

import { MapNJState, MapNJConfig, SetState } from './types';

interface LabelProps {
  elm: SVGElement | HTMLElement;
  config: MapNJConfig;
  getState: () => MapNJState;
  setState: SetState;
}

interface TargetElmsInfo {
  elm: SVGElement | HTMLElement;
  hasStroke: boolean;
  hasFill: boolean;
}

export default class Label {
  private props: LabelProps;
  private areaId: string;
  private elm: SVGElement | HTMLElement;
  private targetElmsInfo: TargetElmsInfo[];
  private clickHandler?: (event: MouseEvent) => void;
  private mouseoverHandler?: (event: MouseEvent) => void;
  private mouseoutHandler?: (event: MouseEvent) => void;

  constructor({ props }: { props: LabelProps }) {
    this.elm = props.elm;
    this.props = props;

    let infoArr;

    if (this.elm) {
      const attribute = this.elm.getAttribute(props.config.attributeType);
      infoArr = attribute ? attribute.split('-') : [];
    } else {
      throw new Error('not found the Area Label Element.');
    }

    this.areaId = infoArr[2] || '';

    // グループ化されている可能性を考慮して、その場合は全てのノードを対象にする。
    // デザインの情報も足す
    this.targetElmsInfo =
      this.elm.nodeName.toLowerCase() === 'g'
        ? Array.from(this.elm.querySelectorAll('*')).map((childElm) => ({
            elm: childElm as SVGElement | HTMLElement,
            hasStroke: hasStroke(childElm as SVGElement | HTMLElement),
            hasFill: hasFill(childElm as SVGElement | HTMLElement),
          }))
        : [
            {
              elm: this.elm as SVGElement | HTMLElement,
              hasStroke: hasStroke(this.elm),
              hasFill: hasFill(this.elm),
            },
          ];

    // event
    // 対象はグループを考慮せず、this.elmに対して割り当てる
    if (!this.isNoEventLabel()) {
      this.clickHandler = this.handleClick.bind(this);
      this.mouseoverHandler = this.handleMouseOver.bind(this);
      this.mouseoutHandler = this.handleMouseOut.bind(this);

      this.elm.addEventListener('click', this.clickHandler as EventListener);
      this.elm.addEventListener(
        'mouseover',
        this.mouseoverHandler as EventListener,
      );
      this.elm.addEventListener(
        'mouseout',
        this.mouseoutHandler as EventListener,
      );
      (this.elm as HTMLElement).style.cursor = 'pointer';
    }

    // style
    this.initStyle();
  }

  private isNoEventLabel() {
    return this.props.config.noEventLabels.includes(this.areaId);
  }

  private initStyle(): void {
    // デフォルトスタイルの設定
    this.targetElmsInfo.forEach((info) => {
      (info.elm as HTMLElement).style.transition =
        'fill 0.2s ease, stroke 0.2s ease';
    });

    if (!this.isNoEventLabel()) {
      (this.elm as HTMLElement).style.cursor = 'pointer';
    }

    // animation指定のための設定
    const keyframes: { [key: string]: Keyframe[] } = {
      static: [{ opacity: 1 }, { opacity: 1 }],
      fadeIn: [{ opacity: 0 }, { opacity: 1 }],
      fadeInUp: [
        { transform: 'translateY(6px)', opacity: 0 },
        { transform: 'translateY(0px)', opacity: 1 },
      ],
      fadeInRight: [
        { transform: 'translateX(-12px)', opacity: 0 },
        { transform: 'translateY(0px)', opacity: 1 },
      ],
      fadeInDown: [
        { transform: 'translateX(0px)', opacity: 0 },
        { transform: 'translateY(6px)', opacity: 1 },
      ],
      fadeInLeft: [
        { transform: 'translateX(12px)', opacity: 0 },
        { transform: 'translateY(0px)', opacity: 1 },
      ],
    };
    const options: KeyframeAnimationOptions = {
      duration: 800,
      easing: 'ease-in-out',
      fill: 'forwards',
    };

    this.targetElmsInfo.forEach((info) => {
      (info.elm as HTMLElement).animate(
        keyframes[this.props.config.labelDispAnim],
        options,
      );
    });
  }

  private activeView() {
    this.targetElmsInfo.forEach((info) => {
      // reset
      if (info.hasFill) (info.elm as HTMLElement).style.fill = '';
      if (info.hasStroke) (info.elm as HTMLElement).style.stroke = '';

      const commonFillColor = this.props.config.labelActiveFillColor;
      const indivisualFillColor =
        this.props.config.labelActiveStrokeColors?.[this.areaId];
      const commonStrokeColor = this.props.config.labelActiveStrokeColor;
      const indivisualStrokeColor =
        this.props.config.labelActiveStrokeColors?.[this.areaId];
      const customFillColor = indivisualFillColor
        ? indivisualFillColor
        : commonFillColor;
      const customStrokeColor = indivisualStrokeColor
        ? indivisualStrokeColor
        : commonStrokeColor;

      if (info.hasFill && customFillColor) {
        (info.elm as HTMLElement).style.fill = customFillColor;
      }
      if (info.hasStroke && customStrokeColor)
        (info.elm as HTMLElement).style.stroke = customStrokeColor;
    });
  }

  private defaultView() {
    const commonFillColor = this.props.config.labelDefaultFillColor;
    const indivisualFillColor =
      this.props.config.labelDefaultFillColors?.[this.areaId];
    const commonStrokeColor = this.props.config.labelDefaultStrokeColor;
    const indivisualStrokeColor =
      this.props.config.labelDefaultStrokeColors?.[this.areaId];

    const customFillColor = indivisualFillColor
      ? indivisualFillColor
      : commonFillColor;

    const customStrokeColor = indivisualStrokeColor
      ? indivisualStrokeColor
      : commonStrokeColor;

    this.targetElmsInfo.forEach((info) => {
      if (info.hasFill) (info.elm as HTMLElement).style.fill = customFillColor;
      if (info.hasStroke)
        (info.elm as HTMLElement).style.stroke = customStrokeColor;
    });
  }

  public render(): void {
    const state = this.props.getState();
    const isActive =
      this.areaId === state.activeAreaId || this.areaId === state.hoverAreaId;

    if (isActive) {
      this.activeView();
    } else {
      this.defaultView();
    }
  }

  // event
  //
  private handleClick(e: Event): void {
    e.preventDefault();
    const mouseEvent = e as MouseEvent;

    const state = this.props.getState();
    const isSelectSameArea = this.areaId === state.activeAreaId;

    if (isSelectSameArea) {
      this.props.setState({}, ['LABEL_CLICK']);
    } else {
      const prevId = state.activeAreaId;
      this.props.setState(
        { activeAreaId: this.areaId, prevActiveAreaId: prevId },
        ['LABEL_CLICK', 'AREA_CHANGE'],
      );
    }
  }

  private handleMouseOver(e: Event): void {
    const mouseEvent = e as MouseEvent;
    this.props.setState({ hoverAreaId: this.areaId }, ['LABEL_MOUSEOVER']);
  }

  private handleMouseOut(e: Event): void {
    const mouseEvent = e as MouseEvent;
    this.props.setState({ hoverAreaId: '' }, ['LABEL_MOUSEOUT']);
  }

  // common
  //
  public destroy(): void {
    if (!this.props.config.noEventLabels.includes(this.areaId)) {
      this.elm.removeEventListener(
        'click',
        this.clickHandler! as EventListener,
      );
      this.elm.removeEventListener(
        'mouseover',
        this.mouseoverHandler! as EventListener,
      );
      this.elm.removeEventListener(
        'mouseout',
        this.mouseoutHandler! as EventListener,
      );
    }
  }
}
