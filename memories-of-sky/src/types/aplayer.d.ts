declare module 'aplayer' {
  interface APlayerAudio {
    name: string;
    artist: string;
    url: string;
    cover: string;
    lrc: string;
  }

  interface APlayerOptions {
    container: HTMLElement;
    audio: APlayerAudio[];
    mutex?: boolean;
    volume?: number;
    lrcType?: number;
  }

  interface APlayerList {
    audios: APlayerAudio[];
    index: number;
    switch(index: number): void;
  }

  class APlayer {
    constructor(options: APlayerOptions);
    audio: HTMLMediaElement;
    list: APlayerList;
    play(): Promise<void> | void;
    pause(): void;
    toggle(): void;
    volume(percentage: number, nostorage?: boolean): void;
    skipForward(): void;
    skipBack(): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event: string, handler: (...args: any[]) => void): void;
    destroy(): void;
  }

  export default APlayer;
}
