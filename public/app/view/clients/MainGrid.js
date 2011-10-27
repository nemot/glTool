Ext.define('Gl.view.clients.MainGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.clientsgrid',

  flex:1,
  store: 'Clients',

  columns:[
    {header: 'Название организации', dataIndex:'name', flex:1, menuDisabled:true},
    {header: 'Баланс', dataIndex:'balance', menuDisabled:true, hidden:current_user.is_engineer(), width:100, renderer:Ext.util.Format.usMoney, align:'right'},
    {header: 'Экспедитор', dataIndex:'is_expeditor', type:'boolean', width:80, menuDisabled:true, renderer:function(val){
      var res = val ? "Да" : "Нет"
      return res;
    }, editor: {
      xtype:'combo', store:[[true, 'Да'], [false, 'Нет']], queryMode:'local', editable:false, listeners:{
        select: function(field, val, options){
          Ext.ComponentQuery.query('clientsgrid')[0].editingPlugin.completeEdit();
        }
      }
    }, align:'center'}
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
        deleteConfirmationText += "* Вы ни когда не сможете его востановить<br/>"
        deleteConfirmationText += "* Все заявки для этого клиента удалятся</i><br/>"
        deleteConfirmationText += "</i><br/>"

    var deleteAction = Ext.create('Ext.Action', {
        iconCls: 'delete', text: 'Удалить',
        handler: function(widget, event) {
          if(rec){
            grid.setLoading('Подождите...');
            Ext.Ajax.request({   // TODO Проверка является ли он экспедитором где-нибудь
              url: '/clients/'+rec.get('id')+'/expeditor_in_requests',
              params: {},
              success: function(response){
                grid.setLoading(false);
                var res = Ext.decode(response.responseText);
                if(res.requests.length >0 ) {
                  var windowMessage =  "<div id='clientDeleteMessage'>";
                      windowMessage += "<b>\""+rec.get('name')+"\" выбран экспедитором в следующих заявках:</b><br>";
                      windowMessage += "<ul>";
                      Ext.each(res.requests, function(i){
                        windowMessage += "<li><a href=\"javascript:window.open('/requests/"+i+"','Заявка №"+i+"', 'width=1000,height=650,location=no,menubar=no')\">№ "+i+"</a></li>";
                      })
                      windowMessage += "</ul>";
                      if(res.unavailable){
                        windowMessage += ".. и других, не доступных вам заявках."
                      }
                      windowMessage += "</div>"
                  var win = Ext.create('Ext.window.Window',{
                    id:'docsWindow',
                    title:'Не возможно удалить этого экспедитора',
                    closable:true, width:500, height:400, modal:true, 
                    html: windowMessage,
                    buttons:[ {text:'Ок', handler:function(){ win.close() }}]
                  })
                  win.show();
                } else {
                  Ext.Msg.confirm('Ванимание', deleteConfirmationText, function(answer){
                    if(answer=="yes"){ grid.getStore().remove(rec); }
                  })
                }
                
              }, 
              failure: function(response){
                grid.setLoading(false);
                Ext.example.msg('Ошибка на сервере!', 'Произошла ошибка на сервере. Было послано письмо администратору с описанием проблемы.');
              }
            });
            
          }
        }
    });

    Ext.create('Ext.menu.Menu', {
        items: [ 
          (current_user.is_engineer() ? '' : financesAction), 
          (current_user.is_engineer() ? '' : userPermissions), 
          editAction, 
          deleteAction 
        ]
    }).showAt(e.getXY());
    
  }

})
