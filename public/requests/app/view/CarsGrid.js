Ext.define('Rq.view.CarsGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.carsgrid',
  
  title:'Вагоны и коды',
  height:419,
  flex:1,
  store: 'Cars',
  columnLines:true,
  columns:{
    items:[
      {header: 'Номер', dataIndex:'number', flex:1},
      {header: 'Вес', dataIndex:'weight', width:40, xtype: 'numbercolumn', hidden:true},
      {header: 'Тнж.', dataIndex:'tonnage', width:35},
      {header: 'Дата отгр.', dataIndex:'shipping_date', width:70, hidden:true},
      {header: 'Накладная', dataIndex:'waybill', width:70, hidden:true},
      {header: '<b>Ст.ЖД</b>', dataIndex:'rate_jd', width:45, xtype: 'numbercolumn', format:'0.00'},
      {header: '<b>Ст. КЛ</b>', dataIndex:'rate_client', width:45, xtype: 'numbercolumn', format:'0.00'},
      {header: 'Возв.', dataIndex:'in_use', width:40, renderer:function(v){ return v ? "Нет" : "Да" }},
    ], defaults:{}
  },

  initComponent: function(){
    this.listeners = {
      afterrender: this.addColumnsAfterRender
//      itemcontextmenu: this.showContextMenu
    };
    this.callParent();
  },
  statics: {
    // Удаляет плейс из кодов у всех вагонов
    removePlaceFromStore: function(place) {
      Ext.ComponentQuery.query('carsgrid')[0].getStore().each(function(car){
        car.set('codes', car.get('codes').map(function(code){ return code.place_id.toString() != place.get('id').toString() }))
      });
    },
    // Удаляет колонки, созданые для плейса
    removeColumn :function(pl){
      var cmp = Ext.ComponentQuery.query('carsgrid')[0];
      var val = cmp.headerCt.findBy(function(rec){return rec.dataIndex.toString()==pl.get('id').toString()})
      console.log(val)
    },

    addPlaceToStore: function(place){
      var store = Ext.ComponentQuery.query('carsgrid')[0].getStore();
      store.each(function(car){
        car.get('codes').push({
          car_id: car.get('id'), id: -1, number: "", place_id: place.get('id'), rate_client: 0, rate_jd: 0, rate_jd_real: 0
        })
      });
    },

    addColumn: function(pl){
      var cmp = Ext.ComponentQuery.query('carsgrid')[0];
      var countriesStore = Ext.getStore('Countries');
      short_name = countriesStore.getById(pl.get('country_id')).get('short_name')        
      var codesNum = Ext.ComponentQuery.query('placesgrid')[0].getStore().count()-1;
      // Ставка ЖД
      cmp.headerCt.insert(cmp.columns.length-3-codesNum, Ext.create('Ext.grid.column.Column', 
        {header:"ЖД."+short_name, dataIndex:pl.get('id'),width:55,
          renderer:function(data, metaData, rec, rowIndex, colIndex, store, view){
            var column = view.getHeaderAtIndex(colIndex)
            return Ext.Array.filter(rec.get('codes'), function(i){
              return i.place_id==column.dataIndex
            })[0].rate_jd.toFixed(2).toString().replace("\.", ',')
          }
        }
      ))
      // Ставка КЛИЕНТУ
      cmp.headerCt.insert(cmp.columns.length-3-codesNum, Ext.create('Ext.grid.column.Column', 
        {header:"КЛ."+short_name, dataIndex:pl.get('id'), width:55,
          renderer:function(data, metaData, rec, rowIndex, colIndex, store, view){
            var column = view.getHeaderAtIndex(colIndex)
            return Ext.Array.filter(rec.get('codes'), function(i){
              return i.place_id==column.dataIndex
            })[0].rate_client.toFixed(2).toString().replace("\.", ',')
          }
        }
      ))

    
      // Добавляем коды для каждого плейса

      short_name = countriesStore.getById(pl.get('country_id')).get('short_name')        
      cmp.headerCt.insert(cmp.columns.length-1, Ext.create('Ext.grid.column.Column', 
        {header:"Код "+short_name, dataIndex:pl.get('id'), width:70, 
          renderer:function(data, metaData, rec, rowIndex, colIndex, store, view){
            var column = view.getHeaderAtIndex(colIndex)
            return Ext.Array.filter(rec.get('codes'), function(i){ return i.place_id==column.dataIndex })[0].number
          }
        }
      ))
    }
  },


  addColumnsAfterRender: function(cmp, options){
    var placesStore = Ext.ComponentQuery.query('placesgrid')[0].getStore();
    var countriesStore = Ext.getStore('Countries');
    // Добавляем ставки для каждого плейса
    placesStore.each(function(pl){
      Rq.view.CarsGrid.addColumn(pl)
    })
  },



})
