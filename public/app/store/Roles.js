Ext.define('Gl.store.Roles', {
  extend: 'Ext.data.Store',
  autoLoad:true,

  fields:[
    {name:'id', type:'int'},
    {name:'name', type:'string'}
  ],

  proxy: {
    type: 'ajax',
    url : '/users/roles',
    reader: {
      type: 'json',
      root: 'roles'
    }
  }

});
