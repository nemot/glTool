Ext.define('Gl.view.clients.MainGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.clientsgrid',

  flex:1,
  store: 'Clients',

  columns:[
    {header: 'Название организации', dataIndex:'name', flex:1, menuDisabled:true},
    {header: 'Баланс', dataIndex:'balance', menuDisabled:true},
    {header: 'Экспедитор', dataIndex:'is_expeditor', type:'boolean', width:80, menuDisabled:true, renderer:function(val){
      var res = val ? "Да" : "Нет"
      return res;
    }, editor: {
      xtype:'combo', store:[[true, 'Да'], [false, 'Нет']], queryMode:'local', editable:false, listeners:{
        select: function(field, val, options){
          Ext.ComponentQuery.query('clientsgrid')[0].editingPlugin.completeEdit();
        }
      }
    }}
  ],

  selType:'rowmodel',
  plugins: [ Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 }) ],

  tbar:[
    {text:'Добавить', iconCls:'add', id:"clientAddBtn"},
    '->', 
    {text:'Только экспедиторы', enableToggle: true, toggleHandler: function(btn, state){
      var store = Ext.ComponentQuery.query('clientsgrid')[0].getStore();
      store.getProxy().extraParams.only_exp=state;
      store.load();
    }}
  ],

  

  initComponent: function(){
    this.listeners = {
      itemcontextmenu: this.showContextMenu
    };
    this.dockedItems = [
      { xtype: 'pagingtoolbar', store: 'Clients', dock: 'bottom', displayInfo: false }
    ];
    this.callParent();

  },

  showContextMenu: function(view, rec, item, index, e){
    e.stopEvent();
    var grid = Ext.ComponentQuery.query('clientsgrid')[0];
    var rec = grid.getSelectionModel().getSelection()[0];

    var editAction = Ext.create('Ext.Action', { iconCls: 'edit', text: 'Изменить', id:'editClientBtn' });
    var financesAction = Ext.create('Ext.Action', { iconCls: 'money', text: 'Финансы', id:'financesClientBtn' });
    var userPermissions = Ext.create('Ext.Action', { iconCls: 'key', text: 'Права доступа', id:'permissionsClientBtn' });


    var deleteConfirmationText =  "Вы хотите удалить клиента?<br/><br/>"
        deleteConfirmationText += "<i><b>Это приведет к следующим последствиям:</b><br>"
        deleteConfirmationText += "* Вы ни когда не сможете его востановить</i><br/><br/>"

    var deleteAction = Ext.create('Ext.Action', {
        iconCls: 'delete', text: 'Удалить',
        handler: function(widget, event) {
          if(rec){
            Ext.Msg.confirm('Ванимание', deleteConfirmationText, function(answer){
              if(answer=="yes"){ grid.getStore().remove(rec); }
            })
          }
        }
    });

    Ext.create('Ext.menu.Menu', {
        items: [ financesAction, userPermissions, editAction, deleteAction ]
    }).showAt(e.getXY());
    
  }

})
