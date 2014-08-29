class Tweet < ActiveRecord::Base
  belongs_to :user

  validates :content, :user, presence: true
end
