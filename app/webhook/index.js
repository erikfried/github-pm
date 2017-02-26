const HEADERS = {
    event: 'X-GitHub-Event'.toLowerCase(),        // Name of the event that triggered this delivery.
    signature: 'X-Hub-Signature'.toLowerCase(),   // HMAC hex digest of the payload, using the hook's secret as the key (if configured).
    delivery: 'X-GitHub-Delivery'.toLowerCase()   // Unique ID for this delivery.
};

const defaultHandler = async (ctx, next, event) => {
    console.log('Ignoring event', event, ctx.request.header, JSON.stringify(ctx.request.body));
    await next();
};
const eventHandlers = {
    issues: require('./handlers/issues')
};

module.exports = async (ctx, next) => {
    const event = ctx.request.header[HEADERS.event];
    const handler = eventHandlers[event] || defaultHandler;
    ctx.status = 202;
    await handler(ctx, next, event);

}
