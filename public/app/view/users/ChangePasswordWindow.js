Ext.define('Gl.view.users.ChangePasswordWindow', {
  extend: 'Ext.window.Window',
  alias : 'widget.changeuserpasswordwindow',
  title:'Изменение пароля пользователя',
  width:310,
  height:180,
  modal:true,
  layout:'fit',
  rec: null,


  generatePassword: function(){
    var form = Ext.getCmp('changeUserPasswordForm').getForm();
    var vals = form.getValues();

    var minsize, maxsize, count, actualsize, res;
    minsize = 6; maxsize = 6; res="";
    var validchars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var startvalid = validchars;

    actualsize = Math.floor(Math.random() * (maxsize - minsize + 1)) + minsize;
    res = startvalid.charAt(Math.floor(Math.random()*startvalid.length));
    for (count = 1; count < actualsize; count++)
      res += validchars.charAt(Math.floor(Math.random()*validchars.length));
    
    form.setValues({new_password:res})
  },

  buttons:[
    {text:'Отмена', height:25, handler:function(){ 
      Ext.ComponentQuery.query('changeuserpasswordwindow')[0].close() 
    }},
    {text:'Изменить', iconCls:'user_change_password', height:25, id:'userChangePasswordBtn'}
  ],

  initComponent: function(params){
    this.listeners = {afterrender:function(){Ext.getCmp('userNewPasswordField').focus()}}
    this.items = [
      {xtype:'form', frame:true, id:"changeUserPasswordForm", defaults:{labelWidth:200, anchor:'95%'},
        items:[
          {xtype:'panel', layout:'hbox', frame:true, padding:'0 0 0 0', items:[
            {fieldLabel:'Новый пароль', xtype:'textfield', allowBlank:false, labelAlign:'top', id:'userNewPasswordField', width:180, name:'new_password'},
            {xtype:'button', iconCls:'wizard', text:'Придумать', margin:'10 0 0 3', handler:this.generatePassword}
          ]},
          {fieldLabel:'Отправить на email пользователю', xtype:'checkbox', margin:'5 0 0 0', name:'send_to_email'}
        ]
      }
    ];

    this.callParent();
  }
})
