import {assert, el_ready, invoke} from './common.js';

/** interlayer connects document events to corresponding queue events.
 * @param c:Object - running context (window as default)
 * @param d:Object - root anchor (document) instance
 * @param q:String - queue (dataLayer) name
 **/
module.exports = function(c, d, q) {
    const win = c || window;
    const anchor = d || win.document;
    const queue = win[q] = win[q] || [];

    queue.pub = function(trigger, option, target, event_raw) {
        option = option || {};
        assert(typeof(option)==='object', 'option should be object');
        // log on queue
        queue.push({ 
            event: trigger, 
            '$ev': event_raw,
            '$target': target,
            ...option 
        });
        // invoke on anchor
        invoke(anchor, trigger, option);
    }
    queue.sub = function(trigger, handler) {
        // register the event from anchor
        anchor.addEventListener(trigger, handler);
        // lookup queued logs
        for(const log of queue.filter((ev)=>ev.event === trigger)) {
            handler(log);
        }
    }
    queue.connect = async function(selector, src_event, trigger, retrieval) {
        assert(typeof(retrieval)==='function', 'retrieval should be callable');
        const target = await el_ready(selector, anchor);
        target.addEventListener(src_event, async (ev)=>{
            const option = await retrieval(ev, target);
            queue.pub(trigger, option, target, ev);
        });
    }

    return queue;
}