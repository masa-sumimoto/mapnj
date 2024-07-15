import { MapNJState, MapNJConfig } from './types';

interface ContentProps {
  elm: HTMLElement;
  state: MapNJState;
  config: MapNJConfig;
}

export default class Content {
  private props: ContentProps;
  private elm: HTMLElement;
  private crState: MapNJState;
  private areaId: string;
  private transitionSpeed: number;
  private displayStyle: string;

  constructor({ props }: { props: ContentProps }) {
    this.props = props;
    this.elm = props.elm;
    this.crState = this.props.state;
    this.transitionSpeed = props.config.contentChangeSpeed;
    this.displayStyle = window.getComputedStyle(this.elm).display;
    this.areaId = this.elm.dataset.areaId || '';
  }

  hide() {
    this.elm.style.visibility = 'hidden';
    this.elm.style.opacity = '0';
    this.elm.style.transition = `opacity ${this.transitionSpeed}s ease, visibility 0s linear ${this.transitionSpeed}s`;
    this.elm.style.height = '0';
    this.elm.style.display = 'none';
  }

  show() {
    this.elm.style.display = this.displayStyle;

    setTimeout(() => {
      this.elm.style.visibility = 'visible';
      this.elm.style.opacity = '1';
      this.elm.style.transition = `opacity ${this.transitionSpeed}s ease, visibility 0s`;
      this.elm.style.height = 'auto';
    }, 10);
  }

  render() {
    if (this.crState.activeAreaId === this.areaId) {
      this.show();
    } else {
      this.hide();
    }
  }

  // common
  //
  public updateState(newState: MapNJState): void {
    this.crState = newState;
  }
}
