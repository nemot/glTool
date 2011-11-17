Ext.define('Gl.view.clients.ClientWindow', {
  extend: 'Ext.window.Window',
  alias : 'widget.clientwindow',
  width:650, height:430, modal:true, layout:'fit',
  rec: null,
  title:'Новый клиент',

  buttons:[
    {text:'Отмена', height:25, handler:function(){ 
      Ext.ComponentQuery.query('clientwindow')[0].close() 
    }},
    {text:'Сохранить', iconCls:'save', height:25, id:'clientSaveButton'}
  ],

  initComponent: function(params){
    // Фокусируем первое поле
    this.listeners = {afterrender:function(){Ext.getCmp('clientNameField').focus()}}
    // Закидываем в айтемы форму
    this.items = [
      {xtype:'form', frame:true,  layout: 'hbox', id:"clientForm",
        defaults: { frame:true, xtype: 'panel', flex: 1, layout: 'anchor',
          defaults:{labelAlign:'top', anchor:'98%', xtype:'textfield', allowBlank:true}
        },

        items:[
          { items:[
            {fieldLabel:'Название компании', id:'clientNameField', tabIndex:1, name:'name', allowBlank:false, value:this.rec.get('name')},
            {fieldLabel:'Адрес', tabIndex:2, name:'address', value:this.rec.get('address')},
            {fieldLabel:'Телефоны', tabIndex:3, name:'phone', value:this.rec.get('phone')},
            {fieldLabel:'Электронная почта', vtype:'email', tabIndex:4, name:'email', value:this.rec.get('email')},
            {fieldLabel:'ФИО директора', tabIndex:5, name:'director', value:this.rec.get('director')},
            {xtype:'datefield', fieldLabel:'Дата заключения договора', tabIndex:7, name:'contract_date', 
              value:this.rec.get('contract_date'), submitFormat:'c'},
            {fieldLabel:'Номер договора', tabIndex:6, name:'contract_number', value:this.rec.get('contract_number')},
            
          ]},{flex:2, items:[
            {fieldLabel:'Реквизиты', xtype:'textareafield', tabIndex:8, name:'payment_details', height:330, value:this.rec.get('payment_details')}
          ]}  
        ]
      }
    ];

    // Меняем название окошка если запись не новая
    if(this.rec.getId()>1)
      this.title = "Изменение клиента: '"+this.rec.get('name')+"'"

    this.callParent();
  }
});
