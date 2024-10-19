## Javascript/Jquery
#### Ajax
~~~~
$.ajax({
    url: page,
    type: 'POST',
    data: {informacao : valor},
    success: function(response){
       
    },
    error: function(response){
        console.log(response);
    }
});
~~~~ 

#### Set Timeout
~~~~
setTimeout(function(){ alert("Hello"); }, 3000);
~~~~ 

## MySQL
#### Events
~~~~
CREATE EVENT event_name
    ON SCHEDULE
      EVERY 1 HOUR
      STARTS '2015-07-20 17:30:00'
    DO
       <query>
~~~~ 


## Apache (.htaccess)
#### mod_deflate
~~~~
<IfModule mod_deflate.c>
  # Compress HTML, CSS, JavaScript, Text, XML and fonts
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
  AddOutputFilterByType DEFLATE application/x-font
  AddOutputFilterByType DEFLATE application/x-font-opentype
  AddOutputFilterByType DEFLATE application/x-font-otf
  AddOutputFilterByType DEFLATE application/x-font-truetype
  AddOutputFilterByType DEFLATE application/x-font-ttf
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE font/opentype
  AddOutputFilterByType DEFLATE font/otf
  AddOutputFilterByType DEFLATE font/ttf
  AddOutputFilterByType DEFLATE image/svg+xml
  AddOutputFilterByType DEFLATE image/x-icon
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/xml
</IfModule>
~~~~ 

#### Cache Browser
~~~~
<IfModule mod_expires.c>
	ExpiresActive On
	ExpiresByType image/jpg "access plus 1 year"
	ExpiresByType image/jpeg "access plus 1 year"
	ExpiresByType image/gif "access plus 1 year"
	ExpiresByType image/png "access plus 1 year"
	ExpiresByType text/css "access plus 1 month"
	ExpiresByType text/html "access plus 1 month"
	ExpiresByType application/pdf "access plus 1 month"
	ExpiresByType text/x-javascript "access plus 1 month"
	ExpiresByType application/x-shockwave-flash "access plus 1 month"
	ExpiresByType image/x-icon "access plus 1 year"
	ExpiresDefault "access 1 month"
</IfModule>
~~~~ 

#### Forçar HTTPS
~~~~
RewriteCond $1 !^(index\.php|images|robots\.txt)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php/$1 [QSA,L]
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI}
~~~~ 

## HTML/CSS - Bootstrap
#### Rodapé Fixo
~~~~
<!DOCTYPE html>
<html>
<head>
<title></title>
	<style>
	html,
body {
	margin:0;
	padding:0;
	height:100%;
}
#wrapper {
	min-height:100%;
	position:relative;
}
#header {
	padding:10px;
	background:#5ee;
}
#content {
	padding:10px;
	padding-bottom:80px;   /* Height of the footer element */
}
#footer {
	width:100%;
	height:80px;
	position:absolute;
	bottom:0;
	left:0;
	background:#ee5;
}</style>
</head>


<body>
	
		<div id="header"></div>
		<div id="content"></div>
		<div id="footer"></div>
	
</body>
</html>
~~~~ 

#### Tabela com texto alinhado verticalmente
~~~~
.table > tbody > tr > td {
  vertical-align: middle;
}
~~~~ 

#### Texto centralizado verticalmente
~~~~
<div class="text-center d-flex align-items-center justify-content-center">
   Texto
</div>
~~~~ 

## Git
#### Sincronizando branch com master
~~~~
git fetch && git rebase origin/master && git push
~~~~ 

### Case sensitive
~~~~
git config core.ignorecase false
~~~~

#### Resetando alterações e mantendo código do último commit
~~~~
git reset --hard
~~~~ 

## Linux
#### Atualizando pacotes instalados
~~~~
apt-get upgrade
~~~~ 
#### Removendo pacotes instalados e não utilizados
~~~~
apt-get purge
~~~~ 
