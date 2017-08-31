'use strict';

/* ---------------------------------------------\
\	- Configurations of Script					/
/	- Change only the next lines				\
\----------------------------------------------*/

// Data of connection to the database
let host     = 'localhost',
	user     = 'user',
	password = 'password',
	database = 'database';

// Month
// Number of the month without 0 (zero)
let year	= 2017,
	month	= 3;

/* ---------------------------------------------\
\	- Easy? This is all the config...			/
/	- Don't touch anything after this line		\
\----------------------------------------------*/

module.exports = { host, user, password, database, year, month };
