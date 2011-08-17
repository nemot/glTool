Ext.define('Gl.controller.Users', {
    extend: 'Ext.app.Controller',

    models:['User'],
    stores:['Users', 'Roles', 'UserActions'],

    init: function() {
      this.control({
        "usersgrid":{itemdblclick:this.userRowDblClick},
        "#userAddBtn":{click:this.showNewUserWindow},
        "#userCreateButton":{click:this.submitCreateForm},
        "#userSaveButton":{click:this.submitEditForm},
        "#editUserBtn":{click: this.editUser},
        "#changeUserPasswordBtn":{click: this.changePassword},
        "#userChangePasswordBtn":{click: this.submitPassword},
        "#showLogBtn":{click:this.showActionsWindow}
      })
    },

    showActionsWindow: function(){
      var rec = Ext.ComponentQuery.query('usersgrid')[0].getSelectionModel().getSelection()[0];
      var win = Ext.create("Gl.view.users.ActionsLogWindow", {user:rec}).show();
    },

    submitPassword: function(btn){
      var form = Ext.getCmp("changeUserPasswordForm").getForm();
      var rec = Ext.ComponentQuery.query('changeuserpasswordwindow')[0].rec;
      btn.setDisabled(true);

      form.submit({
        url:'/users/'+rec.get('id')+'/update_password', method:"POST",
        clientValidation: true,

        success:function(frm,action){
          var msg = 'Пароль пользователя был изменен'
          
          Ext.example.msg('', msg+'.');
          Ext.ComponentQuery.query('changeuserpasswordwindow')[0].close();
        },

        failure:function(frm, action){
          switch (action.failureType) {
            case Ext.form.action.Action.CLIENT_INVALID:
                Ext.example.msg('Ошибка пользователя!', 'Проверьрьте правильности заполненой формы');
                break;
            case Ext.form.action.Action.CONNECT_FAILURE:
                Ext.example.msg('Ошибка на сервере!', 'Произошла ошибка на сервере. Было послано письмо администратору с описанием проблемы.');
                break;
            case Ext.form.action.Action.SERVER_INVALID:
               Ext.example.msg('Ошибка пользователя!', 'Проверьрьте правильности заполненой формы');
          }
        }
      })
    },

    changePassword: function(){
      var rec = Ext.ComponentQuery.query('usersgrid')[0].getSelectionModel().getSelection()[0];
      Ext.create("Gl.view.users.ChangePasswordWindow", {rec:rec}).show();
    },


    userRowDblClick: function(view, rec, item, index, e){
      Ext.create("Gl.view.users.EditUserWindow", {rec:rec}).show();
    },

    editUser: function(){
      var rec = Ext.ComponentQuery.query('usersgrid')[0].getSelectionModel().getSelection()[0];
      Ext.create("Gl.view.users.EditUserWindow", {rec:rec}).show();
    },

    showNewUserWindow:function(){
      var win = Ext.create("Gl.view.users.UserWindow").show();
    },

    submitEditForm: function(){
      var form = Ext.getCmp("userEditForm").getForm();
      if( form.isValid() ){
        var vals = form.getValues();
        var rec = Ext.ComponentQuery.query('edituserwindow')[0].rec;
        rec.beginEdit();
        rec.set('login', vals['user[login]']);
        rec.set('fio', vals['user[fio]']);
        rec.set('position', vals['user[position]']);
        rec.set('role_id', vals['user[role_id]']);
        rec.set('email', vals['user[email]']);
        rec.endEdit();
        Ext.ComponentQuery.query('edituserwindow')[0].close();
      } else {
        Ext.example.msg('Ошибка пользователя!', 'Проверьрьте правильности заполненой формы');
      }
    },
    
    submitCreateForm:function(){
      var form = Ext.getCmp("userCreateForm").getForm();
      var vals = form.getValues();
      form.submit({
        url:'/users',
        method:"POST",
        clientValidation: true,
        success:function(frm,action){
          Ext.example.msg('', 'Пользователь был успешно создан');
          Ext.ComponentQuery.query('usersgrid')[0].getStore().load();
          Ext.ComponentQuery.query('userwindow')[0].close();
        },
        failure:function(frm, action){
          switch (action.failureType) {
            case Ext.form.action.Action.CLIENT_INVALID:
                Ext.example.msg('Ошибка пользователя!', 'Проверьрьте правильности заполненой формы');
                break;
            case Ext.form.action.Action.CONNECT_FAILURE:
                Ext.example.msg('Ошибка на сервере!', 'Произошла ошибка на сервере. Было послано письмо администратору с описанием проблемы.');
                break;
            case Ext.form.action.Action.SERVER_INVALID:
               Ext.example.msg('Ошибка пользователя!', 'Проверьрьте правильности заполненой формы');
          }
        }
      })
    }

})
