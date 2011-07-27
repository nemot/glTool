# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = %q{authlogic}
  s.version = "3.0.3"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = [%q{Ben Johnson of Binary Logic}]
  s.date = %q{2011-05-17}
  s.email = %q{bjohnson@binarylogic.com}
  s.extra_rdoc_files = [%q{LICENSE}, %q{README.rdoc}]
  s.files = [%q{LICENSE}, %q{README.rdoc}]
  s.homepage = %q{http://github.com/binarylogic/authlogic}
  s.require_paths = [%q{lib}]
  s.rubygems_version = %q{1.8.1}
  s.summary = %q{A clean, simple, and unobtrusive ruby authentication solution.}

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<activerecord>, [">= 3.0.7"])
      s.add_runtime_dependency(%q<activerecord>, [">= 3.0.7"])
    else
      s.add_dependency(%q<activerecord>, [">= 3.0.7"])
      s.add_dependency(%q<activerecord>, [">= 3.0.7"])
    end
  else
    s.add_dependency(%q<activerecord>, [">= 3.0.7"])
    s.add_dependency(%q<activerecord>, [">= 3.0.7"])
  end
end
