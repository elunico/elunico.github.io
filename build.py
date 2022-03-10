import yaml


def format_template(template, content):
    return template.replace(r'%{{content}}', content)


def render_featured_div(project):
    return f'''
    <div class="project">
      <a href="{project['link']}">
        <h2>{project['title']}</h2>
        <img src="{project['img']['src']}" alt="{project['img']['alt']}">
        <p class="description">
          {project['description']}
        </p>
      </a>
    </div>
    '''


def render_other_div(project):
    return f'''
    <div class="simple-project">
      <a href="{project['link']}">
        <h3>{project['title']}</h3>
        <p hidden class="simple-description">
          {project['description']}
        </p>
      </a>
    </div>
    '''


def render_section(projects, kind, renderer):
    if len(projects) == 0:
        return ''
    content = '\n<h2 class="section-heading">{} Projects</h2>\n'.format(kind.title())
    content += '<div class="content-{}">'.format(kind)
    for project in projects:
        print("Building {} project {}".format(kind, project['title']))
        content += renderer(project)
    content += '</div>'
    return content


def main():
    try:
        with open('index.html.template') as f:
            template = f.read()
    except FileNotFoundError:
        print('index.html.template not found')
        exit(1)

    try:
        with open('projects.yaml') as f:
            projects = yaml.load(f, Loader=yaml.SafeLoader)
    except FileNotFoundError:
        print('projects.yaml not found')
        exit(1)

    print('Loaded {} projects'.format(len(projects['featured']) + len(projects['other'])))

    content = render_section(projects['featured'], 'featured', render_featured_div)

    content += render_section(projects['other'], 'other', render_other_div)

    print("Writing to index.html")

    page = format_template(template, content)
    with open('index.html', 'w') as f:
        f.write(page)

    print("Done")


if __name__ == '__main__':
    main()
