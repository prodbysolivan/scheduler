# Scheduler

High-performance loop lifecycle manager with priority-based task orchestration.

## Description

A modular and platform-agnostic loop manager built for TypeScript. It uses an
event-driven architecture to manage execution loops, allowing developers to
group `Tickable` objects into `Channels` and process them based on explicit
priority levels, ensuring deterministic and efficient execution across Web,
Deno, Node.js, and Bun environments.

### Dependencies

- Deno 1.40 or higher
- [@prodbysolivan/signal](https://jsr.io/@prodbysolivan/signal)
- [@prodbysolivan/types](https://jsr.io/@prodbysolivan/types)

### Installing

Add the package to your project directly via JSR:

```bash
deno add @prodbysolivan/scheduler
```

### Quick Usage

Define your `TickProvider` and initialize the scheduler to start your loop:

```typescript
import { Channel, NodeTickProvider, Scheduler } from "@prodbysolivan/scheduler";

// Initialize a provider to handle the timing source (Node.js/Deno environment)
const provider = new NodeTickProvider();

// Create the scheduler instance with a specific tick rate (e.g., 60 ticks per second)
const scheduler = new Scheduler({ provider, tickrate: 60 });

// Create a communication channel with a defined ID and priority
const channel = new Channel({ id: "main-loop", priority: 10 });

// Register a task within the channel to execute code on every tick
channel.addToEntries({
  tick: (dt) => console.log(`Processing tick: ${dt}`), // dt represents delta time
});

// Register the channel to the scheduler and start the process
scheduler.addToChannels(channel);
scheduler.start();
```

## Help

For platform-specific issues (e.g., `requestAnimationFrame` vs `setInterval`),
ensure you are passing the correct `TickProvider` implementation for your
runtime environment. If tasks are not executing, verify that the `Channel` is
enabled and the `Scheduler` has been started.

## Authors

Solivan (prodbysolivan)

[@solivan](https://github.com/prodbysolivan)

## License

This project is licensed under the MIT License - see the LICENSE file for
details.

## Acknowledgments

- [Deno Documentation](https://docs.deno.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
