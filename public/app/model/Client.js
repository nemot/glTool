Ext.define('Gl.model.Client', {
  extend: 'Ext.data.Model',
  fields: [
    {name:'id', type:'int'}, 
    {name:'name',  type:'string'}, 
    {name:'address',  type:'string'}, 
    {name:'phone',  type:'string'}, 
    {name:'email',  type:'string'}, 
    {name:'director',  type:'string'}, 
    {name:'payment_details',  type:'string'}, 
    {name:'contract_date',  type:'date', dateFormat:"c"}, 
    {name:'contract_number',  type:'string'}, 
    {name:'balance_client',  type:'float'}, 
    {name:'balance_expeditor',  type:'float'}, 
    {name:'delta',  type:'float'}, 
    {name:'requests_without_invoice',  type:'int'}, 
    {name:'unpayed_invoices',  type:'int'}, 
    {name:'created_at',  type:'date', dateFormat:"c"}, 
    {name:'is_expeditor',  type:'boolean'}
  ],
  validations: [
      {type: 'presence',  field: 'name'}
  ],
  proxy: {
    type: 'rest',
    url : '/clients',
    reader: {type:'json', root:'clients'},
    writer: {type:'json', root:'clients', writeAllFields:true}
  },
});
