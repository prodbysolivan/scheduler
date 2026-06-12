# Scheduler

> High-performance loop lifecycle manager with priority-based task orchestration.

## Description

A modular and platform-agnostic loop manager built for TypeScript. It uses an event-driven architecture to manage execution loops, allowing developers to group `Tickable` objects into `Channels` and process them based on explicit priority levels, ensuring deterministic and efficient execution across Web, Deno, Node.js, and Bun environments.

## Features

* **Platform-Agnostic**: Compatible with Web, Deno, Node.js, and Bun environments using swappable `TickProvider` implementations.
* **Priority-Based Orchestration**: Group tasks into channels with explicit priority levels for deterministic execution order.
* **Efficient Lifecycle Management**: High-performance loop control optimized for consistent delta-time processing.
* **Modular Design**: Decouples the timing source from the task execution logic for maximum flexibility.

## Getting Started

### Prerequisites

* [Deno 1.40 or higher](https://deno.land/)

### Installation

```bash
deno add @prodbysolivan/scheduler

```

## Quick Usage

```typescript
import { Channel, NodeTickProvider, Scheduler } from "@prodbysolivan/scheduler";

const provider = new NodeTickProvider();
const scheduler = new Scheduler({ provider, tickrate: 60 });
const channel = new Channel({ id: "main-loop", priority: 10 });

channel.addToEntries({
  tick: (dt) => console.log(`Processing tick: ${dt}`),
});

scheduler.addToChannels(channel);
scheduler.start();
```

## Documentation & Help

### Ecosystem Dependencies

* [@prodbysolivan/signal](https://jsr.io/@prodbysolivan/signal)
* [@prodbysolivan/types](https://jsr.io/@prodbysolivan/types)

### Troubleshooting

* **Platform Issues**: For runtime-specific behavior (e.g., `requestAnimationFrame` vs `setInterval`), ensure the correct `TickProvider` is passed to the constructor.
* **Task Execution**: If tasks fail to trigger, verify that the `Channel` is enabled and that `scheduler.start()` has been invoked.

---

## Authors

* **Solivan** ([@solivan](https://github.com/prodbysolivan))

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Acknowledgments

* [Deno Documentation](https://docs.deno.com/)
* [TypeScript Handbook](https://www.typescriptlang.org/docs/)
