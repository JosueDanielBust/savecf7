# Pull leads from Wordpress Contact Forms

##
1. First of all you need to install the latest version of NodeJS.
	
    _If you don't have yet **NodeJS** please install it downloading and installing from [nodejs.org](https://nodejs.org/)._

2. Open a terminal in your computer.
	* **Mac:** Terminal
	* **Windows:** CMD

3. Go to the folder where this package is located using ```cd ../path/to/folder/```

4. Install the script using ```npm install```

5. Create the ```config.js``` file. _(On the folder is located a config sample file)_

```javascript
'use strict';
// Data of connection to the database
let host     = 'localhost',
	user     = 'user',
	password = 'password',
	database = 'database';

// Month
// Number of the month without 0 (zero)
let year	= 2017,
	month	= 3;
    
module.exports = { host, user, password, database, year, month };
```

6. Run using the ```npm start``` command
7. Check your folder and get every **.csv** file
8. Import the file on your excel using the " **|** " symbol as separated character.


##
### Dependencies

* mysql: ^2.13.0 => [https://www.npmjs.com/package/mysql](https://www.npmjs.com/package/mysql)


##
### Contributors
* Josue Daniel Bustamante: [JosueDanielBust](https://github.com/josuedanielbust)
* Jesse Cogollo: [jessecogollo](https://github.com/jessecogollo)