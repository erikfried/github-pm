const HEADERS = {
    event: 'X-GitHub-Event',        // Name of the event that triggered this delivery.
    signature: 'X-Hub-Signature',   // HMAC hex digest of the payload, using the hook's secret as the key (if configured).
    delivery: 'X-GitHub-Delivery'   // Unique ID for this delivery.
};

async function issuesHandler(ctx, next) {
    console.log('ctx', ctx.request.body);
    next();
}

const defaultHandler = (ctx, next, event) => {
    console.log('Ignoring event', event, ctx.request.body);
    next();
};
const eventHandlers = {
    issues: issuesHandler
};

module.exports = (ctx, next) => {
    const event = ctx.request.header[HEADERS.event];
    const handler = eventHandlers[event] || defaultHandler;
    handler(ctx, next, event);
    ctx.status = ctx.status || 202;
}
