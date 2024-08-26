/** utility functions used at common */
// custom exception class
class TrxException extends Exception { constructor(message) { super(`[trx] ${message}`); } }
const error = function(message) { throw new TrxException(message); }
const assert = function(condition, message) {
    if(!condition) { error(`assertion:${message}`) }
}
// single beacon to reduce multiple interval waits
const beacon = setInterval(()=>{
    // lookup list initialize
    if(beacon._list==null) { 
        beacon._list = []; 
        // adding beacon lookup list, async function
        beacon.lookup = (condition, callback, timeout, immortal) => {
            // assert condition callable
            assert(typeof condition === 'function', 'condition should be callable');
            // assert callback callable
            assert(typeof callback === 'function', 'callback should be callable');
            // appending checkup list
            beacon._list.push({
                condition, 
                callback, 
                init: Date.now(), 
                timeout: (timeout || 3600)*1e3,
                immortal,
            });
        };
    }

    // the beacon will continue to run until the end
    const now = Date.now();
    beacon._list = beacon._list.map((lookup) => {
        // sub parameterize
        let {condition, callback, init, timeout, immortal} = lookup;
        // check timeout
        if(timeout && 0<timeout && now-init>timeout) { throw new Error('timeout'); }
        // run condition
        const result = condition();
        let next = lookup
        // has result
        if(result!=null) {
            // run the callback
            callback(result);
            // clear this when it's done
            if(!immortal) { next = null; }
        }
        return next;
    })
    // filter completed lookups
    .filter((l)=>l!=null);
}, 10);

// wait for until condition to be met (not null)
const until = function(condition, timeout) {
    return new Promise((resolve, reject)=>{
        try {
            // assert condition callable
            assert(typeof condition === 'function', 'condition should be callable');
            
            // test pre condition to avoid unnecessary waiting
            const result = condition();
            if(result!=null) {  resolve(result); }
            // register on beacon to complete
            beacon.lookup(condition, resolve, timeout);
        } catch(ex) {
            reject(ex);
        }
    });
};

module.exports = {
    assert,
    error,
    until,
    el_ready:  async function(selector, anchor, timeout, singular=false) {
        assert(typeof(selector)==='string', 'selector should be string');
        assert(anchor instanceof HTMLElement, 'anchor should be HTMLElement');
        const query = singular ? anchor.querySelector : anchor.querySelectorAll;
        return await until(()=>query(selector), timeout);
    },
    invoke: async function(target, event, option) {
        const opts = (typeof(option)==='function')
            // await the return when the option is callable
            ? (await option()) 
            // rebuild option object on other cases
            : (option || {});
        // create event
        const ev = Object.assign(new CustomEvent(event), opts);
        // dispatch event
        target.dispatchEvent(ev);
        // finalize
        return ev;
    }

}