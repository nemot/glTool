Ext.define('Rq.model.Code', {
  extend: 'Ext.data.Model',

  fields:[
    {name:'id', type:'int'}, 
    {name:'car_id', type:'int'}, 
    {name:'place_id', type:'int'}, 
    {name:'number', type:'string'}, 
    {name:'rate_jd', type:'number'},
    {name:'rate_client', type:'number'}
  ],

});
