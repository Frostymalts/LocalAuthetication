$("#form").submit(function () {
	event.preventDefault();
    var credentials  = new Object();
    
    credentials.username = $("#usernameInput").val();
    credentials.password = $("#passwordInput").val();

	$.ajax({
		url: '/api/login',
		type: 'post',
        data: JSON.stringify(credentials),
        contentType: 'application/json',
        dataType: 'json',
		success: function() {
			window.location.href = "/";
		},
		error: function(x, status, err) {
            if(x.status == 0){
                alert('You are offline!!\n Please Check Your Network.');
            }else if(x.status == 404){
                alert('Requested URL not found.');
            }else if(x.status == 500){
                alert('Internel Server Error.');
            }else if(status == 'parsererror'){
                alert('Error.\nParsing JSON Request failed.');
            }else if(status == 'timeout'){
                alert('Request Time out.');
            }else {
                alert(x.responseJSON.message);
            }
    	}

	})
});