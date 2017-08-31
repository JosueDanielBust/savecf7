'use strict';

console.time('Runtime');

let fs = require('fs');
let mysql = require('mysql');
let config = require('./config');

// MySQL Connection data
// Replace here the data of the host
let connection = mysql.createConnection({
	host     :	config.host,
	user     :	config.user,
	password :	config.password,
	database :	config.database
});
let year	=	config.year;
let month	=	config.month;

// SQL Queries
let dateFromDate = year + '-' + needZero(month);
let dateToDate = year + '-' + needZero(month+1);

function needZero(number) {
	let theNumber = '';
	if (number < 10) { theNumber = '0' + number; }
	else { theNumber = number; }
	return theNumber;
}

// Get Databases of Save Contact Form 7
function getDatabases() {
	return new Promise( function(resolve, reject) {
		let getDatabasesQuery = 'SELECT lookup_id as id, CFDBA_tbl_name AS dbname, CF7_created_title AS dbtitle FROM SaveContactForm7_lookup AS lookup;';
		connection.query(getDatabasesQuery, function (error, results, fields) {
			if (error) throw error;
			return resolve(results);
		});
	})
}

// Iterating on every table of the database
function iterateSingle(database) {
	return new Promise( function(resolve, reject) {
		let query = createSQLQuery(database);
		connection.query(query, function(error, results, fields) {
			let dataObject;
			if (error) { dataObject = undefined; };
			if (results == undefined) { results = []; }
			dataObject = { 'dbtitle': database.dbtitle, results };
			return resolve(dataObject);
		});
	})
}

function iterateAll(databases) {
	return Promise.all(databases.map(function (db) { return iterateSingle(db); })).then(
		values => { return values },
		error => { console.log('[ERROR] ' + error); }
	);
}

function filter(results) { return results.filter(function (obj) { return obj ? true : false; })}

// Create Query of each table
function createSQLQuery(db) {
	let query = 'SELECT	* FROM ' + db.dbname + ' WHERE created_on >= \'' + dateFromDate + '\' AND created_on <= \'' + dateToDate + '\';';
	return query;
}

// Output to a CSV file
function exportSingleCSV(data) {
	return new Promise( function(resolve, reject) {
		if (data.results.length > 0) {
			let filename = 'Report - ' + data.dbtitle + '.csv';
			let info = parseToCSV(data.results);

			fs.writeFile(filename, info, function (error) {
				if (error) { return console.log(error);
				} else {
					console.log('=> Report Form was successfully created => "' + data.dbtitle + '"');
					return resolve('');
				}
			});
		} else { return resolve(''); }
	})
}

function exportToCSV(fullData) {
	return Promise.all(fullData.map( function(data) { return exportSingleCSV(data); })).then(
		values => { return fullData},
		error => { console.log(error); }
	);
}

// Parser [Object] to CSV
const parseToCSV = (dataObj) => {
	let array = typeof dataObj !== 'object' ? JSON.parse(dataObj) : dataObj;
	let str = '';
	str = Object.keys(dataObj[0]).join('|') + '\r\n';
	for (let i = 0; i < array.length; i++) {
		let line = '';
		for (let index in array[i]) {
			if (line !== '') { line += '|'; }
			let data = '';
			data += array[i][index];
			data = cleanNewline(data);
			line += data;
		}
		str += line + '\r\n';
	}
	return str;
};

// Clean text from NewLines
function cleanNewline(string) { return string.replace(/[\n\r]/g,' '); }

// Main execution
getDatabases('')
	.then(iterateAll)
	.then(filter)
	.then(exportToCSV)
	.then(result => {
		console.timeEnd('Runtime');
		console.log('=> Check your folder...');
		connection.end();
	}).catch(error => { throw error; });