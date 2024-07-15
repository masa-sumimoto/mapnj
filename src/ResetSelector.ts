import { MapNJState, MapNJConfig, SetState } from './types';

interface ResetSelectorProps {
  elm: HTMLElement;
  state: MapNJState;
  config: MapNJConfig;
  setState: SetState;
}

export default class ResetSelector {
  private props: ResetSelectorProps;
  private crState: MapNJState;
  private elm: HTMLElement;
  private clickHandler: (event: MouseEvent) => void;

  constructor({ props }: { props: ResetSelectorProps }) {
    this.elm = props.elm;
    this.props = props;
    this.crState = props.state;

    // event
    this.clickHandler = this.handleClick.bind(this);

    this.elm.addEventListener('click', this.clickHandler as EventListener);
  }

  // event
  //
  private handleClick(e: Event): void {
    e.preventDefault();

    const isAlreadyAreaResetState = this.crState.activeAreaId === '';

    if (isAlreadyAreaResetState) {
      this.props.setState({}, ['RESET_SELECTOR_CLICK']);
    } else {
      this.props.setState(
        {
          activeAreaId: '',
          prevActiveAreaId: this.crState.activeAreaId,
        },
        ['RESET_SELECTOR_CLICK', 'AREA_CHANGE'],
      );
    }
  }

  // common
  //
  public updateState(newState: MapNJState): void {
    this.crState = newState;
  }

  public destroy(): void {
    this.elm.removeEventListener('click', this.clickHandler as EventListener);
  }
}
