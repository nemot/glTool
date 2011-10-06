Ext.define('Rq.model.Place', {
  extend: 'Ext.data.Model',
  idProperty:'id',
  fields:[
    {name:'id', type:'int'}, 
    {name:'exp_id', type:'int'}, 
    {name:'country_id', type:'int'},     
    {name:'country_name', type:'string'},
    {name:'expeditor_name', type:'string'}
  ],

  belongsTo:'Country'
});
