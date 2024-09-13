function() {
    const error = ({{trx.lib.error}});
    return (function(condition, message) {
        try {
            const result = typeof condition === 'function' 
                ? condition() 
                : condition;
            if (!result && result !== 0) {
                error(message);
            }
        } catch(ex) {
            throw ex;
        }
    });
}