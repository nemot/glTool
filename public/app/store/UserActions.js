Ext.define('Gl.store.UserActions', {
  extend: 'Ext.data.Store',
  autoLoad:false,
  fields:[
    {name:'id', type:'int'},
    {name:'created_at', type:'date', dateFormat:'c'},
    {name:'action', mapping:'humanized_action', type:'string'},
    {name:'entity', type:'string'}
  ],

  proxy: { type: 'ajax', url : '/actions/', reader: { type: 'json', root: 'actions' } }

});
