Ext.define('Gl.store.Clients', {
  extend: 'Ext.data.Store',
  model: 'Gl.model.Client',
  autoLoad:true, autoSync:true,
  sorters: [{property : 'id', direction: 'DESC'}],
  proxy: {
    type: 'rest',
    url : '/clients',
    reader: {type:'json', root:'clients'},
    writer: {type:'json', root:'clients', writeAllFields:true},
    extraParams: { only_exp:false }
  }

});
