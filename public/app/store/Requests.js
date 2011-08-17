Ext.define('Gl.store.Requests', {
  extend: 'Ext.data.Store',
  model: 'Gl.model.Request',
  autoLoad:true, autoSync:true,
  sorters: [{property : 'id', direction: 'DESC'}],
  proxy: {
    type: 'rest',
    url : '/requests',
    reader: {type:'json', root:'requests'},
    writer: {type:'json', root:'requests', writeAllFields:true}
  }

});
