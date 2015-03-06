// JS app for signup page
// includes password validation and ajax post

$("#form").submit(function () {
	event.preventDefault();
	var firstPassword = $("#passwordInputOne").val();
	var secondPassword = $("#passwordInputTwo").val();
	
	// validate
	if (validatePasswordFields(firstPassword, secondPassword)) {
		//construct credentials object
		credentials = new Object();
		credentials.username = $("#usernameInput").val();
		credentials.password = firstPassword;

		// ajax request to server
		// was getting parseerror, so I took out dataType and it seems to work
		$.ajax({
			url: '/api/signup',
			type: 'post',
			data: JSON.stringify(credentials),
			contentType: 'application/json',
			success: function() {
				window.location.href = "/";
			},
			error: function(x, e) {
	            if(x.status == 0){
	                alert('You are offline!!\n Please Check Your Network.');
	            }else if(x.status == 404){
	                alert('Requested URL not found.');
	            }else if(x.status == 500){
	                alert('Internel Server Error.');
	            }else if(e == 'parsererror'){
	                alert('Error.\nParsing JSON Request failed.');
	            }else if(e == 'timeout'){
	                alert('Request Time out.');
	            }else {
	                alert('Unknow Error.\n'+x.responseText);
	            }
        	}
		});
	}
});

// Accepts the two passwords entered and first checks to see if they are the same.
// Future implementation will ensure the password is strong.
function validatePasswordFields(firstPassword, secondPassword) {
	if (firstPassword != secondPassword) {
		alert("The two entered passwords are not the same!");
		return false;
	}
	return true;
}