module.exports = function(id, queue) {
    // 
    // register base events
    queue.sub(`trx.${id}.init`, ()=>{});

}