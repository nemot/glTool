

Ext.Loader.setConfig({
  enabled: true,
  paths: {
    'Gl': 'app'
  }
});

// The following is exactly what Ext.application() function does, but
// we use our own Application class that extends Ext.app.Application

Ext.require('Gl.Application');

Ext.onReady(function() {
//  EC.common.ext.form.field.TinyMCEEditor.initTinyMCE();
  Ext.tip.QuickTipManager.init();
  Ext.create('Gl.Application');
});
