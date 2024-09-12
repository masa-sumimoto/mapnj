import { MapNJState, MapNJConfig } from './types';

interface BgProps {
  config: MapNJConfig;
  getState: () => MapNJState;
}

export default class Bg {
  private props: BgProps;
  public elm: HTMLElement;

  constructor({ props }: { props: BgProps }) {
    this.props = props;

    // wraper tag
    this.elm = document.createElement('div');
    this.elm.className = 'mapnj-bg-container';
    this.elm.style.content = ' ';
    this.elm.style.position = 'absolute';
    this.elm.style.top = '0';
    this.elm.style.left = '0';
    this.elm.style.width = '100%';
    this.elm.style.height = '100%';
    this.elm.style.zIndex = '-1';

    // エリア選択時の画像
    Object.keys(this.props.config.bgImages).forEach((key) => {
      const imgElm = document.createElement('img');
      this.createImgTag(imgElm, key, this.props.config.bgImages[key]);
      this.elm.appendChild(imgElm);
    });

    // 画像選択がない場合の画像
    if (this.props.config.bgDefaultImage) {
      const noSelectionImgElm = document.createElement('img');
      this.createImgTag(
        noSelectionImgElm,
        'noSelection',
        this.props.config.bgDefaultImage,
      );
      this.elm.appendChild(noSelectionImgElm);
    }
  }

  createImgTag(elm: HTMLImageElement, id: string, picPath: string) {
    elm.dataset.id = id;
    elm.style.position = 'absolute';
    elm.style.top = '0';
    elm.style.left = '0';
    elm.style.width = '100%';
    elm.style.height = '100%';
    elm.style.objectFit = 'cover';
    elm.style.objectPosition = 'center center';
    elm.src = picPath;
    elm.style.transition = `opacity ${this.props.config.bgChangeSpeed}s ease-in-out`;
    elm.style.opacity = '0';
    elm.style.filter = `brightness(${this.props.config.bgBrightness}%)`;
  }

  render() {
    const state = this.props.getState();
    const existingPic = this.elm.querySelector(
      '[data-id].--active',
    ) as HTMLElement;

    const newPic = state.activeAreaId
      ? (this.elm.querySelector(
          `[data-id='${state.activeAreaId}']`,
        ) as HTMLElement)
      : (this.elm.querySelector('[data-id="noSelection"]') as HTMLElement);

    if (existingPic) {
      existingPic.style.opacity = '0';
      existingPic.classList.remove('--active');
    }

    if (newPic) {
      newPic.classList.add('--active');
      newPic.style.opacity = '1';
    }
  }
}
