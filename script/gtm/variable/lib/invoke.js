function() {
    return (function() {
        const ev = Object.assign(new CustomEvent(event), options);
        target.dispatchEvent(ev);
    });
}