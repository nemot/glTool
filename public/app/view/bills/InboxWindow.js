Ext.define('Gl.view.bills.InboxWindow', {
  extend: 'Ext.window.Window',
  alias : 'widget.inboxwindow',
  title:'Входящий счет', 
  width:300, height:300, modal:false, layout:'fit',
  items:[
    {xtype:'form', frame:true, id:"inboxForm", disabledCls:'form-disabled', items:[
      {xtype:'hidden', name:'inbox', value:true},
      {xtype:'hidden', name:'id', id:'inboxIdField', value:null},
      {xtype:'combo', fieldLabel:'Клиент', name:'client_id', id:'inboxClientIdField', allowBlank:false,
        pageSize: 30, displayField: 'name', valueField:'id', typeAhead: false,
        hideTrigger:true, anchor: '100%', minChars:2,
        store: Ext.create('Ext.data.Store', { pageSize: 30,
          fields: [{name:'id', type:'int'}, {name:'name', type:'string'}],
          proxy:{type:'rest', url:'/clients/autocomplete', reader: {type:'json', root:'nodes', totalProperty:'total'}}
        }),        
        listConfig: { loadingText: 'Поиск...', emptyText: 'Ни чего не найдено.',
          getInnerTpl: function() { return '{name}'; }},
      },
      {xtype:'numberfield', fieldLabel:'Cумма', hideTrigger: true, decimalSeparator:',', 
        selectOnFocus:true, name:'summ', id:'inboxSumm',
      },
      {xtype:'textfield', fieldLabel:'Номер счета', name:'number', id:'inboxNumber', 
        allowBlank:false },  
    ], defaults:{anchor:'100%', labelAlign:'top'}}
  ],
  buttons:[
    {text:'Закрыть', handler:function(){ Ext.ComponentQuery.query('inboxwindow')[0].close() }, height:35, padding:'0 5 0 10' },
    {text:'Сохранить', iconCls:'save', id:'saveInboxBill', height:35, padding:'0 5 0 10'},
  ],
  listeners: {
    afterrender: function(){
//      Ext.ComponentQuery.query('#outboxClientIdField')[0].focus()
    },

  }
})

