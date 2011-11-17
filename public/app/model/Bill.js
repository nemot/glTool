Ext.define('Gl.model.Bill', {
  extend: 'Ext.data.Model',

  fields: [
    {name:'id', type:'id'},
    {name:'client_id', type:'int'},
    {name:'client_name', type:'string'},
    {name:'created_user_id', type:'int'},
    {name:'created_user_name', type:'string'},
    {name:'inbox', type:'boolean'},

    {name:'number', type:'string'},
    {name:'summ', type:'float'},
    {name:'backwash', type:'float'},

    {name:'sent', type:'boolean'},
    {name:'sent_at', type:'date', dateFormat:'c'},

    {name:'payed', type:'boolean'},
    {name:'payed_at', type:'date', dateFormat:'c'},

    {name:'created_at', type:'date', dateFormat:'c'},
  ],

  proxy: {
    type: 'rest',
    url : '/bills',
    reader: {type:'json', root:'bills'},
    writer: {type:'json', root:'bills', writeAllFields:true}
  },
});
