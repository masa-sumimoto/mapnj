import { hasStroke, hasFill } from './Utils';

import { MapNJState, MapNJConfig, SetState } from './types';

interface AreaProps {
  elm: SVGElement | HTMLElement;
  state: MapNJState;
  config: MapNJConfig;
  setState: SetState;
}

interface TargetElmsInfo {
  elm: SVGElement | HTMLElement;
  hasStroke: boolean;
  hasFill: boolean;
}

export default class Area {
  private props: AreaProps;
  private crState: MapNJState;
  public id: string;
  private elm: SVGElement | HTMLElement;
  private targetElmsInfo: TargetElmsInfo[];
  private clickHandler: (event: MouseEvent) => void;
  private mouseoverHandler: (event: MouseEvent) => void;
  private mouseoutHandler: (event: MouseEvent) => void;

  constructor({ props }: { props: AreaProps }) {
    this.props = props;
    this.crState = props.state;
    this.elm = props.elm;

    let infoArr;

    if (this.elm) {
      const attribute = this.elm.getAttribute(props.config.attributeType);
      infoArr = attribute ? attribute.split('-') : [];
    } else {
      throw new Error('not found the Area Element.');
    }

    this.id = infoArr[2] || '';

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

    // style
    this.initStyle();
  }

  // init style
  private initStyle(): void {
    const transitionSpeed = this.props.config.areaChangeSpeed;
    (this.elm as HTMLElement).style.cursor = 'pointer';

    this.targetElmsInfo.forEach((info) => {
      (info.elm as HTMLElement).style.transition =
        `fill ${transitionSpeed}s ease, stroke ${transitionSpeed}s ease, opacity ${transitionSpeed}s ease`;
    });
  }

  private activeView() {
    this.targetElmsInfo.forEach((info) => {
      // [note] カラーの原則
      // カラー設定系のルールはここに限らず以下を踏襲
      // デザイナの指定色 < オプションでの全体設定色 < オプションでの個別設定色

      // 初期カラー: デザイナの指定色にリセット
      if (info.hasFill) (info.elm as HTMLElement).style.fill = '';
      if (info.hasStroke) (info.elm as HTMLElement).style.stroke = '';

      // カスタムカラー:
      // 全体設定であるareaDefaultFillColor
      // 個別設定であるareaDefaultFillColors[this.id]の取得
      const commonFillColor = this.props.config.areaActiveFillColor;
      const indivisualFillColor =
        this.props.config.areaActiveFillColors?.[this.id];
      const commonStrokeColor = this.props.config.areaActiveStrokeColor;
      const indivisualStrokeColor =
        this.props.config.areaActiveStrokeColors?.[this.id];
      const customFillColor = indivisualFillColor
        ? indivisualFillColor
        : commonFillColor;
      const customStrokeColor = indivisualStrokeColor
        ? indivisualStrokeColor
        : commonStrokeColor;

      if (info.hasFill && customFillColor)
        (info.elm as HTMLElement).style.fill = customFillColor;
      if (info.hasStroke && customStrokeColor)
        (info.elm as HTMLElement).style.stroke = customStrokeColor;
    });
  }

  private defaultView() {
    // [note] デフォルトデザインはデザイナの指定という概念がそもそも無いため、
    // MapNJが保有するデフォルト値を利用する
    // デフォルト値の上書き(ユーザー指定)があった場合はそれを利用する

    const commonFillColor = this.props.config.areaDefaultFillColor;
    const indivisualFillColor =
      this.props.config.areaDefaultFillColors?.[this.id];
    const commonStrokeColor = this.props.config.areaDefaultStrokeColor;
    const indivisualStrokeColor =
      this.props.config.areaDefaultStrokeColors?.[this.id];

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
    const isActiveView =
      this.id === this.crState.activeAreaId ||
      this.id === this.crState.hoverAreaId;

    isActiveView ? this.activeView() : this.defaultView();
  }

  // event
  //
  private handleClick(e: Event): void {
    e.preventDefault();
    const mouseEvent = e as MouseEvent;
    const isClickSameArea = this.id === this.crState.activeAreaId;

    if (isClickSameArea) {
      this.props.setState({}, ['AREA_CLICK']);
    } else {
      const prevId = this.crState.activeAreaId;
      this.props.setState({ activeAreaId: this.id, prevActiveAreaId: prevId }, [
        'AREA_CLICK',
        'AREA_CHANGE',
      ]);
    }
  }

  private handleMouseOver(e: Event): void {
    const mouseEvent = e as MouseEvent;
    this.props.setState({ hoverAreaId: this.id }, ['AREA_MOUSEOVER']);
  }

  private handleMouseOut(e: Event): void {
    const mouseEvent = e as MouseEvent;
    this.props.setState({ hoverAreaId: '' }, ['AREA_MOUSEOUT']);
  }

  // common
  //
  public updateState(newState: MapNJState): void {
    this.crState = newState;
  }

  public destroy(): void {
    this.elm.removeEventListener('click', this.clickHandler as EventListener);
    this.elm.removeEventListener(
      'mouseover',
      this.mouseoverHandler as EventListener,
    );
    this.elm.removeEventListener(
      'mouseout',
      this.mouseoutHandler as EventListener,
    );
  }
}
