Ext.define('Gl.store.Clients', {
  extend: 'Ext.data.Store',
  model: 'Gl.model.Client',
  autoLoad:true, autoSync:true,
  proxy: {
    type: 'rest',
    url : '/clients',
    reader: {type:'json', root:'clients'},
    writer: {type:'json', root:'clients', writeAllFields:true}
  }

});
