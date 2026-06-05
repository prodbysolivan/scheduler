/**
 * Represents an object that can be updated in a time-based loop.
 */
export interface Tickable {
  /**
   * Called every tick to update the object's state.
   * @param deltaTime The time elapsed since the last tick, in seconds.
   */
  tick(deltaTime: number): void;
}
