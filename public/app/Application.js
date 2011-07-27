/**
 * Main application definition for Gl app.
 *
 * We define our own Application class because this way we can also
 * easily define the dependencies.
 */
Ext.define('Gl.Application', {
    extend: 'Ext.app.Application',
    name: 'Gl',

    requires: [],

    controllers: [
      'TopMenu',
      'Users'
    ],

    autoCreateViewport: true,

    launch: function() {
        Gl.App = this;
        // When google analytics event tracking script present on page
        if (Gl.initEventTracking) {
            Gl.initEventTracking();
        }
      Ext.getBody().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});
    }
});
