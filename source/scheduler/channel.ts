import { type ReadonlySignal, Signal } from "@prodbysolivan/signal";
import type { Tickable } from "../common/types/tickable.ts";

/**
 * Configuration settings for a Channel instance.
 */
export interface ChannelSettings {
  id: string;
  name?: string;
  description?: string;
  priority?: number;
}

/**
 * A Channel groups Tickable entries and processes them during a tick cycle.
 */
export class Channel {
  // #region Metadata
  /** Unique identifier for the channel. */
  public readonly id: string;
  /** Human-readable name of the channel. */
  public readonly name: string;
  /** Detailed description of the channel's purpose. */
  public readonly description: string;
  /** Priority level determining execution order; higher values execute first. */
  public readonly priority: number;

  // #region Lifecycle
  private _enabled: boolean = true;
  private _entries: Tickable[] = [];

  // #region Signals
  private _onTick: Signal<[number]> = new Signal();
  private _onEnabledChanged: Signal<[boolean]> = new Signal();
  private _onEntryAdded: Signal<[Tickable]> = new Signal();
  private _onEntryRemoved: Signal<[Tickable]> = new Signal();
  // #endregion

  /**
   * Initializes a new Channel with the provided settings.
   */
  constructor(settings: ChannelSettings) {
    this.id = settings.id;
    this.name = settings.name ?? this.id;
    this.description = settings.description ?? "No description provided";
    this.priority = settings.priority ?? 0;
  }

  // #region Getters
  /** Whether the channel is currently permitted to process ticks. */
  public get enabled(): boolean {
    return this._enabled;
  }

  /** The collection of currently registered Tickable entries. */
  public get entries(): Tickable[] {
    return this._entries;
  }

  /** Signal emitted whenever the enabled state is toggled. */
  public get onTick(): ReadonlySignal<[number]> {
    return this._onTick;
  }
  public get onEnabledChanged(): ReadonlySignal<[boolean]> {
    return this._onEnabledChanged;
  }

  /** Signal emitted when a new entry is added to the channel. */
  public get onEntryAdded(): ReadonlySignal<[Tickable]> {
    return this._onEntryAdded;
  }

  /** Signal emitted when an entry is removed from the channel. */
  public get onEntryRemoved(): ReadonlySignal<[Tickable]> {
    return this._onEntryRemoved;
  }
  // #endregion

  // #region Setters
  /** Sets the enabled state of the channel and fires the corresponding signal. */
  public set enabled(value: boolean) {
    this._enabled = value;
    this._onEnabledChanged.fire(value);
  }
  // #endregion

  // #region Methods
  public tick(deltaTime: number): void {
    this._onTick.fire(deltaTime);
    if (!this._enabled) throw new Error(`Channel ${this.id} is not enabled`);
    for (const entry of this._entries) {
      entry.tick(deltaTime);
    }
  }

  public addToEntries(entry: Tickable): void {
    if (this._entries.includes(entry)) {
      throw new Error(`Entry ${entry} is already added`);
    }
    this._entries.push(entry);
    this._onEntryAdded.fire(entry);
  }

  public removeFromEntries(entry: Tickable): void {
    if (!this._entries.includes(entry)) {
      throw new Error(`Entry ${entry} is not added`);
    }
    this._entries.splice(this._entries.indexOf(entry), 1);
    this._onEntryRemoved.fire(entry);
  }

  public hasInEntries(entry: Tickable): boolean {
    return this._entries.includes(entry);
  }
  // #endregion
}
