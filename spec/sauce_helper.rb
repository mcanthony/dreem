# Use Capybara integration
require "sauce"
require "sauce/capybara"

Capybara.default_driver = :sauce
Capybara.javascript_driver = :sauce

sc_type = ENV['CIRCLECI'] ? 'linux32' : 'osx'
puts "sc_type::::: #{sc_type}"

# Set up configuration
Sauce.config do |c|
  #c[:start_tunnel] = false,
  c[:sauce_connect_4_executable] = "./spec/sc-4.3.8-#{sc_type}osx/bin/sc",
  c[:connect_options] = {:logfile => 'sauceconnect_rspec.log'},
  c[:browsers] = [
      ["Windows 8.1", "Firefox", nil],
      ["Windows 8.1", "Chrome", nil],
      ["OS X 10.10", "Firefox", nil],
      ["OS X 10.10", "Chrome", nil],
      ["Linux", "Chrome", nil],
      ["Linux", "Firefox", nil]#,
  
  #capybara specs don't run on mobile
      #['OS X 10.9', 'iPhone', '8.1'],
      #['Linux', 'Android', '4.4']
  ]
end
