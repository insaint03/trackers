/**
 * interLayer function pub (trigger event)
 *  @param event:String dataLayer firing event name
 *  @param retrieval:Object|Function dataLayer options retrieval
 **/
function() {
    return (function(event, retrieval){
        const assert = this.lib.assert;
        const queue = this.queue;
        const options = typeof retrieval === 'function' ? retrieval() : retrieval;
        assert(typeof(options) === 'object', 'retrieval must be object or function');
        queue.push(Object.assign({event: event}, options));
    });
}