import yaml


template_file = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Tom's Official Pen Ranking</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  {}
</body>
</html>
'''

template_list_block = '''<div class="body-container">
  <h1>{}</h1>
  <div>
    <%sl>
      {}
    </%sl>
  </div>
</div>'''

template_item = '''<li>{}</li>'''


def block_no_items(html):
    return html.replace('<h1>', '<h1 class="no-items">')


def format_item(item):
    return template_item.format(item.replace('\n', '<br/>').replace('  ', '&nbsp;&nbsp;'))


def format_block(key, items):
    list_block = template_list_block % (
        tuple([('u' if 'unordered' in key else 'o')])*2)

    if len(items) == 0:
        list_block = block_no_items(list_block)

    return list_block.format(key, "\n".join([format_item(item) for item in items]))


def main():
    with open("ranking.yaml") as f:
        data = yaml.load(f, Loader=yaml.FullLoader)

    with open("index.html", "w") as f:
        file = ''.join(format_block(key, data[key]) + '\n\n' for key in data)
        f.write(template_file.format(file))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
