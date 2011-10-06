Ext.define('Rq.view.CarsGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.carsgrid',
  
  title:'Вагоны и коды',
  height:419, flex:1, columnLines:true,
  store: 'Cars',
  selType: 'rowmodel',
  lastEditorId: null,
  
  plugins: [ Ext.create('Ext.grid.plugin.CellEditing', {id:'carsEditPlugin', clicksToEdit: 1, listeners:{
    validateedit:function(editor,e,options){
      if(e.field.toString() == "codes"){
        var carsgrid = Ext.ComponentQuery.query('carsgrid')[0];
        var lastEditorField = Ext.getCmp(carsgrid.lastEditorId);
        var newValue = lastEditorField.getValue();
        newValue = lastEditorField.param!="number" ? parseFloat(newValue.toString().replace(",", '\.')) : newValue
        var code = Ext.Array.filter(e.record.get('codes'), function(i){
          return i.place_id==lastEditorField.place_id
        })[0];
        eval("code."+lastEditorField.param+" = newValue")

        var rate_jd_sum = 0.00,
            rate_client_sum = 0.00;
        Ext.each(e.record.get('codes'), function(i){
          rate_jd_sum += i.rate_jd; rate_client_sum += i.rate_client; 
        })
        e.record.set('rate_jd', rate_jd_sum);
        e.record.set('rate_client', rate_client_sum);
        
        carsgrid.lastEditorId = null;
        carsgrid.getView().refresh();
        e.cancel = true;
      }
    }
  }}) ],
  

  columns:{
    items:[
      {header: 'Номер', dataIndex:'number', flex:1, field:{xtype:'textfield'}},
      {header: 'Вес', dataIndex:'weight', width:45, xtype: 'numbercolumn', hidden:true, 
        field:{xtype:'numberfield', hideTrigger: true, decimalSeparator:','}},
      {header: 'Тнж.', dataIndex:'tonnage', width:35, field:{xtype:'numberfield', hideTrigger: true, allowDecimals:false}},
      {header: 'Дата отгр.', dataIndex:'shipping_date', xtype:'datecolumn', format:'d.m.Y', width:70, hidden:true, 
        field:{xtype:'datefield'}},
      {header: 'Накладная', dataIndex:'waybill', width:70, hidden:true, field:{xtype:'textfield'}},
      // TODO После изменении ставок на вагон соответствующие ставки на коды обнуляются
      {header: '<b>Ст.ЖД</b>', dataIndex:'rate_jd', width:45, xtype: 'numbercolumn', format:'0.00', 
        field:{xtype:'numberfield', hideTrigger: true, decimalSeparator:','}
      },
      {header: '<b>Ст. КЛ</b>', dataIndex:'rate_client', width:45, xtype: 'numbercolumn', format:'0.00', 
        field:{xtype:'numberfield', hideTrigger: true, decimalSeparator:','}},
      {header: 'Возв.', dataIndex:'in_use', width:40, renderer:function(v){ return v ? "Нет" : "Да" }, 
        field:{xtype:'combo', queryMode: 'local', editable:false, store:[[true, 'Нет'], [false, 'Да']]}
      },
    ], defaults:{}
  },


  initComponent: function(){
    this.listeners = {
      afterrender: this.addColumnsAfterRender,
      itemcontextmenu: this.showContextMenu,
      containercontextmenu: this.showContainerContextMenu
    };
    this.callParent();
  },

  // Отображает контекстное меню для таблички
  showContainerContextMenu: function(view, e){
    var grid = Ext.ComponentQuery.query('carsgrid')[0];
    var menu = Ext.create('Ext.menu.Menu', { items: [] });

    var addAction = {text:'Добавить коды', iconCls:'add', id:'addCodesMenuItem'};
    menu.add(addAction);
    menu.showAt(e.getXY())
  },
  
  // Отображает контекстное меню для айтема
  showContextMenu: function(view, rec, item, index, e){
    var grid = Ext.ComponentQuery.query('carsgrid')[0];
    var rec = grid.getSelectionModel().getSelection()[0];
    var menu = Ext.create('Ext.menu.Menu', { items: [] });
    var deleteAction = {text:'Удалить', iconCls:'delete', id:'deleteCarsMenuItem'}
    var addAction = {text:'Добавить коды', iconCls:'add', id:'addCodesMenuItem'};
    menu.add(addAction);
    menu.add('');
    menu.add(deleteAction);
    menu.showAt(e.getXY())
  },

  statics: {

    // Удаляет плейс из кодов у всех вагонов
    removePlaceFromStore: function(place) {
      Ext.ComponentQuery.query('carsgrid')[0].getStore().each(function(car){
        car.set('codes', car.get('codes').map(function(code){ return code.place_id.toString() != place.get('id').toString() }))
      });
    },

    // Удаляет колонки, созданые для плейса
    removeColumn: function(pl){
      var cmp = Ext.ComponentQuery.query('carsgrid')[0];
      var column = null;
      do{
        column = cmp.headerCt.items.findBy(function(rec){
          return rec.dataIndex.toString()==pl.get('id').toString()
        });
        cmp.headerCt.remove(column);
      } while(column)
      cmp.getView().refresh();
    },

    // Добавляем плейс к кодам для всех вагонов
    addPlaceToStore: function(place){
      var store = Ext.ComponentQuery.query('carsgrid')[0].getStore();
      store.each(function(car){
        car.get('codes').push({
          car_id: car.get('id'), id: -1, number: "", place_id: place.get('id'), rate_client: 0, rate_jd: 0, rate_jd_real: 0
        })
      });
    },

    // Добавляем колонку для кода в табличку
    addColumn: function(pl){
      var cmp = Ext.ComponentQuery.query('carsgrid')[0];
      var countriesStore = Ext.getStore('Countries');
      var short_name = countriesStore.getById(pl.get('country_id')).get('short_name')        
      var codesNum = Ext.ComponentQuery.query('placesgrid')[0].getStore().count()-1;
      // Ставка ЖД
      
      cmp.headerCt.insert(cmp.columns.length-3-codesNum, Ext.create('Ext.grid.column.Column', 
        {header:"ЖД."+short_name, dataIndex:'codes',width:55, editable:true,
          renderer:function(data, metaData, rec, rowIndex, colIndex, store, view){
            return Ext.Array.filter(rec.get('codes'), function(i){ 
              return i.place_id==pl.get('id') 
            })[0].rate_jd.toFixed(2).toString().replace("\.", ',');
          },
          field:{xtype:'textfield', place_id:pl.get('id'), param:'rate_jd', listeners:{focus:function(c, options){
            Ext.ComponentQuery.query('carsgrid')[0].lastEditorId = c.id;
            col = cmp.plugins[0].getActiveColumn(); rec = cmp.plugins[0].getActiveRecord();
            c.setValue(Ext.Array.filter(rec.get('codes'), function(i){ 
              return i.place_id==pl.get('id')
            })[0].rate_jd.toFixed(2).toString().replace("\.", ','))
          }}},
          getEditor:function(record, defaultValue){return Ext.create('Ext.grid.CellEditor', {field:this.field})}
        }
      ))
      // Ставка КЛИЕНТУ
      cmp.headerCt.insert(cmp.columns.length-3-codesNum, Ext.create('Ext.grid.column.Column', 
        {header:"КЛ."+short_name, dataIndex:"codes", width:55,
          renderer:function(data, metaData, rec, rowIndex, colIndex, store, view){
            return Ext.Array.filter(rec.get('codes'), function(i){ 
              return i.place_id==pl.get('id') 
            })[0].rate_client.toFixed(2).toString().replace("\.", ',');
          },
          field:{xtype:'textfield', place_id:pl.get('id'), param:'rate_client', listeners:{focus:function(c, options){
            Ext.ComponentQuery.query('carsgrid')[0].lastEditorId = c.id;
            col = cmp.plugins[0].getActiveColumn(); rec = cmp.plugins[0].getActiveRecord();
            c.setValue(Ext.Array.filter(rec.get('codes'), function(i){ 
              return i.place_id==pl.get('id')
            })[0].rate_client.toFixed(2).toString().replace("\.", ','))
          }}},
          getEditor:function(record, defaultValue){return Ext.create('Ext.grid.CellEditor', {field:this.field})}

        }
      ))
      // Добавляем коды для каждого плейса
      short_name = countriesStore.getById(pl.get('country_id')).get('short_name') 
      cmp.headerCt.insert(cmp.columns.length-1, Ext.create('Ext.grid.column.Column', 
        {header:"Код "+short_name, dataIndex:"codes", width:70, 
          renderer:function(data, metaData, rec, rowIndex, colIndex, store, view){
            return Ext.Array.filter(rec.get('codes'), function(i){ return i.place_id==pl.get('id') })[0].number
          },
          field:{xtype:'textfield', place_id:pl.get('id'), param:'number', listeners:{focus:function(c, options){
            Ext.ComponentQuery.query('carsgrid')[0].lastEditorId = c.id;
            col = cmp.plugins[0].getActiveColumn(); rec = cmp.plugins[0].getActiveRecord();
            c.setValue(Ext.Array.filter(rec.get('codes'), function(i){ return i.place_id==pl.get('id')})[0].number)
          }}},
          getEditor:function(record, defaultValue){return Ext.create('Ext.grid.CellEditor', {field:this.field})}
        }
      ))
      cmp.plugins.push(Ext.create('Ext.grid.plugin.CellEditing', {id:'carsEditPlugin', clicksToEdit: 1}))
    }
  },

  // То, что происходит после рендера таблица
  addColumnsAfterRender: function(cmp, options){
    var placesStore = Ext.ComponentQuery.query('placesgrid')[0].getStore();
    var countriesStore = Ext.getStore('Countries');
    // Добавляем ставки для каждого плейса
    placesStore.each(function(pl){
      Rq.view.CarsGrid.addColumn(pl)
    })

  },



})
