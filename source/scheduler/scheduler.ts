import { type ReadonlySignal, Signal } from "@prodbysolivan/signal";
import type { TickProvider } from "../providers/provider.ts";
import type { Channel } from "./channel.ts";

export interface SchedulerSettings {
  provider: TickProvider;
}

export class Scheduler {
  // #region Lifecycle
  private _provider: TickProvider;
  private _running: boolean = false;
  private _channels: Map<string, Channel> = new Map();
  // #endregion

  // #region Signals
  private _onChannelAdded: Signal<[Channel]> = new Signal();
  private _onChannelRemoved: Signal<[Channel]> = new Signal();
  // #endregion

  public constructor(settings: SchedulerSettings) {
    this._provider = settings.provider;
  }

  // #region Getters
  public get provider(): TickProvider {
    return this._provider;
  }

  public get running(): boolean {
    return this._running;
  }

  public get channels(): Channel[] {
    return [...this._channels.values()];
  }

  public get onChannelAdded(): ReadonlySignal<[Channel]> {
    return this._onChannelAdded.asReadonly();
  }

  public get onChannelRemoved(): ReadonlySignal<[Channel]> {
    return this._onChannelRemoved.asReadonly();
  }
  // #endregion

  // #region Methods
  public start(): void {
    if (this._running) return;
    this._running = true;

    this._provider.tick((deltaTime: number) => {
      if (this._running) {
        const sortedChannels = [...this._channels.values()].sort(
          (a, b) => b.priority - a.priority,
        );
        for (const channel of sortedChannels) {
          if (channel.enabled) {
            channel.tick(deltaTime);
          }
        }
      }
    });
  }

  public stop(): void {
    this._running = false;
    this._provider.stop();
  }

  public addToChannels(channel: Channel): void {
    if (this._channels.has(channel.id)) {
      throw new Error(`Channel with id ${channel.id} is already added`);
    }
    this._channels.set(channel.id, channel);
    this._onChannelAdded.fire(channel);
  }

  public removeFromChannels(channel: Channel): void {
    if (!this._channels.has(channel.id)) {
      throw new Error(`Channel with id ${channel.id} is not added`);
    }
    this._channels.delete(channel.id);
    this._onChannelRemoved.fire(channel);
  }

  public hasInChannels(channel: Channel): boolean {
    return this._channels.has(channel.id);
  }

  public getFromChannels(channelId: string): Channel | undefined {
    return this._channels.get(channelId);
  }
  // #endregion
}
