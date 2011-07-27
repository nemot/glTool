Ext.define('Gl.store.Users', {
  extend: 'Ext.data.Store',
  model: 'Gl.model.User',
  autoLoad:true, autoSync:true,
  proxy: {
    type: 'rest',
    url : '/users',
    reader: {type:'json', root:'users'},
    writer: {type:'json', root:'users', writeAllFields:true}
  },


  listeners:{
    load:function(cmp){
      
    }
  }

});
