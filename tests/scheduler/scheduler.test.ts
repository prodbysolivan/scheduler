import { assertEquals, assertThrows } from "@std/assert";
import { assertSpyCall, spy } from "@std/mock";
import { Scheduler } from "../../source/scheduler/scheduler.ts";
import { Channel } from "../../source/scheduler/channel.ts";
import type { TickProvider } from "../../source/providers/provider.ts";

Deno.test("Scheduler: Channel Lifecycle Management", async (testContext) => {
  const mockProvider: TickProvider = { tick: () => {}, stop: () => {} };
  const scheduler = new Scheduler({ provider: mockProvider });
  const channel = new Channel({ id: "test-channel" });

  await testContext.step("should add a channel successfully", () => {
    scheduler.addToChannels(channel);
    assertEquals(scheduler.hasInChannels(channel), true);
    assertEquals(scheduler.channels.length, 1);
  });

  await testContext.step(
    "should throw an error when adding a duplicate channel",
    () => {
      assertThrows(() => scheduler.addToChannels(channel), "already added");
    },
  );

  await testContext.step("should remove a channel successfully", () => {
    scheduler.removeFromChannels(channel);
    assertEquals(scheduler.hasInChannels(channel), false);
    assertEquals(scheduler.channels.length, 0);
  });

  await testContext.step(
    "should throw an error when removing a non-existent channel",
    () => {
      assertThrows(() => scheduler.removeFromChannels(channel), "not added");
    },
  );
});

Deno.test("Scheduler: Execution Loop and Priority", async (testContext) => {
  let capturedTickCallback: (deltaTime: number) => void = () => {};
  const mockProvider: TickProvider = {
    tick: (callback: (dt: number) => void) => {
      capturedTickCallback = callback;
    },
    stop: () => {},
  };

  const scheduler = new Scheduler({ provider: mockProvider});

  const lowPriority = new Channel({ id: "low", priority: 1 });
  const highPriority = new Channel({ id: "high", priority: 10 });

  const lowSpy = spy(lowPriority, "tick");
  const highSpy = spy(highPriority, "tick");

  scheduler.addToChannels(lowPriority);
  scheduler.addToChannels(highPriority);

  await testContext.step("should execute channels ordered by priority", () => {
    scheduler.start();
    capturedTickCallback(0.016);

    assertEquals(highSpy.calls.length, 1);
    assertEquals(lowSpy.calls.length, 1);

    assertSpyCall(highSpy, 0, { args: [0.016] });
  });

  await testContext.step("should not execute when stopped", () => {
    scheduler.stop();
    capturedTickCallback(0.016);

    assertEquals(highSpy.calls.length, 1);
  });
});
