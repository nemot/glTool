

Ext.Loader.setConfig({ enabled: true, paths: { 
  'Rq' : 'app'
//  'Rq.view' : '/request/view',
//  'Rq.model' : '/request/model',
//  'Rq.controller' : '/request/controller',
//  'Rq.store' : '/request/store',
  

} });


Ext.require('Rq.Application');

Ext.onReady(function() {
  Ext.tip.QuickTipManager.init();
  Ext.create('Rq.Application');
  
});
