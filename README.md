# wysiwyg_id
A simple WYSIWYG editor (In Development)

# Usage:
Run the below command after modification
```
npm run dev
```
The output file will be generated in `/dist` folder saved as `main.js`.
You can include this script, and css (`style.css`) file in your homepage to use it as mentioned below.

```
<html>
    <head>
        <link rel="stylesheet" href="/path/to/style.css">
        <script src="/path/to/main.js"></script> 
    </head>
    <body>
        ...
        <div class="editor"></div>
        ...
        <div class="editor"></div>
        ...
    </body>
</html>
```
