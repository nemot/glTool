Ext.define('Gl.store.ClientTransactions', {
  extend: 'Ext.data.Store',
  fields: [
    {name:'id', type:'int'}, 
    {name:'value',  type:'string'}, 
    {name:'description',  type:'string'}, 
    {name:'date_of_transfer',  type:'date', dateFormat:"c"}, 
  ],
  autoLoad:false, autoSync:true,
  sorters: [{property: 'date_of_transfer', direction: 'DESC'}],
  proxy: {
    type: 'rest',
    url : '/client_transactions',
    reader: {type:'json', root:'transactions'},
    writer: {type:'json', root:'transactions', writeAllFields:true},
    extraParams:{ client_id: 1 }
  },
  
});
