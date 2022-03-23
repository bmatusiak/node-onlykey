module.exports = function(cb, step) {
    var plugins = [];

    plugins.push(require("./src/window.js")); //load replacement onlykey need for plugin

    plugins.push(require("./src/onlykey-fido2/plugin_3rdParty.js")); //load onlykey plugin for testing

    plugins.push(require("./src/console/console.js")); //load replacement onlykey need for plugin

    var EventEmitter = require("events").EventEmitter;

    var architect = require("./libs/architect.js");

    plugins.push({
        provides: ["app", "window"],
        consumes: ["hub"],
        setup: function(options, imports, register) {
            register(null, {
                app: new EventEmitter(),
                window: window
            });
        }
    });

    
    architect.createApp(plugins, function(err, app) {
    
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
