Ext.define('Rq.Application', {
    extend: 'Ext.app.Application',
    name: 'Rq',

    requires: [],

    controllers: [
      'Requests'
    ],


    autoCreateViewport: true,

    launch: function() {
      
      Rq.App = this;

      // When google analytics event tracking script present on page
      if (Rq.initEventTracking) {
          Rq.initEventTracking();
      }
      // Отрубаем контекстное меню по всему приложению
      Ext.getBody().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});
      // Отрубаем стандартные горячие клавчиши по всему приложению
      document.onkeydown = function(){
       var x = event.keyCode;

       if (((x == 70)||(x == 68)||(x == 78)||(x == 79)||(x == 80)||(x == 83)) && (event.ctrlKey) || (x > 111 && x<124) ){
          event.cancelBubble = true;
          event.returnValue = false;
          event.keyCode = false;
          return false;
        }
      }

      // И назначаем свои
      var key = Ext.EventObject;
      var keyMap = new Ext.util.KeyMap(document, [
        { key:key.S , ctrl: true, // Save request
          fn: function(){
            Ext.ComponentQuery.query('#saveRequestBtn')[0].fireEvent('click')
          }
        }, 
        { key: key.C, ctrl: true, // Добавление кодов
          fn: function(){
            Rq.App.controllers.getAt(0).showAddCodesWindow()
          }
        },
        { key: key.F, ctrl: true, // Заполнить так же ставками как первую или выделеную
          fn: function(){
            var carsStore = Ext.ComponentQuery.query('carsgrid')[0].getStore();
            var selectedCar = Ext.ComponentQuery.query('carsgrid')[0].getSelectionModel().getSelection()[0];
            if(!selectedCar){selectedCar = carsStore.first()}
            carsStore.each(function(car){
              if(car!=selectedCar) {
                Ext.each(car.get('codes'), function(code, index){
                  code.rate_jd_real = selectedCar.get('codes')[index].rate_jd_real;
                  code.rate_jd = selectedCar.get('codes')[index].rate_jd;
                  code.rate_client = selectedCar.get('codes')[index].rate_client;
                })
                Rq.view.CarsGrid.recalcRates(car);
                car.beginEdit();
                car.set('rate_jd_real', selectedCar.get('rate_jd_real'))
                car.set('rate_jd', selectedCar.get('rate_jd'))
                car.set('rate_client', selectedCar.get('rate_client'))
                car.endEdit(); 
              }
            });
            Rq.controller.Requests.calculateRequest()
          }
        },
        { key: key.M, ctrl: true, // Добавление транзитной станции
          fn: function(){ Rq.App.controllers.getAt(0).addTransitStation(); }
        },
        { key: key.D, ctrl: true, // Добавление транзитной станции
          fn: function(){ Rq.App.controllers.getAt(0).addCosts(); }
        },
      ]);
    }
});

