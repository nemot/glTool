Ext.define('Rq.store.Countries', {
  extend: 'Ext.data.Store',
  model:'Rq.model.Country',

  autoLoad:true,
  sorters: [{property : 'id', direction: 'DESC'}],
  data:countries
});
