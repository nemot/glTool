Ext.define('Gl.store.Requests', {
  extend: 'Ext.data.Store',
  model: 'Gl.model.Request',
  autoLoad:true, autoSync:false,
  sorters: [{property : 'id', direction: 'DESC'}],
  
  proxy: {
    type: 'rest',
    url : '/requests', extraParams:{find_code:true},
    reader: {type:'json', root:'requests',},
//    writer: {type:'json', root:'requests', writeAllFields:true}
  }

});
