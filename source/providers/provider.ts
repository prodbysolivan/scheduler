/**
 * Defines the contract for providing a recurring tick mechanism.
 */
export interface TickProvider {
  /**
   * Starts the tick loop.
   * @param callback Function to be executed on every tick, receiving the deltaTime.
   */
  tick: (callback: (deltaTime: number) => void) => void;
  /**
   * Stops the tick loop.
   */
  stop: () => void;
}
