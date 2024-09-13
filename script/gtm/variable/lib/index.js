function() {
    const lib = {};
    lib.error = ({{trx.lib.error}}).bind(lib);
    lib.assert = ({{trx.lib.assert}}).bind(lib);
    lib.until = ({{trx.lib.until}}).bind(lib);
    lib.await_element = ({{trx.lib.await_element}}).bind(lib);
    lib.invoke = ({{trx.lib.invoke}}).bind(lib);
    lib.sendPixel = ({{trx.lib.sendPixel}}).bind(lib);
    lib.maps = ({{trx.lib.maps}}).bind(lib);
    lib.findVue = ({{trx.lib.findVue}}).bind(lib);
    lib.findReact = ({{trx.lib.findReact}}).bind(lib);

    return lib;
}