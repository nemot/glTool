Ext.define('Gl.view.users.EditUserWindow', {
  extend: 'Ext.window.Window',
  alias : 'widget.edituserwindow',
  title:'Изменение пользователя',
  width:500,
  height:250,
  modal:true,
  layout:'fit',
  rec: null,

  buttons:[
    {text:'Отмена', height:25, handler:function(){ 
      Ext.ComponentQuery.query('edituserwindow')[0].close() 
    }},
    {text:'Сохранить', iconCls:'save', height:25, id:'userSaveButton'}
  ],

  initComponent: function(params){
    this.listeners = {afterrender:function(){Ext.getCmp('userLoginField').focus()}}
    this.items = [
      {xtype:'form', frame:true,  layout: 'hbox', id:"userEditForm",
        defaults: {
          frame:true,
          xtype: 'panel', flex: 1, layout: 'anchor',
          defaults:{labelAlign:'top', anchor:'98%', xtype:'textfield', allowBlank:false}
        },
        
        items:[
          {items:[
            {fieldLabel:'Логин', vtype:'login', id:'userLoginField', tabIndex:1, name:'user[login]', value:this.rec.get('login')},
            {fieldLabel:'ФИО', tabIndex:2, name:'user[fio]', value:this.rec.get('fio')},
            {fieldLabel:'Email', vtype:'email', tabIndex:3, name:'user[email]', value:this.rec.get('email')},
          ]},{items:[
            {fieldLabel:'Должность', tabIndex:4, name:'user[position]', value:this.rec.get('position')},
            {fieldLabel:'Права', xtype:'combobox', store: 'Roles', queryMode: 'local', displayField: 'name', valueField: 'id', editable:false, tabIndex:5, name:'user[role_id]',value:this.rec.get('role_id')}
          ]}  
        ]
      }
    ];

    this.callParent();
  }
})
