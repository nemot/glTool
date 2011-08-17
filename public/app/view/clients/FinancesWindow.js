Ext.define('Gl.view.clients.FinancesWindow', {
  extend: 'Ext.window.Window',
  alias : 'widget.financeswindow',
  width:800, height:600, modal:true, layout: {type: 'border'},
  rec: null,
  title:'Финансы клиента: ',

  buttons:[
    {text:'Отмена', height:25, handler:function(){ 
      Ext.ComponentQuery.query('financeswindow')[0].close() 
    }},
  ],

  initComponent: function(params){
    // Фокусируем первое поле
    this.listeners = {afterrender:function(){Ext.getCmp('clientFinancesValueField').focus()}}
    // Закидываем в айтемы окошко
    this.items = [
      {xtype:'form', id:'newTransactionForm', region:'west', defaults:{labelAlign:'top', anchor:'100%'}, width:200, frame:true, items:[

        {xtype:'numberfield', fieldLabel:'Сумма', name:'value', id:'clientFinancesValueField',
          hideTrigger: true,decimalSeparator:',',decimalPrecision:2, emptyText:'Сумма'
        },
        {xtype:'datefield', fieldLabel:'Дата',  name:'date_of_transfer', allowBlank:false, format:'d.M.Y',
          submitFormat:'c', value: new Date()
        },
        {xtype:'textareafield', height:50, name:'description', emptyText:'Примечание'},

        {xtype:'panel', layout:'hbox', frame:true, items:[
          
          {xtype:'button', text:'Удалить', iconCls:'money_delete', id:'deleteTransactionBtn', hidden:true},
          {flex:1, xtype:'label'},
          {xtype:'button', text:'Сохранить', iconCls:'save', id:'saveTransactionBtn', hidden:true},
          {xtype:'button', text:'Пополнить', iconCls:'money_add', id:'addTransactionBtn'}
        ]},
        {xtype:'button', text:'Новое пополнение', id:'clearTransactionFormBtn', flex:1 , hidden:true, margin:'15 0 0 0'},
        
      ], collapsible:true, title:'Пополнить счет'},
      {xtype:'grid', region:'center', id:'clientFinancesGrid', flex:1, store: 'ClientTransactions',
        columns:[
          {header: 'Дата', xtype:'datecolumn', dataIndex:'date_of_transfer', format:'d.M.Y', menuDisabled:true},
          {header: 'Сума', dataIndex:'value',  menuDisabled:true},
          {header: 'Примечание', dataIndex:'description', flex:1, menuDisabled:true}
        ],
        dockedItems: [{ xtype: 'pagingtoolbar', store: 'ClientTransactions', dock: 'bottom', displayInfo: false }]
      }
    ];
    
    // Меняем название окошка
    this.title = "Финансы клиента: "+this.rec.get('name');
  

    this.on('afterrender', function(wn){
      Ext.getCmp('clientFinancesGrid').getStore().getProxy().extraParams.client_id = this.rec.get('id');
      Ext.getCmp('clientFinancesGrid').getStore().load();
    })

    this.callParent();
  }
});

