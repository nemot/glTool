Ext.define('Rq.model.User', {
    extend: 'Ext.data.Model',
    fields: [
      {name:'id', type:'int'}, 
      {name:'login',  type:'string'}, 
      {name:'email',  type:'string'}, 
      {name:'fio',  type:'string'}, 
      {name:'position',  type:'string'}, 
      {name:'was_online', type:'string'}, 
      {name:'role_id', type:'int'}
    ],
    is_engineer:function(){ return this.get('role_id')==4 },
    is_admin:function(){ return this.get('role_id')!=4 },


    proxy: {
      type: 'rest',
      url : '/users',
      reader: {type:'json', root:'users'},
      writer: {type:'json', root:'users', writeAllFields:true}
    },
});
