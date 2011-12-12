Ext.define('Gl.store.Requests', {
  extend: 'Ext.data.Store',
  model: 'Gl.model.Request',
  autoLoad:true, autoSync:false,
  sorters: [{property : 'id', direction: 'DESC'}],
  
  proxy: {
    type: 'rest', url : '/requests', 
    extraParams:{find_code:true, has_invoice:'all', find_param:'code'},
    reader: {type:'json', root:'requests', idProperty:'id'},
    writer: {type:'json', root:'requests', writeAllFields:true}
  }

});
