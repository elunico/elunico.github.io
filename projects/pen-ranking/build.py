import yaml

with open("ranking.yaml") as f:
    data = yaml.load(f, Loader=yaml.FullLoader)

print(data)

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

template_ol_block = '''<div class="body-container">
    <h1>{}</h1>
    <div>
      <ol>
        {}
      </ol>
    </div>
  </div>'''

template_ul_block = '''<div class="body-container">
  <h1>{}</h1>
  <div>
    <ul>
      {}
    </ul>
  </div>
</div>'''

template_item = '''<li>{}</li>'''

with open("index.html", "w") as f:
    block = ''
    for key in data:
        if 'unordered' in key:
            block += template_ul_block.format(key, ''.join([template_item.format(item) for item in data[key]]))
        else:
            block += template_ol_block.format(key, "\n".join([template_item.format(item) for item in data[key]]))

    f.write(template_file.format(block))
