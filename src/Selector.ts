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
  private clickHandler: (event: MouseEvent) => void;
  private mouseoverHandler: (event: MouseEvent) => void;
  private mouseoutHandler: (event: MouseEvent) => void;

  constructor({ props }: { props: SelectorProps }) {
    this.elm = props.elm;
    this.props = props;
    this.areaId = this.elm.dataset.areaId || '';

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
  }

  // event
  //
  private handleClick(e: Event): void {
    e.preventDefault();
    const mouseEvent = e as MouseEvent;
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

  private handleMouseOver(e: Event): void {
    const mouseEvent = e as MouseEvent;
    this.props.setState({ hoverAreaId: this.areaId }, ['SELECTOR_MOUSEOVER']);
  }

  private handleMouseOut(e: Event): void {
    const mouseEvent = e as MouseEvent;
    this.props.setState({ hoverAreaId: '' }, ['SELECTOR_MOUSEOUT']);
  }

  // common
  //
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
