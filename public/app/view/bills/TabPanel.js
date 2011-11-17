Ext.define('Gl.view.bills.TabPanel', {
  extend: 'Ext.tab.Panel',
  alias: 'widget.billtabs',
  flex: 1,
  tabBar:{
    height: 50
  },
  items:[
    {title:'Исходящие'},
    {title:'Входящие', xtype:'billsgrid'}
  ]
})
