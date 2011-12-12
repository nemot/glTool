Ext.define('Gl.store.Clients', {
  extend: 'Ext.data.Store',
  model: 'Gl.model.Client',
  id:'clientsStore',
  autoLoad:true, autoSync:true,
  sorters: [{property : 'id', direction: 'DESC'}],
  proxy: {
    type: 'rest',    url : '/clients',
    reader: {type:'json', root:'clients', idProperty:'id'},
    writer: {type:'json', root:'clients', writeAllFields:true},
    extraParams: { only_exp:false }
  }

});
