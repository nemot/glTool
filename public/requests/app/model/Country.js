Ext.define('Rq.model.Country', {
  extend: 'Ext.data.Model',

  fields:[ {name:'id', type:'int'}, {name:'name', type:'string'}, {name:'short_name', type:'string'} ],

  hasMany:[
    {name:'places', model:'Place'}
  ]
});
