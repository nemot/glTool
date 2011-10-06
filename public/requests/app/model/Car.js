Ext.define('Rq.model.Car', {
  extend: 'Ext.data.Model',

  fields:[
    {name:'id', type:'int'}, 
    {name:'in_use', type:'boolean', defaultValue:true}, 
    {name:'number', type:'string', defaultValue:''}, 
    {name:'tonnage', type:'int', defaultValue:0}, 
    {name:'weight', type:'number', defaultValue:0}, 
    {name:'shipping_date', type:'date', dateFormat:'c', defaultValue:null}, 
    {name:'waybill', type:'string', defaultValue:''},
    {name:'rate_jd', type:'number', defaultValue:0},
    {name:'rate_client', type:'number', defaultValue:0},
    {name:'codes'},
  ],

  constructor: function() {
    this.callParent(arguments);
  }

});
