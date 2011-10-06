Ext.define('Rq.controller.Requests', {
  extend: 'Ext.app.Controller',

  models:['Request', 'User', 'Client', 'Station', 'Code', 'Car', 'Place', 'Country'],
  stores:['Countries', 'Cars', 'Places', 'Costs', 'Clients'],

  init: function() {
    current_user = new Rq.model.User(current_user);
    current_request = new Rq.model.Request(current_request);
    this.control({
      "#addCodesMenuItem": {click:this.showAddCodesWindow},
      "#addCodesSubmitBtn": {click:this.addCodesToGrid},
      "#toField": {specialkey:function(f,e){if(e.getKey() == e.ENTER){this.addCodesToGrid()}}},
      "#deleteCarsMenuItem": {click:this.deleteCars},
      "#addCostsMenuItem": {click:this.addCosts}
//      "requestsgrid":{itemdblclick: this.showRequestWindow},
    })

  },

  // Добавляет доп сборы
  addCosts: function(){
    var store = Ext.ComponentQuery.query('costsgrid')[0].getStore();
    var placesStore = Ext.ComponentQuery.query('placesgrid')[0].getStore()
    var country_name = (placesStore.count()==1) ? placesStore.first().get('country_name') : ""
    var place_id = (placesStore.count()==1) ? placesStore.first().get('id') : null
    store.add({id:store.getMinId()-1, place_id:place_id, country_name:country_name});
  },

  // Удаляет вагоны
  deleteCars: function(){
    var store = Ext.ComponentQuery.query('carsgrid')[0].getStore();
    var rec = Ext.ComponentQuery.query('carsgrid')[0].getSelectionModel().getSelection()[0];
    store.remove(rec);
  },

  // Добавляет коды из окошка в таблицу кодов
  addCodesToGrid: function(){
    var form = Ext.ComponentQuery.query('#addCodesForm')[0].getForm()
    var carsStore = Ext.ComponentQuery.query('carsgrid')[0].getStore();
    var placesStore = Ext.ComponentQuery.query('placesgrid')[0].getStore();
    // Проверяем форму на пустые значения
    if(form.isValid()){
      var values = form.getValues()
      if(values['from']>values['to']){ // Проверям на правильность введения
        Ext.example.msg('Ошибка пользователя.', 'Код "С" должен быть больше чем код "По"');
      } else { // Ну и собственно добавляем сами коды если все нормально
        var fromCode = parseInt(values['from']);
        var toCode = parseInt(values['to']);
        // Сначала в пустые коды существующих вагонов
        carsStore.each(function(car){
          Ext.each(car.get('codes'), function(code){
            if(parseInt(code.place_id)==values['place_id']){
              if(code.number=="" && fromCode<=toCode){ // Только в пустые ячейки
                code.number = fromCode; fromCode+=1
              }
            }
          });
        });
        // Ну и если остались не добавленые коды, то добавляем вагоны
        var cars = []
        while(fromCode<=toCode){
          var car = {id:carsStore.getMinId()-1, codes:[]};
          placesStore.each(function(place){
            car.codes.push({
              number: (parseInt(values['place_id'])==parseInt(place.get('id')) ? fromCode.toString() : ''),
              place_id:place.get('id'),
              rate_client:0,
              rate_jd_real:0,
              rate_jd:0,
              id:null,
              car_id:carsStore.getMinId()-1
            });
          });
          cars.push(car)
          fromCode+=1;
        }
        if(cars.length>0){carsStore.add(cars)};
        // В добавок обновляем отображение таблички вагонов
        Ext.ComponentQuery.query('carsgrid')[0].getView().refresh();
        // А уж потом закрываем окошко
        Ext.ComponentQuery.query('#addCodesWindow')[0].close()
      }
    }
  },
  
  // Создает окошко для добавления кодов
  showAddCodesWindow: function(){
    var placesStore = Ext.ComponentQuery.query('placesgrid')[0].getStore();
    
    if(placesStore.count()>0) { // Только если есть хоть один плейс
      var countryFieldValue = (placesStore.count()==1) ? placesStore.first().get('id') : null
      var win = Ext.create('Ext.window.Window',{
        id:'addCodesWindow',
        title:'Добавить коды',
        closable:true, width:300, height:170, modal:true, layout:'fit',
        items:[
          {xtype:'form', frame:true, id:'addCodesForm', items:[
              {fieldLabel:'С', name:'from', id:'fromField'},
              {fieldLabel:'По', name:'to', id:'toField'},
              {fieldLabel:'Страна', name:'place_id',
                xtype:'combo', queryMode: 'local', displayField: 'country_name', valueField: 'id', editable:false,
                store: placesStore, hideTrigger:false,
                value: countryFieldValue
              }
            ], 
            defaults:{labelWidth:50, anchor:'95%', hideTrigger:true, xtype:'numberfield', allowBlank:false}
          }
        ],
        buttons:[
          {text:'Отмена', handler:function(){ win.close() }},
          {text:'Добавить', iconCls:'add', id:'addCodesSubmitBtn'}
        ],
        listeners:{ afterrender:function(){ Ext.getCmp('fromField').focus() } }// Фокус на первое поле ввода 
      });
      win.show();
    } else { // Если плейсы пусты показываем алерт
      Ext.example.msg('Ошибка пользователя.', 'Добавьте хотя бы одну страну с экспедитором.');
    }
  }
  
  
});

