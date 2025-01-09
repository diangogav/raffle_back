import { DomainEventSubscriber } from "../infrastructure/InMemoryEventBus";

export abstract class EventBus {
	abstract subscribe(eventName: string, subscriber: DomainEventSubscriber<unknown>): void;
	abstract publish<T>(eventName: string, event: T): void;
}
