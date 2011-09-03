Ext.define('Gl.model.Request', {
  extend: 'Ext.data.Model',

  fields: [
    {name:'id', type:'id'},
    {name:'client_id', type:'int'}, 
    {name:'client_name', type:'string'}, 
    {name:'station_from_id', type:'int'}, 
    {name:'station_from_name', type:'string'}, 
    {name:'station_to_id', type:'int'}, 
    {name:'station_to_name', type:'string'}, 
    {name:'load_id', type:'int'}, 
    {name:'load_name', type:'string'}, 
    {name:'date_of_issue', type:'date', dateFormat:'c'}, 
    {name:'valid_until', type:'date', dateFormat:'c'}, 
    {name:'type_of_transportation', type:'string'}, 
    {name:'ownership', type:'string'}, 
    {name:'car_type_id', type:'int'}, 
    {name:'car_type_name', type:'string'}, 
    {name:'sender', type:'string'}, 
    {name:'receiver', type:'string'}, 
    {name:'gu12', type:'string'}, 
    {name:'rate_for_car', type:'boolean'}, 

    {name:'client_sum', type:'float'}, 
    {name:'jd_sum', type:'float'}, 
    {name:'cars_num', type:'int'}, 
    {name:'common_tonnage', type:'int'}, 
    {name:'created_user_id', type:'int'}
    
  ],
  validations: [
      {type: 'presence',  field: 'created_user_id'}
  ],

  associations: [
    {type: 'belongsTo', model: 'User', name: 'created_user', foreignKey:'created_user_id'}
  ],

  proxy: {
    type: 'rest',
    url : '/requests',
    reader: {type:'json', root:'requests'},
    writer: {type:'json', root:'requests', writeAllFields:true}
  },
});
