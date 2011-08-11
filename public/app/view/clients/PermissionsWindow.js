Ext.define('Gl.view.CheckboxColumn', {
  extend:'Ext.grid.Column',
  alias:'widget.cbcolumn',
  align:'center',
  renderer: function(val){
    return val ? "<span class='pgreen'>Да</span>" : "<span class='pred'>Нет</span>"
  },
  menuDisabled:true,

  initComponent: function(params){
    this.callParent();
  }
})


Ext.define('Gl.view.clients.PermissionsWindow', {
  extend: 'Ext.window.Window',
  alias : 'widget.permissionswindow',
  width:400, height:600, modal:true, layout: {type: 'border'},
  rec: null,
  title:'',

  buttons:[
    {text:'Отмена', height:25, handler:function(){ 
      Ext.ComponentQuery.query('permissionswindow')[0].close() 

    }},
  ],

  initComponent: function(params){
    // Фокусируем первое поле
    this.listeners = {afterrender:function(){Ext.getCmp('clientFinancesValueField').focus()}}
    // Закидываем в айтемы окошко
    this.items = [
      {xtype:'grid', region:'center', store: 'Users',
        defaults:{menuDisabled:true},
        columns:[
          {header: 'Доступ', dataIndex:'login', xtype:'cbcolumn',  value:true},
          {header: 'Логин', dataIndex:'login'},
          {header: 'ФИО', dataIndex:'fio', flex:1},
        ]
      }
    ];

    
    if(this.rec.getId()>1) {
      // Меняем название окошка
      this.title = "Доступ пользователей к клиенту: "+this.rec.get('name')
    }

    this.on('afterrender', function(wn){
//      Ext.getCmp('clientFinancesGrid').getStore().getProxy().extraParams.client_id = this.rec.get('id');
//      Ext.getCmp('clientFinancesGrid').getStore().load();
    })

    this.callParent();
  }
});

