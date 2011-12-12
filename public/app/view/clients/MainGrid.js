Ext.define('Gl.view.clients.MainGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.clientsgrid',

  flex:1,
  store: 'Clients',
  columnLines:true,
  columns:{items:[
    {header: 'Название организации', dataIndex:'name', flex:1},
    
    {header:'<b>Сальдо</b>', columns:[
      {header:'КЛ.', dataIndex:'balance_client', renderer:function(v,e,rec){
        result = Ext.util.Format.usMoney(rec.get('balance_client'));
        if(rec.get('balance_client')>0)
          result = "<b>"+result+"</b>"
        return result
      }},
      {header:'ЭКСП.', dataIndex:'balance_expeditor', renderer:function(v,e,rec){
        result = Ext.util.Format.usMoney(rec.get('balance_expeditor'));
        if(rec.get('balance_expeditor')>0)
          result = "<b>"+result+"</b>"
        return result
      }},
    ]},

    {header:'<b>Дельта</b>', dataIndex:'delta', hidden:true, 
      align:'right', width:120, hidden: current_user.is_engineer(),
      renderer:function(v,e,rec){
        result = Ext.util.Format.usMoney(rec.get('delta'));
        if(rec.get('delta')>0)
          result = "<b>"+result+"</b>"
        if(rec.get('delta')<0)
          result = "<span class='red'><b>"+result+"</b></span>"
        return result
      }
    },

    {header: 'Не опл. счетов', dataIndex:'unpayed_invoices', width:85, align:'center',renderer:function(v){
      return (parseInt(v)>0) ? "<span class='red'><b>"+v.toString()+' шт.</b></span>' : v.toString()+" шт."
    }},
    
    {header: 'Зявк.без инв.', dataIndex:'requests_without_invoice', width:85, align:'center',renderer:function(v){
      return (parseInt(v)>0) ? "<span class='red'><b>"+v.toString()+' шт.</b></span>' : v.toString()+" шт."
    }},

    {header: 'Экспедитор', dataIndex:'is_expeditor', type:'boolean', width:80, renderer:function(val){
      var res = val ? "Да" : "Нет"
      return res;
    }, editor: {
      xtype:'combo', store:[[true, 'Да'], [false, 'Нет']], queryMode:'local', editable:false, listeners:{
        select: function(field, val, options){
          Ext.ComponentQuery.query('clientsgrid')[0].editingPlugin.completeEdit();
        }
      }
    }, align:'center'}
  ], defaults:{menuDisabled:true, sortable:false, defaults:{
      width:110,align:'right', sortable:false, menuDisabled:true, renderer:Ext.util.Format.usMoney
  }}},

  selType:'rowmodel',
  plugins: [ Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 }) ],

  tbar:[
    {text:'Добавить', iconCls:'add', id:"clientAddBtn", height:30, padding:'0 5 0 10'},
    '-',
    {text:'Только экспедиторы', enableToggle: true, height:30, padding:'0 5 0 10', toggleHandler: function(btn, state){
      var store = Ext.ComponentQuery.query('clientsgrid')[0].getStore();
      store.getProxy().extraParams.only_exp=state;
      store.load();
    }},
    '->', 
    {text:'Скачать свод', hidden:current_user.is_engineer(), menu:{plain:true, items:[
      {text:'2009', handler:function(){window.location = "/clients/get_total_report?year=2009"}},
      {text:'2010', handler:function(){window.location = "/clients/get_total_report?year=2010"}},
      {text:'2011', handler:function(){window.location = "/clients/get_total_report?year=2011"}},
      {text:'2012', hidden: ((new Date().getYear()+1900)<=2012), 
        handler:function(){window.location = "/clients/get_total_report?year=2012"}},
      {text:'2013', hidden: ((new Date().getYear()+1900)<=2013), 
        handler:function(){window.location = "/clients/get_total_report?year=2013"}},
      {text:'2014', hidden: ((new Date().getYear()+1900)<=2014), 
        handler:function(){window.location = "/clients/get_total_report?year=2014"}},
      {text:'2015', hidden: ((new Date().getYear()+1900)<=2015), 
        handler:function(){window.location = "/clients/get_total_report?year=2015"}},
    ]}}
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

    var downloadReportAction = { iconCls: 'report', text: 'Отчет по клиенту', menu:{items:[]} };
    for(i=2009; i<=(new Date().getYear()+1900);i++){
      downloadReportAction.menu.items.push({text:i.toString()+" год", id:'year='+i.toString(), handler:function(cmp){
        window.location = "/clients/"+rec.get('id').toString()+"/client_report?"+cmp.id.toString();
      }})
    }

    var downloadExpReportAction = { iconCls: 'report', text: 'Отчет по экспедитору', menu:{items:[]} };
    for(i=2009; i<=(new Date().getYear()+1900);i++){
      downloadExpReportAction.menu.items.push({text:i.toString()+" год", id:'year='+i.toString(), handler:function(cmp){
        window.location = "/clients/"+rec.get('id').toString()+"/exp_report?"+cmp.id.toString();
      }})
    }

    var downloadPgkReportAction = { iconCls: 'report', text: 'Отчет в 39 столбцов', menu:{items:[]} };
    for(i=2009; i<=(new Date().getYear()+1900);i++){
      downloadPgkReportAction.menu.items.push({text:i.toString()+" год", id:'year='+i.toString(), handler:function(cmp){
        window.location = "/clients/"+rec.get('id').toString()+"/pgk_report?"+cmp.id.toString();
      }})
    }


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
          
          (current_user.is_engineer() ? '' : userPermissions), 
          editAction, 
          deleteAction,
          downloadReportAction,
          (current_user.is_engineer() ? '' : (rec.get('is_expeditor') ? downloadExpReportAction : '')), 
          (rec.get('id')==13 ? downloadPgkReportAction : ''), 
        ]
    }).showAt(e.getXY());
    
  }

})
