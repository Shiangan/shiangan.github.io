module Breadcrumbs
  def breadcrumbs
    path = []
    current_page = page

    while current_page
      path << { title: current_page.data['title'], url: current_page.url }
      current_page = current_page.parent
    end

    path.reverse
  end
end

Liquid::Template.register_filter(Breadcrumbs)
