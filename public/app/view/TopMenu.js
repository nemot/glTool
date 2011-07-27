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


  initComponent: function(){
    this.items = [
      {text:'Заявки', enableToggle:true, toggleGroup:'tabs', action:'statements'},
      {text:'Клиенты', enableToggle:true, toggleGroup:'tabs', action:'clietns'},
      {text:'Отчеты', enableToggle:true, toggleGroup:'tabs', action:'reports'},
      {text:'Пользователи', enableToggle:true, toggleGroup:'tabs', action:'users', toggled:true},
      {flex:1, xtype:'container'},
      {text:'Выход', width:70, margin:'0 3 0 0', handler:function(){window.location='/sign_out'}}
    ];
    this.callParent(arguments);
  }


})

