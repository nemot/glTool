Ext.define('Rq.store.Costs', {
  extend: 'Ext.data.Store',
  fields:[
    {name:'id', type:'int'},
    {name:'place_id', type:'int'},
    {name:'country_name', type:'string'},
    {name:'name', type:'string'},
    {name:'rate_jd', type:'float'},
    {name:'rate_client', type:'float'},
    {name:'payment_type', type:'int'}
  ],

  autoLoad:true, 
  sorters: [{property : 'id', direction: 'DESC'}],
  
  data: costs

});
