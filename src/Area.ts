import { hasStroke, hasFill, prefersReducedMotion } from './Utils';

import { MapNJState, MapNJConfig, SetState } from './types';

interface AreaProps {
  elm: SVGElement | HTMLElement;
  config: MapNJConfig;
  setState: SetState;
  getState: () => MapNJState;
}

interface TargetElmsInfo {
  elm: SVGElement | HTMLElement;
  hasStroke: boolean;
  hasFill: boolean;
}

export default class Area {
  private props: AreaProps;
  public id: string;
  private elm: SVGElement | HTMLElement;
  private targetElmsInfo: TargetElmsInfo[];
  private clickHandler: (event: Event) => void;
  private keydownHandler: (event: Event) => void;
  private pointerEnterHandler: (event: Event) => void;
  private pointerLeaveHandler: (event: Event) => void;

  constructor({ props }: { props: AreaProps }) {
    this.props = props;
    this.elm = props.elm;

    let infoArr;

    if (this.elm) {
      const attribute = this.elm.getAttribute(props.config.attributeType);
      infoArr = attribute
        ? attribute.split(props.config.attributeValueSeparator)
        : [];
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

    // a11y: エリアはキーボード操作可能なトグルボタンとして振る舞う
    this.elm.setAttribute('role', 'button');
    this.elm.setAttribute('tabindex', '0');
    this.elm.setAttribute('aria-pressed', 'false');

    // event
    // hover系は Pointer Events を使う (タッチ端末でのhover残留を防ぐため)
    this.clickHandler = this.handleClick.bind(this);
    this.keydownHandler = this.handleKeydown.bind(this);
    this.pointerEnterHandler = this.handlePointerEnter.bind(this);
    this.pointerLeaveHandler = this.handlePointerLeave.bind(this);

    this.elm.addEventListener('click', this.clickHandler);
    this.elm.addEventListener('keydown', this.keydownHandler);
    this.elm.addEventListener('pointerenter', this.pointerEnterHandler);
    this.elm.addEventListener('pointerleave', this.pointerLeaveHandler);

    // style
    this.initStyle();
  }

  // init style
  private initStyle(): void {
    (this.elm as HTMLElement).style.cursor = 'pointer';

    // reduced motion 指定時はtransitionを付与しない
    if (prefersReducedMotion()) return;

    const transitionSpeed = this.props.config.areaChangeSpeed;
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

    const isTranceparent = this.props.config.transparentDefaultAreas;

    this.targetElmsInfo.forEach((info) => {
      // 透明オプションが指定されている場合は優先的に透明にする
      if (isTranceparent) {
        (info.elm as HTMLElement).style.fill = 'transparent';
        (info.elm as HTMLElement).style.stroke = 'transparent';
        return;
      }

      if (info.hasFill) (info.elm as HTMLElement).style.fill = customFillColor;
      if (info.hasStroke)
        (info.elm as HTMLElement).style.stroke = customStrokeColor;
    });
  }

  public render(): void {
    const state = this.props.getState();
    const isActiveView =
      this.id === state.activeAreaId || this.id === state.hoverAreaId;

    // 状態をアクセシビリティとCSSフックの両方へ公開する
    this.elm.setAttribute(
      'aria-pressed',
      String(this.id === state.activeAreaId),
    );
    this.elm.setAttribute(
      'data-mapnj-state',
      isActiveView ? 'active' : 'default',
    );

    isActiveView ? this.activeView() : this.defaultView();
  }

  // event
  //
  private select(): void {
    const state = this.props.getState();
    const isClickSameArea = this.id === state.activeAreaId;

    if (isClickSameArea) {
      this.props.setState({}, ['AREA_CLICK']);
    } else {
      const prevId = state.activeAreaId;
      this.props.setState({ activeAreaId: this.id, prevActiveAreaId: prevId }, [
        'AREA_CLICK',
        'AREA_CHANGE',
      ]);
    }
  }

  private handleClick(e: Event): void {
    e.preventDefault();
    this.select();
  }

  private handleKeydown(e: Event): void {
    const key = (e as KeyboardEvent).key;
    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      this.select();
    }
  }

  private handlePointerEnter(e: Event): void {
    // タッチにhoverの概念は無い
    if ((e as PointerEvent).pointerType === 'touch') return;
    this.props.setState({ hoverAreaId: this.id }, ['AREA_MOUSEOVER']);
  }

  private handlePointerLeave(e: Event): void {
    if ((e as PointerEvent).pointerType === 'touch') return;
    this.props.setState({ hoverAreaId: '' }, ['AREA_MOUSEOUT']);
  }

  // common
  //
  public destroy(): void {
    this.elm.removeEventListener('click', this.clickHandler);
    this.elm.removeEventListener('keydown', this.keydownHandler);
    this.elm.removeEventListener('pointerenter', this.pointerEnterHandler);
    this.elm.removeEventListener('pointerleave', this.pointerLeaveHandler);
  }
}
