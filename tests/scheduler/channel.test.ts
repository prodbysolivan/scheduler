import { assertEquals, assertThrows } from "@std/assert";
import { assertSpyCall, spy } from "@std/mock";
import { Channel } from "../../source/scheduler/channel.ts";
import type { Tickable } from "@prodbysolivan/types";

Deno.test("Channel: Entry Management", async (testContext) => {
  const channel = new Channel({ id: "management-test" });
  const entry: Tickable = { tick: () => {} };

  await testContext.step("should add an entry successfully", () => {
    channel.addToEntries(entry);
    assertEquals(channel.hasInEntries(entry), true);
    assertEquals(channel.entries.length, 1);
  });

  await testContext.step(
    "should throw an error when adding a duplicate entry",
    () => {
      assertThrows(() => channel.addToEntries(entry), "already added");
    },
  );

  await testContext.step("should remove an entry successfully", () => {
    channel.removeFromEntries(entry);
    assertEquals(channel.hasInEntries(entry), false);
    assertEquals(channel.entries.length, 0);
  });

  await testContext.step(
    "should throw an error when removing a non-existent entry",
    () => {
      assertThrows(() => channel.removeFromEntries(entry), "not added");
    },
  );
});

Deno.test("Channel: Execution Loop", async (testContext) => {
  const channel = new Channel({ id: "loop-test" });
  const mockEntry = { tick: spy((_dt: number) => {}) };

  channel.addToEntries(mockEntry);

  await testContext.step(
    "should propagate tick to entries when enabled",
    () => {
      channel.tick(0.016);
      assertSpyCall(mockEntry.tick, 0, { args: [0.016] });
    },
  );

  await testContext.step("should throw error on tick when disabled", () => {
    channel.enabled = false;
    assertThrows(() => channel.tick(0.016), "is not enabled");
  });
});
