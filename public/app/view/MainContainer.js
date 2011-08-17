Ext.define('Gl.view.MainContainer', {
  extend: 'Ext.container.Container',
  alias:  'widget.maincontainer',

  id: 'maincontainer',

  margin: '2 2 5 2',
  layout:'fit',
  initComponent: function(){
    this.items = [];

    this.callParent();
  }


})
