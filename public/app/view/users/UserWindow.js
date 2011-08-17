Ext.apply(Ext.form.field.VTypes, {
    login:  function(v) { return /^[a-z0-9]+$/.test(v); },
    loginText: 'Логин должен состоять только из латинских символов нижнего регистра и цифр',
    loginMask: /[a-z0-9]/i
});

Ext.define('Gl.view.users.PasswordGeneratorField', {
  extend: 'Ext.form.FieldSet',
  alias : 'widget.passgenfield',
  name:'',
  layout:'hbox',
  border:false,
  frame:false,
  padding:'0 0 0 0',
  
  
  initComponent: function(){
    this.items = [
      {xtype:'textfield', name:this.name,anchor:"95%"},
      {xtype:'button', text:"", iconCls:'wizard'}
    ];
    this.callParent();
  }
});


Ext.define('Gl.view.users.UserWindow', {
  extend: 'Ext.window.Window',
  alias : 'widget.userwindow',
  title:'Новый пользователь',
  width:500,
  height:250,
  modal:true,
  layout:'fit',

  buttons:[
    {text:'Отмена', height:25, handler:function(){ Ext.ComponentQuery.query('userwindow')[0].close() }},
    {text:'Сохранить', iconCls:'save', height:25, id:'userCreateButton'}
  ],


  initComponent: function(){
    this.items = [
      {xtype:'form', frame:true,  layout: 'hbox', id:"userCreateForm",
        defaults: {
          frame:true,
          xtype: 'panel', flex: 1, layout: 'anchor',
          defaults:{labelAlign:'top', anchor:'98%', xtype:'textfield', allowBlank:false}
        },
        
        items:[
          {items:[
            {fieldLabel:'Логин', vtype:'login', id:'userLoginField', tabIndex:1, name:'user[login]'},
            {fieldLabel:'ФИО', tabIndex:3, name:'user[fio]'},
            {fieldLabel:'Пароль', xtype:'textfield', tabIndex:5, name:'user[password]'}
          ]},{items:[
            {fieldLabel:'Email', vtype:'email', tabIndex:2, name:'user[email]'},
            {fieldLabel:'Должность', tabIndex:4, name:'user[position]'},
            {fieldLabel:'Права', xtype:'combobox', store: 'Roles', queryMode: 'local', displayField: 'name', valueField: 'id', editable:false, tabIndex:6, name:'user[role_id]'}
          ]}  
        ]
      }
    ];

    this.listeners = {afterrender:function(){Ext.getCmp('userLoginField').focus()}}
    
    this.callParent();
  }
})
