class UserAction < ActiveRecord::Base
  belongs_to :user

  def humanized_action
    I18n.t('action.'+self.action)+": "+self.entity
  end

end
