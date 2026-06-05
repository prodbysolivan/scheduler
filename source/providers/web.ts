import type { TickProvider } from "./provider.ts";

export class WebTickProvider implements TickProvider {
  private _frameId: number = 0;
  private _lastTime: number = performance.now();

  tick(callback: (deltaTime: number) => void) {
    const loop = (now: number) => {
      callback((now - this._lastTime) / 1000);
      this._lastTime = now;
      // ts-ignore
      this._frameId = requestAnimationFrame(loop);
    };
    // ts-ignore
    this._frameId = requestAnimationFrame(loop);
  }

  stop() {
    // ts-ignore
    cancelAnimationFrame(this._frameId);
  }
}
