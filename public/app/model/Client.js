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
      {name:'balance',  type:'string'}, 
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
