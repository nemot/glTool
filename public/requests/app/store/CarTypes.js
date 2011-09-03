Ext.define('Rq.store.CarTypes', {
  extend: 'Ext.data.Store',
  fields:[{name:'id', type:'int'}, {name:'name', type:'string'}],
  autoLoad:true, autoSync:true,
  sorters: [{property : 'id', direction: 'DESC'}],
  data:car_types

});
