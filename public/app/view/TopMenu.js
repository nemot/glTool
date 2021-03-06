Ext.define('Gl.view.TopMenu', {
  extend: 'Ext.panel.Panel',
  alias : 'widget.topmenu',
  frame:true,
  margin: '2 2 0 2',
  padding:'5 5 5 10',
  height:40,
  id:'top-region-container',
  layout: {
    type:'hbox',
    align:'stretch'
  },
  defaults:{margin:'0 5 0 0', width:100, xtype:'button'},
  userInfoTpl: Ext.create('Ext.Template', '<div style="margin-top:7px; text-align:right;">{fio} ({login})</div>'),

  initComponent: function(){
    current_user = new Gl.model.User(current_user);
    this.items = [
      {text:'Заявки', enableToggle:true, toggleGroup:'tabs', action:'requests'},
      {text:'Клиенты', enableToggle:true, toggleGroup:'tabs', action:'clietns'},
      {text:'Счета', enableToggle:true, toggleGroup:'tabs', action:'bills'},
      {text:'Пользователи', enableToggle:true, toggleGroup:'tabs', action:'users', hidden:current_user.is_engineer()},
      {flex:1, xtype:'label', tpl:this.userInfoTpl, data:{login:current_user.get('login'), fio:current_user.get('fio')}},
      {text:'Выход', width:70, margin:'0 3 0 0', handler:function(){window.location='/sign_out'}}
    ];
    this.callParent(arguments);
  }


})

