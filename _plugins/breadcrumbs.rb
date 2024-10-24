module Jekyll
  class BreadcrumbsGenerator < Generator
    safe true

    def generate(site)
      site.pages.each do |page|
        # 如果页面没有定义面包屑，则使用默认值
        if !page.data['breadcrumbs']
          page.data['breadcrumbs'] = [
            { 'title' => 'Home', 'url' => '/' },
            { 'title' => page.data['title'], 'url' => page.url }
          ]
        else
          page.data['breadcrumbs'] = page.data['breadcrumbs'].map do |crumb|
            {
              title: crumb['title'],
              url: crumb['url']
            }
          end
        end
      end
    end
  end
end
