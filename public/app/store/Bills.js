Ext.define('Gl.store.Bills', {
  extend: 'Ext.data.Store',
  model: 'Gl.model.Bill',
  autoLoad:false, autoSync:true,
  sorters: [{property : 'id', direction: 'DESC'}],
  proxy: {
    type: 'rest',
    url : '/bills', extraParams:{inbox:false},
    reader: {type:'json', root:'bills',},
    writer: {type:'json', root:'bills', writeAllFields:true}
  }

});
