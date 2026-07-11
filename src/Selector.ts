import { MapNJState, MapNJConfig, SetState } from './types';

interface SelectorProps {
  elm: HTMLElement;
  config: MapNJConfig;
  getState: () => MapNJState;
  setState: SetState;
}

export default class AreaSelector {
  private props: SelectorProps;
  public areaId: string;
  private elm: SVGElement | HTMLElement;
  private clickHandler: (event: Event) => void;
  private pointerEnterHandler: (event: Event) => void;
  private pointerLeaveHandler: (event: Event) => void;

  constructor({ props }: { props: SelectorProps }) {
    this.elm = props.elm;
    this.props = props;
    this.areaId = this.elm.dataset.areaId || '';

    // event
    // hover系は Pointer Events を使う (タッチ端末でのhover残留を防ぐため)
    this.clickHandler = this.handleClick.bind(this);
    this.pointerEnterHandler = this.handlePointerEnter.bind(this);
    this.pointerLeaveHandler = this.handlePointerLeave.bind(this);

    this.elm.addEventListener('click', this.clickHandler);
    this.elm.addEventListener('pointerenter', this.pointerEnterHandler);
    this.elm.addEventListener('pointerleave', this.pointerLeaveHandler);
  }

  // event
  //
  private handleClick(e: Event): void {
    e.preventDefault();
    const state = this.props.getState();

    const isSelectSameArea = this.areaId === state.activeAreaId;

    if (isSelectSameArea) {
      this.props.setState({}, ['SELECTOR_CLICK']);
    } else {
      const prevId = state.activeAreaId;
      this.props.setState(
        { activeAreaId: this.areaId, prevActiveAreaId: prevId },
        ['SELECTOR_CLICK', 'AREA_CHANGE'],
      );
    }
  }

  private handlePointerEnter(e: Event): void {
    // タッチにhoverの概念は無い
    if ((e as PointerEvent).pointerType === 'touch') return;
    this.props.setState({ hoverAreaId: this.areaId }, ['SELECTOR_MOUSEOVER']);
  }

  private handlePointerLeave(e: Event): void {
    if ((e as PointerEvent).pointerType === 'touch') return;
    this.props.setState({ hoverAreaId: '' }, ['SELECTOR_MOUSEOUT']);
  }

  // common
  //
  public destroy(): void {
    this.elm.removeEventListener('click', this.clickHandler);
    this.elm.removeEventListener('pointerenter', this.pointerEnterHandler);
    this.elm.removeEventListener('pointerleave', this.pointerLeaveHandler);
  }
}
