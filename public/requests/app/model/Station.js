Ext.define("Rq.model.Station", {
  extend: 'Ext.data.Model',
  
  fields: [
    {name: 'id', type:'int'},
    {name: 'country_id', type:'int'},
    {name: 'code', type:'string'},
    {name: 'name', type:'string'},
    {name: 'short_name', type:'string'}
  ],

  proxy: {
    type: 'rest', url : '/stations',
    reader: { type: 'json', root: 'nodes',totalProperty: 'total' }
  }
});
