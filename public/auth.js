Ext.ns("Gl.view");
Ext.onReady(function() {
  
  Ext.define('Gl.view.Viewport', {
    extend: 'Ext.container.Viewport',
    id: 'viewport',
    layout: 'border',
    items:[{region:'center', xtype:'container'}]
  })
  Gl.view.Viewport.create()

  function submitForm(field){
    var form = Ext.getCmp('authForm').getForm();
    Ext.getCmp('authWindow').setLoading(true);
    form.submit();
  }

  Ext.create("Ext.window.Window",{
    height:180,
    width:250,
    layout:'fit',
    id:'authWindow',
    closable:false,
    resizable:false,
    title:'Авторизация',
    items:[
      {xtype:'form', id:'authForm', 
        standardSubmit:true, url:'/sign_in', method:'POST', 
        defaults:{labelAlign:'top', anchor:'98%'}, frame:true, items:[
          {xtype:'textfield', fieldLabel:'Логин', name:'user_session[login]', id:'loginField'},
          {xtype:'textfield', inputType:'password',name:'user_session[password]', fieldLabel:'Пароль', id:'passwordField', 
            listeners:{specialkey: function(field, e){ if (e.getKey() == e.ENTER) { submitForm() } }}
          }
      ]}
    ],
    buttons:[
      {text:'Войти', width:250, handler:submitForm}
    ],
    listeners:{
      afterrender:function(cmp, opts){Ext.getCmp('loginField').focus()}
    }
  }).show();
  

  if(!signInSuccess)
    Ext.example.msg('Ошибка!', 'Проверьте правильность логина и пароля');

});
