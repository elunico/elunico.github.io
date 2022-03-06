import yaml


def format_template(template, content):
    return template.replace(r'%{{content}}', content)


def render_div(project):
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

    print('Loaded {} projects'.format(len(projects)))

    content = ''
    for project in projects:
        print("Building project {}".format(project['title']))
        content += render_div(project)

    print("Writing to index.html")

    page = format_template(template, content)
    with open('index.html', 'w') as f:
        f.write(page)

    print("Done")


if __name__ == '__main__':
    main()
