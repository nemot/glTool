Ext.define('Rq.model.Request', {
  extend: 'Ext.data.Model',

  getProperties:function(){
    return {
      a_client_id:        this.get('client_id'),
      b_station_from_id:  this.get('station_from_id'),
      c_station_to_id:    this.get('station_to_id'),
      d_load_id:          this.get('load_id'),
      e_date_of_issue:    this.get('date_of_issue'),
      f_valid_until:      this.get('valid_until'),
      g_type_of_transportation:      this.get('type_of_transportation'),
      h_ownership:        this.get('ownership'),
      i_car_type_id:      this.get('car_type_id'),
      j_sender:           this.get('sender'),
      k_receiver:         this.get('receiver'),
      l_gu12:             this.get('gu12'),
      m_rate_for_car:     this.get('rate_for_car'),
      n_client_sum:       this.get('client_sum'),
      o_jd_sum:           this.get('jd_sum'),
      p_cars_num:         this.get('cars_num'),
      q_common_tonnage:   this.get('common_tonnage')
    }
  },

  fields: [
    {name:'id', type:'id'},
    {name:'client_id', type:'int'}, 
    {name:'client_name', type:'string'}, 
    {name:'station_from_id', type:'int'}, 
    {name:'station_from_name', type:'string'}, 
    {name:'station_to_id', type:'int'}, 
    {name:'station_to_name', type:'string'}, 
    {name:'load_id', type:'int'}, 
    {name:'load_name', type:'string'}, 
    {name:'date_of_issue', type:'date', dateFormat:'Y-m-d'}, 
    {name:'valid_until', type:'date', dateFormat:'Y-m-d'}, 
    {name:'type_of_transportation', type:'string'}, 
    {name:'ownership', type:'string'}, 
    {name:'car_type_id', type:'int'}, 
    {name:'car_type_name', type:'string'}, 
    {name:'sender', type:'string'}, 
    {name:'receiver', type:'string'}, 
    {name:'gu12', type:'string'}, 
    {name:'rate_for_car', type:'boolean'}, 

    {name:'client_sum', type:'float'}, 
    {name:'jd_sum', type:'float'}, 
    {name:'cars_num', type:'int'}, 
    {name:'common_tonnage', type:'int'}, 
    {name:'created_user_id', type:'int'}
    
  ],
  validations: [
      {type: 'presence',  field: 'created_user_id'}
  ],

  associations: [
    {type: 'belongsTo', model: 'User', name: 'created_user', foreignKey:'created_user_id'}
  ],

  proxy: {
    type: 'rest',
    url : '/requests',
    reader: {type:'json', root:'requests'},
    writer: {type:'json', root:'requests', writeAllFields:true}
  },
});
