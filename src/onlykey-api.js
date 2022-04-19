module.exports = function(cb, step, $window) {
    var plugins = [];

    plugins.push(require("./onlykey-fido2/plugin_3rdParty.js")); //load onlykey plugin for testing

    var removeConsole = true;

    if (removeConsole)
        plugins.push(require("./console/console.js")); //load replacement onlykey need for plugin
    else
        plugins.push(require("./console/console_debug.js")); //load replacement onlykey need for plugin

    var EventEmitter = require("events").EventEmitter;

    var architect = require("../libs/wp_architect.js");


    plugins.push({
        provides: ["app", "window"],
        consumes: ["hub"],
        setup: function(options, imports, register) {
            register(null, {
                app: new EventEmitter(),
                window: $window || window
            });
        }
    });

    architect(plugins, function(err, app) {

        if (err) return console.error(err);
        app.services.app.core = app.services;
        for (var i in app.services) {
            app.services.app[i] = app.services[i];
        }
        for (var i in app.services) {
            if (app.services[i].init) app.services[i].init(app);
        }

        if (step)
            app.services.onlykeyApi.api.step = function(p) {
                step(p, app.services.onlykeyApi.api.extra.getBrowser());
            };

        cb(app.services.onlykey3rd);


    });


}


