function() {
    // TODO: project source objects into target with maps keys
    return (function(source, maps) {
        const target = {};
        for (const key in maps) {
            target[key] = source[maps[key]];
        }
        return target;
    });
}