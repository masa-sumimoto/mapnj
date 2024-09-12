import { MapNJState, MapNJConfig, SetState } from './types';

interface ResetSelectorProps {
  elm: HTMLElement;
  config: MapNJConfig;
  getState: () => MapNJState;
  setState: SetState;
}

export default class ResetSelector {
  private props: ResetSelectorProps;
  private elm: HTMLElement;
  private clickHandler: (event: MouseEvent) => void;

  constructor({ props }: { props: ResetSelectorProps }) {
    this.elm = props.elm;
    this.props = props;

    // event
    this.clickHandler = this.handleClick.bind(this);

    this.elm.addEventListener('click', this.clickHandler as EventListener);
  }

  // event
  //
  private handleClick(e: Event): void {
    e.preventDefault();

    const state = this.props.getState();
    const isAlreadyAreaResetState = state.activeAreaId === '';

    if (isAlreadyAreaResetState) {
      this.props.setState({}, ['RESET_SELECTOR_CLICK']);
    } else {
      this.props.setState(
        {
          activeAreaId: '',
          prevActiveAreaId: state.activeAreaId,
        },
        ['RESET_SELECTOR_CLICK', 'AREA_CHANGE'],
      );
    }
  }

  // common
  //
  public destroy(): void {
    this.elm.removeEventListener('click', this.clickHandler as EventListener);
  }
}
