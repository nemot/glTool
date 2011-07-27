Ext.define('Gl.model.User', {
    extend: 'Ext.data.Model',
    fields: [
      {name:'id', type:'int'}, 
      {name:'login',  type:'string'}, 
      {name:'email',  type:'string'}, 
      {name:'fio',  type:'string'}, 
      {name:'position',  type:'string'}, 
      {name:'was_online', type:'string'}, 
      {name:'role_id', type:'int'}
    ]
});
