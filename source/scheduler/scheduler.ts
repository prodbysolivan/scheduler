import { type ReadonlySignal, Signal } from "@prodbysolivan/signal";
import type { TickProvider } from "../providers/provider.ts";
import type { Channel } from "./channel.ts";

/**
 * Configuration settings for the Scheduler instance.
 */
export interface SchedulerSettings {
  provider: TickProvider;
  tickrate: number;
}

/**
 * The Scheduler orchestrates the execution loop by managing multiple channels
 * and coordinating their updates based on a platform-agnostic provider.
 */
export class Scheduler {
  // #region Lifecycle
  private _provider: TickProvider;
  /** The target frequency of the execution loop. */
  public tickrate: number;
  private _running: boolean = false;
  private _channels: Map<string, Channel> = new Map();
  // #endregion

  // #region Signals
  private _onChannelAdded: Signal<[Channel]> = new Signal();
  private _onChannelRemoved: Signal<[Channel]> = new Signal();
  // #endregion

  /**
   * Initializes a new Scheduler with the specified provider and tick rate.
   * @param settings Configuration settings for the scheduler.
   */
  public constructor(settings: SchedulerSettings) {
    this._provider = settings.provider;
    this.tickrate = settings.tickrate;
  }

  // #region Getters
  /** The current TickProvider instance used to drive the loop. */
  public get provider(): TickProvider {
    return this._provider;
  }

  /** Whether the scheduler loop is currently active. */
  public get running(): boolean {
    return this._running;
  }

  /** Returns an array containing all currently registered channels. */
  public get channels(): Channel[] {
    return [...this._channels.values()];
  }

  /** Signal emitted when a new channel is successfully registered. */
  public get onChannelAdded(): ReadonlySignal<[Channel]> {
    return this._onChannelAdded.asReadonly();
  }

  /** Signal emitted when a channel is removed from the scheduler. */
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
        this._tick(deltaTime);
      }
    });
  }

  public stop(): void {
    this._running = false;
    this._provider.stop();
  }

  private _tick(deltaTime: number): void {
    const sortedChannels = [...this._channels.values()].sort(
      (a, b) => b.priority - a.priority,
    );
    for (const channel of sortedChannels) {
      if (channel.enabled) {
        channel.tick(deltaTime);
      }
    }
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
