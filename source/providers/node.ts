import type { TickProvider } from "./provider.ts";

export class NodeTickProvider implements TickProvider {
  private _timer: ReturnType<typeof setInterval> | null = null;
  private _lastTime: number = Date.now();

  tick(callback: (deltaTime: number) => void) {
    this._timer = setInterval(() => {
      const now = Date.now();
      callback((now - this._lastTime) / 1000);
      this._lastTime = now;
    }, 16);
  }

  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
}
