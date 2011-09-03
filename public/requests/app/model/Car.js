Ext.define('Rq.model.Car', {
  extend: 'Ext.data.Model',

  fields:[
    {name:'id', type:'int'}, 
    {name:'in_use', type:'boolean'}, 
    {name:'number', type:'string'}, 
    {name:'tonnage', type:'int'}, 
    {name:'weight', type:'number'}, 
    {name:'shipping_date', type:'date', dateFormat:'c'}, 
    {name:'waybill', type:'string'},
    {name:'rate_jd', type:'number'},
    {name:'rate_client', type:'number'},
    {name:'codes'}
  ],

});
