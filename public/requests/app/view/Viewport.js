Ext.define('Rq.view.Viewport', {
    extend: 'Ext.container.Viewport',
    alias : 'widget.requestviewport',
    requires: [
      'Rq.view.Autocomplete',
      'Rq.view.RequestGrid',
      'Rq.view.CarsGrid',
      'Rq.view.PlacesGrid',
      'Rq.view.CostsGrid',
      'Rq.view.TransitStationsGrid'
    ],
    id: 'viewport',
    layout: 'border',
    defaults:{border:false},
    listeners: {
      afterrender:function(vp){
        Rq.controller.Requests.calculateRequest()
      }
    },


    initComponent: function() {
      
      this.items = [
        {region:'north', layout:'hbox',height:419, items:[
          {xtype:'requestgrid', rec:current_request, width:300},
          {xtype:'carsgrid', flex:1}
        ]}, 
        {region:'center', layout:'hbox', items:[
          {xtype:'placesgrid',width:300, height:150 },
          {xtype:'transitstationsgrid', width:300, height:150},
          {xtype:'costsgrid', flex:1, height:150}
          
        ]}, 

        // Кнопки
        {region:'south', frame:true, layout:'hbox', style:'border-top: 1px solid #D0D0D0', height:50, items:[
          {xtype:'button', text:'Закрыть', height:40, padding:'0 10 0 10', handler:function(){window.close()}},
          {flex:1, xtype:'label'},
          
          {xtype:'button', iconCls:'save', text:'Сохранить', tooltip:"Ctrl+S", height:40, padding:'0 10 0 10', id:'saveRequestBtn'}
        ]}
        
      ];

      
      this.callParent(arguments);
    }
});
