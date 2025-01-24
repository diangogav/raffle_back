import { ContainerBuilder } from "diod";

import { Cron } from "../cron/domain/Cron";
import { NodeCron } from "../cron/infrastructure/NodeCron";
import { EmailSender } from "../email/domain/EmailSender";
import { ResendEmailSender } from "../email/infrastructure/ResendEmailSender";
import { EventBus } from "../event-bus/domain/EventBus";
import { InMemoryEventBus } from "../event-bus/infrastructure/InMemoryEventBus";
import { Logger } from "../logger/domain/Logger";
import { Pino } from "../logger/infrastructure/Pino";
import { SlackMessageSender } from "../slack/domain/SlackMessageSender";
import { SlackBoltMessageSender } from "../slack/infrastructure/SlackBoltMessageSender";

const builder = new ContainerBuilder();

builder.register(EventBus).use(InMemoryEventBus).asSingleton();
builder.register(EmailSender).use(ResendEmailSender).asSingleton();
builder.register(Logger).use(Pino).asSingleton();
builder.register(Cron).use(NodeCron);
builder.register(SlackMessageSender).use(SlackBoltMessageSender).asSingleton();

export const container = builder.build();
