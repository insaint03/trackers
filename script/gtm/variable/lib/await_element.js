function() {
    const until = ({{trx.lib.until}});
    return (function(selector, anchor, timeout) {
        return until(()=>anchor.querySelector(selector), timeout);
    });
}