Ext.define('Gl.view.users.WasInSystemColumn', {
  extend: 'Ext.grid.column.Column',
  alias: 'widget.user_wasat_column',

  renderer:function(v){
    var result = "Ни когда"
    if(v=="1"){
      result = "<span style='color:green; font-weight:bold'>Онлайн</span>"
    } else {
      if(v){ result = Ext.Date.format(Ext.Date.parse(v,'c'),"i:h d.m.y" ); }
    }
    return result
  }
})

Ext.define('Gl.view.users.MainGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.usersgrid',

  flex:1,
  store: 'Users',
  columns:[
    {header: 'Логин', dataIndex:'login', menuDisabled:true},
    {header: 'ФИО', dataIndex:'fio', flex:1, menuDisabled:true},
    {header: 'Должность', dataIndex:'position', width:180, menuDisabled:true},
    {header: 'E-mail', dataIndex:'email', width:200, menuDisabled:true},
    {header: 'Был в системе', xtype:'user_wasat_column', dataIndex:'was_online', menuDisabled:true}
  ],
  tbar:[
    {text:'Добавить', iconCls:'add', id:"userAddBtn"}
  ],

  initComponent: function(){
    this.listeners = {
      itemcontextmenu: this.showContextMenu
    };
    this.callParent();
  },

  showContextMenu: function(view, rec, item, index, e){
    e.stopEvent();
    var grid = Ext.ComponentQuery.query('usersgrid')[0];
    var rec = grid.getSelectionModel().getSelection()[0];


    var newPasswordAction = Ext.create('Ext.Action', {
      iconCls:'user_change_password', text:'Изменить пароль', id:'changeUserPasswordBtn'
    })

    var editAction = Ext.create('Ext.Action', { iconCls: 'user_edit', text: 'Изменить', id:'editUserBtn' });
    var showLogAction = Ext.create('Ext.Action', {iconCls:'log', text:'Журнал действий', id:'shoLogBtn'})

    var deleteConfirmationText =  "Вы хотите удалить пользователя?<br/><br/>"
        deleteConfirmationText += "<i><b>Это приведет к следующим последствиям:</b><br>"
        deleteConfirmationText += "* Вы ни когда не сможете его востановить</i><br/><br/>"

    var deleteAction = Ext.create('Ext.Action', {
        iconCls: 'user_delete', text: 'Удалить',
        handler: function(widget, event) {
          if(rec){
            Ext.Msg.confirm('Ванимание', deleteConfirmationText, function(answer){
              if(answer=="yes"){ grid.getStore().remove(rec) }
            })
          }
        }
    });


    Ext.create('Ext.menu.Menu', {
        items: [ editAction, newPasswordAction, showLogAction, deleteAction ]
    }).showAt(e.getXY());
    
  }

})
