Ext.define('Gl.model.ClientTransaction', {
  extend: 'Ext.data.Model',
  fields: [
    {name:'id', type:'int'}, 
    {name:'value',  type:'string'}, 
    {name:'description',  type:'string'}, 
    {name:'created_at',  type:'date', dateFormat:"c"}, 
  ],
  validations: [
    {type: 'presence',  field: 'value'}
  ],
  proxy: {
    type: 'rest',
    url : '/client_transactions',
    reader: {type:'json', root:'transactions'},
    writer: {type:'json', root:'transactions', writeAllFields:true}
  }
});
