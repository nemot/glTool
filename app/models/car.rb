class Car < ActiveRecord::Base
  belongs_to :request
  has_many :codes

  def rate_jd
    self.codes.empty? ? 0 : self.codes.map{|code| code.rate_jd}.sum
  end

  def rate_jd_real
    self.codes.empty? ? 0 : self.codes.map{|code| code.rate_jd_real}.sum
  end

  def rate_client
    self.codes.empty? ? 0 : self.codes.map{|code| code.rate_client}.sum
  end
end
