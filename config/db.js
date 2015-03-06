
var connection;

function init(dbConfig) {
	// configuration ===============================================================
	// connect to our database
	connection = mysql.createConnection(configDB);
	connection.connect(function(err) {
    if (err) {
        throw err;
    }
	    console.log('Connected to mysql database.');
	});
}

function query(sqlStatement, param, callback) {
	connection.query(sqlStatement, param, callback);
}

module.exports.init = init;
module.exports.query = query;