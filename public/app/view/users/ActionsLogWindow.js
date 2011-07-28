Ext.define('Gl.view.users.ActionsLogWindow', {
  extend: 'Ext.window.Window',
  alias : 'widget.actionslogwindow',
  title:'Действия пользователя',
  width:600,  height:550, modal:true, layout:'fit',
  user: null,
  itemsPerPage:20,

  
  initComponent: function(params){
    this.on('afterrender',function(w){
      // Loading store
      Ext.getCmp('userActionsGrid').getStore().pageSize=this.itemsPerPage
      Ext.getCmp('userActionsGrid').getStore().getProxy().url = "/actions/"+this.user.get('id')
      Ext.getCmp('userActionsGrid').getStore().load()
      // Changing title of window with user fio
      w.setTitle(w.title+': '+w.user.get('login')+' ('+w.user.get('fio')+')')
    })
    
    this.items = [
      {xtype:'grid', id:'userActionsGrid', flex:1, store: 'UserActions',
        columns:[
          {header: 'Дата', xtype:'datecolumn', dataIndex:'created_at', format:'H:i d M', menuDisabled:true},
          {header: 'Действие', dataIndex:'action', flex:1, menuDisabled:true}
        ],
        dockedItems: [{ xtype: 'pagingtoolbar', store: 'UserActions', dock: 'bottom', displayInfo: false }],

      }
    ];
    this.callParent();
  }
})

