---
title: "Build for the Agent, Not Just the Human"
seoTitle: "Your Chatbot Isn't Your AI Strategy. Build This Instead. | Prishan Fernando"
description: "What happens when customers send AI agents instead of visiting your website? Four design principles to help your software stay useful beyond the chat bubble."
image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
date: "2026-11-06"
excerpt: "You built a chatbot. Your next customer might send an agent that never opens it. Here's what to build underneath the chat bubble—and why it matters more than the model you choose."
tags: ["AI", "agents", "API design"]
published: true
---

# Build for the Agent, Not Just the Human

*How to design software that survives the AI era, and why the chat bubble in the corner of your website already feels like a relic.*

> **What prompted this:** I was working through a Salesforce Agentforce Studio hands-on challenge on Trailhead. Looking at the outcome it was trying to achieve, and how much setup it took to get there, I started wondering what AI architecture will look like a few years from now. Based on some of the more advanced AI capabilities I've been working with, I went back to first principles. This article is where that thinking landed.

---

Every technology era has its horseless carriage: the clumsy first attempt to bolt a new engine onto an old way of doing things. The earliest automobiles looked like wagons with the horse removed. Early websites looked like brochures. Early smartphone apps looked like shrunken desktop software.

We are living through the horseless-carriage era of AI agents. Companies are taking the workflows they already had—CRM case routing, web forms, help-desk tickets—and strapping a large language model on top. The result is a chatbot bubble in the bottom-right corner of the website, proudly branded and, in my view, quietly doomed.

If you are building software today, the most important question is not *which model should I use?* It is *what will still matter when the model, the interface, and the user's habits have all changed?*

This article is a first-principles attempt to answer that question.

## Part One: Where Customer Experience Is Actually Heading

### 1. The chat bubble is a transitional artifact

Why does your favorite hotel, airline, or retailer have a little chat widget on its site? Not because it is the best way to serve you. It exists because companies had already built websites, and adding a chat window was the path of least resistance for adding AI to existing architecture.

Now imagine how this could play out in a few years. You do not open a resort's website, click the chat icon, and prove who you are by typing an email address and a membership number. Instead, your own personal agent—running on your phone, your glasses, or your operating system—already knows your preferences, your budget, and your calendar. It speaks directly to the resort's backend, negotiates the booking, and hands you a single confirmation.

That is a prediction, not a timetable. Adoption will be uneven, and plenty of people will still want a human-friendly website. But in that world, a brand-owned chat bubble on a single web page will feel as antiquated as a static contact form or a page of FAQs does today. Customers will not *visit* your bot. Their agents will *call* your systems.

### 2. Conversation is a starting gesture, not the destination

Large language models made natural language the easiest way to *begin* a task. But for transactions, typing paragraphs into a chat window is surprisingly high-friction.

Say you tell a bot, "Book a sunset kayak tour for two." A rigid reply that asks, "What date would you like?" is tedious. The better experience is an interface that assembles itself around your intent: a visual timeline of open slots, a map of the beach, a one-tap Apple Pay or Google Pay confirmation card—all generated on the fly from context.

Language is how the intent begins. Structured, frictionless execution is how it ends. The future interface is multimodal and dynamic, and it uses conversation the way a good concierge does: briefly, and only until the problem is understood.

### 3. Execution beats eloquence, every time

Nobody cares how charming your bot is. A model that can write a gorgeous paragraph about a sunset kayak tour but cannot actually lock the inventory, apply the discount code, or process a refund is a failure, however fluent it sounds.

The winners in customer experience will not be the companies with the most eloquent language model. The trend is clear: models keep getting cheaper and more capable—often on a roughly quarterly cadence—enough that treating any one model as a moat looks increasingly risky. The winners will be the companies with the most robust, API-driven, low-latency execution layers underneath. If an agent cannot complete the transaction loop quickly enough to feel responsive, the customer—or the customer's agent—will simply go elsewhere.

### 4. From cost center to autonomous relationship

For two decades, customer service automation has been a defensive play. Deflect tickets, shrink the support team, protect margins. The bot was a shield.

Agents flip that logic. Because they can run around the clock across your whole data graph, they do not have to wait to be asked. A genuinely useful agent notices that your flight is delayed, rebooks your resort activity, sends you a heads-up, and adjusts your itinerary before you feel the stress. That is not support. That is a relationship, and relationships are where revenue lives.

Put these four shifts together and a direction of travel becomes clear—not an inevitability, but a useful design target. Explicit, multi-step chatbot flows will matter less. What grows in their place is interoperable agent-to-system work, where software transacts with software in the background, and humans step in to state high-level intent, approve sensitive actions, or supply something no machine can: empathy.

## Part Two: How to Build So You Don't Become Obsolete

Knowing where the road leads is only half the work. The other half is building something that will still be useful when you arrive. The biggest trap today is constructing heavy applications around rigid human workflows—manual data-entry forms, multi-step wizards, proprietary UI components—that an autonomous agent can bypass entirely.

That does not mean throw away the human interface. People still need clear screens, accessibility, and a path that works when no agent is involved. It means stop treating the UI as the only door into your product.

Here are four design principles that hold up.

### Principle 1: Make your application a native citizen of the agent world

Do not build a backend that exists only to feed your own front end. Expose the full functional core of your product through standardized, machine-readable interfaces.

In practice, that usually means two complementary layers:

- **OpenAPI** for your business API contract: paths, schemas, errors, and declared security schemes so clients know how to authenticate and what each operation expects.
- **MCP (Model Context Protocol)** as an agent-facing discovery and invocation layer: tools with names, descriptions, and JSON Schema inputs that an AI client can list and call.

