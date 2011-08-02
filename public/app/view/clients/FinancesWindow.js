Ext.define('Gl.view.clients.ClientWindow', {
  extend: 'Ext.window.Window',
  alias : 'widget.clientwindow',
  width:550, height:330, modal:true, layout:'fit',
  rec: null,
  title:'Финансы клиента',

  buttons:[
    {text:'Отмена', height:25, handler:function(){ 
      Ext.ComponentQuery.query('financeswindow')[0].close() 
    }},
//    {text:'Сохранить', iconCls:'save', height:25, id:'clientSaveButton'}
  ],

  initComponent: function(params){
    // Фокусируем первое поле
//    this.listeners = {afterrender:function(){Ext.getCmp('clientNameField').focus()}}
    // Закидываем в айтемы окошко
    this.items = [ ];

    // Меняем название окошка
//    if(this.rec.getId()>1)
//      this.title = "Изменение клиента: '"+this.rec.get('name')+"'"

    this.callParent();
  }
});
