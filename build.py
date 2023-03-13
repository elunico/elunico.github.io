import yaml


def format_template(template, content):
    return template.replace(r'%{{content}}', content)


def render_featured_div(index, project):
    src_attr = 'data-src' if index >= 4 else 'src'
    if hasattr(project['img']['src'], 'keys'):
        light_url = project['img']['src']['light']
        dark_url = project['img']['src']['dark']
        img = f'''
        <img width="240px" data-mode="light" {src_attr}={light_url} alt="{project['img']['alt']}" class="light-img" />
        <img width="240px" data-mode="dark" {src_attr}={dark_url} alt="{project['img']['alt']}" class="dark-img" />
        '''
    else:
        url = project['img']['src']
        img = f'''
        <img width="240px"  data-mode="all" {src_attr}={url} alt="{project['img']['alt']}" />
        '''

    return f'''
    <a class="project" href="{project['link']}">
      <div >
        <h2>{project['title']}</h2>

        {img}
        <p class="description">
          {project['description']}
        </p>
      </div>
    </a>
    '''


def render_other_div(index, project):
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


def on_each_with_indent(lst, message, block):
    if not lst: 
        return 
    index = len(lst) - 1
    last = lst.pop()
    for index, item in enumerate(lst):
        print("\t\u2523 {}".format(message(index, item)))
        block(index, item)
    print("\t\u2517 {}".format(message(index, last)))
    block(index, last)


def render_section(projects, kind, renderer):
    if len(projects) == 0:
        return ''
    content = ['\n<h2 class="section-heading">{} Projects</h2>\n'.format(kind.title())]
    content += ['<div class="content-{}">'.format(kind)]
    on_each_with_indent(
        projects,
        lambda index, item: "{} project \"{}\"".format(kind, item['title']),
        lambda index, item: content.append(renderer(index, item))
    )
    content += ['</div>']
    return ''.join(content)


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

    print("Building content...")
    content = render_section(projects['featured'], 'featured', render_featured_div)

    content += render_section(projects['other'], 'other', render_other_div)

    print("Building page...")
    page = format_template(template, content)

    print("Writing to index.html...")
    with open('index.html', 'w') as f:
        f.write(page)

    print("Done!")


if __name__ == '__main__':
    main()