MCP is useful because it gives agents a shared way to discover and invoke tools. It does **not** by itself guarantee universal interoperability, perfect authentication, regulatory compliance, or exactly-once payments. HTTP MCP can use OAuth 2.1-style authorization when you enable it; authorization is optional in the protocol, and your product still has to enforce scopes, consent, and business rules. OpenAPI documents the API; your services still have to implement the guarantees.

Why it matters: when a customer's personal agent wants to use your product, it should not have to click through your website like a confused tourist. It should discover what it is allowed to do, call well-defined operations, and get deterministic results. If your product speaks clean OpenAPI and offers a well-scoped MCP surface, it does not matter as much what interface humans are using in five years. Your backend remains a tool other systems can plug into.

### Principle 2: Separate the brain from the face

Many traditional apps knot together the user interface, the business logic, and the data store. That was fine when the interface *was* the product. It is risky when interfaces are changing faster than at any point in history—desktop to mobile, to voice, to spatial computing, to agent dialogs.

Not every codebase is a monolith, and not every monolith is doomed. The point is the dependency: if your domain rules live only inside screens, every interface shift becomes a rewrite.

Keep domain logic in clean, isolated backend services—small serverless functions or well-bounded modules designed around your domain. Treat every interface as a replaceable skin. If you can swap the front end without touching the business rules, you can survive an interface shift. Keep the human UI usable and accessible in the meantime; agents should get a first-class path, not the only path.

### Principle 3: Embrace headless and generative UI

Stop hand-coding a rigid screen for every possible edge case. Instead of a static form with ten hardcoded fields, imagine your backend returning a semantic schema—a blueprint that says *here is what I need, here are the valid options, here are the constraints*. A browser, a mobile app, or an AI chat surface can then render the right control instantly.

This turns your product from a set of fixed pages into a fluid, intent-driven canvas. It also means that when a new surface appears—whether glasses, a car dashboard, or something nobody has invented yet—your product can show up there without a rewrite.

Keep the boring basics: labels that make sense to humans, keyboard and screen-reader friendly controls, and clear errors when something fails. Generative UI is only an upgrade if people can still complete the task without guessing.

### Principle 4: Own the data and the deterministic core

Here is the sober truth about AI models: they are brilliant at reasoning, summarizing, and orchestrating, and they are unreliable at being a system of record. They do not enforce compliance. They do not keep an audit trail. They do not guarantee that a payment posted exactly once.

That is your opportunity. Be the **system of record** for a specific domain—rental property management or childcare operations, for example. Handle data integrity, permissions, financial transactions, and audit history with deterministic code. Models will keep getting cheaper and smarter. Clean proprietary data and trustworthy execution will not be a commodity in the same way.

If you provide the secure data layer and the guardrails that autonomous agents depend on, you are not a wrapper around someone else's AI. You are an essential node in the ecosystem.

A few practical guardrails belong in that deterministic core:

- **Permission, scope, and consent.** Least-privilege scopes for agent tools. Explicit user consent before write actions that move money, change bookings, or touch other people's data. Step-up approval when an agent asks for more capability than it was granted.
- **Retries and idempotency.** Agents retry. Your create-booking or charge-payment endpoints should accept an idempotency key (or equivalent) so a double call does not double-book or double-charge.
- **Audit and human approval.** Log who (or which agent) did what, with which grant, and when. For irreversible or high-value actions, require a human confirm step before the agent proceeds.

MCP and OpenAPI help agents find and call your tools. These rules are what make those calls safe to trust.

## The Test to Run on Every Feature

Before you build anything, ask one question:

> **If an autonomous AI agent were trying to accomplish this goal on behalf of a human, would it prefer to use my software, or would it route around it?**

If the agent has to fight your interface to get the job done, you are building on borrowed time. If it finds clean, secure, fast tools it can orchestrate—with clear permissions and a human fallback—you are building something that lasts.

## A Practical Checklist

- **Can every core action be performed through an API**, with no UI required?
- **Do you have a clear OpenAPI contract** for those business operations, including auth and error shapes?
- **Is there an MCP server** (or a plan for one) that exposes a scoped subset of those tools for agents—without treating MCP as a substitute for your API or your security model?
- **Is your business logic separate** from your presentation layer?
- **Can your front end render from structured payloads** rather than only hardcoded screens—while staying usable and accessible for humans?
- **Do you hold something an AI cannot fake**: authoritative data, compliance controls, audit trails, or transaction integrity?
- **Is every action permissioned, scoped, and logged**, with human approval for sensitive steps, so people can trust what agents do on their behalf?
- **Are write operations idempotent**, so agent retries do not create duplicate side effects?

## The Bottom Line

The companies that thrive in the next decade will not be the ones with the flashiest chatbot. They will be the ones that quietly became the most dependable *infrastructure* for other people's agents: fast, trustworthy, well documented, and hard to route around.

The horseless carriage did not end when someone built a better horse-less wagon. It ended when someone realized the whole road needed to be redesigned. Do not build a nicer chat bubble. Build the engine that agents will want to plug into—and keep a human interface that still works—while the future decides what the next surface looks like.

## Further reading

- [What is the Model Context Protocol (MCP)?](https://modelcontextprotocol.io/docs/2025-11-25/getting-started/intro)
- [MCP Authorization (OAuth 2.1 for HTTP transports)](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [MCP Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.2.0.html)
- [Describing API Security in OpenAPI](https://learn.openapis.org/specification/security.html)
