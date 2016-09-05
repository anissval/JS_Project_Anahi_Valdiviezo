
$(document).ready(function() {
	$('#alert_placeholder').hide();
		getUsers().catch(handleError);
	$('.error').hide();

	$('#deleteAllButton').hide();

	$("#deleteAllButton").click(function() {
		$("#userListView").hide();
		bootstrapAlertInfo("Deleting all users");
		deleteAllUsers().then(getUsers).catch(handleError);
		return false;
	});
	$("#createButton").click(function() {
		location.href = "User.html";
		return false;
	});

	$("#deleteSelected").click(function() {
		$("#userListView").hide();
		bootstrapAlertInfo("Deleting selected user(s)");
		deleteSelectedUsers();
		return false;
	});
	
});

//gets all users
function getUsers() {
return $.ajax('/contacts', { method: "GET" }).then(function(data){
	if(data!==null && data!=='undefined'&&data.length!==0){
		refreshUsersTable(data);
		$('#deleteAllButton').show();
		$("#deleteSelected").show();
	} else{
		$('#userList').hide();
		$('#deleteAllButton').hide();
		$("#deleteSelected").hide();
		 bootstrapAlertInfo("No Users found ... ");
	}

 }, function(error) {
	$('#userListView').hide();
		bootstrapAlertFail("There was a problem retriving the data ...please reload the page");
		console.log(error);
	});
};

//gets a particular user
function getUser(id) {
	return $.ajax('/contacts/'+ id, { method: "GET" }).then(function(data){
	console.log(data);
}, function(error){
		$('#userListView').hide();
		bootstrapAlertFail("There was a problem retriving the user ...please reload the page");
		console.log(error);
	});
};

//retriving selected user/s
function deleteSelectedUsers() {
	var selectedUsers;
	var users = [];
	selectedUsers = $("[type='checkbox']");
   
	for (var i = 0; i < selectedUsers.length; i++) {
		if(selectedUsers[i].checked === true){
			var user_id = selectedUsers[i].value;
			deleteUser(user_id).catch(handleError);
		}   
	};
};

//updates a user
function updateUser(id, contact) {
	return $.ajax('/contacts/' +id, { method: "PUT", data: { contact }}).then(function(data) {
		console.log(" User successfully updated ");
		console.log(data);
	}, function(error){
			$('#userListView').hide();
			bootstrapAlertFail("There was a problem updating the user ...please reload the page");
			console.log(error);
	});
	
};

//deletes all users
function deleteAllUsers() {
	return $.ajax('/contacts', { method: "DELETE" }).then(function(data){
		$('#alert_placeholder').show();
		getUsers().catch(handleError);
		console.log("All users were deleted");
	}, function(error){
			$('#userListView').hide();
			bootstrapAlertFail("There was a problem deleting all users ...please reload the page");
			console.log(error);
	 });

};

//deletes a user
function deleteUser(id) {
   return $.ajax('/contacts/' +id, { method: "DELETE" }).then(function(data){
		getUsers().catch(handleError);
		setTimeout(function(){ bootstrapAlertSuccess('User(s) successfully deleted'); }, 2000);
		console.log("User deleted ");
	}, function(error){
			$('#userListView').hide();
			bootstrapAlertFail("There was a problem deleting the user ...please reload the page");
			console.log(error);
	 });

};

//navigates to a href
function navigate(href) {
	location.href = href;
};

//creates the table with the last data available
function refreshUsersTable(data) {
	var headerAdded = false;
	//table
	var table = $('<table></table>');
	table.attr('class', 'table table-striped table-hover');
  
for(i=0; i< data.length; i++) {
	var _id =  data[i].contactId||data[i].id;
	if(!headerAdded){
		//table header
		var rowHeader = $('<thead><tr><td><strong>Select</strong></td><td><strong>User ID</strong></td><td><strong>Name</strong></td><td><strong>Lastname</strong></td><td><strong>Email</strong></td><td><strong>Phone Number<strong></td></tr></thead>');
		table.append(rowHeader);
		table.append('<tbody>');
		headerAdded = true;
	}
	var row = $('<tr></tr>');
	//checkbox to select user
	var userCheckbox = $('<input type="checkbox" name="">');
	userCheckbox.attr('value', data[i].contactId||data[i].id );
	userCheckbox.attr('id',data[i].contactId||data[i].id);
	//checkbox Column
	var columnSelect = $('<td></td>');
	columnSelect.append(userCheckbox);
	row.append(columnSelect);
	//user data
	var columnId = $('<td></td>').text(data[i].contactId||data[i].id);
	row.append(columnId);
	var columnName = $('<td></td>').text(data[i].name);
	row.append(columnName);
	var columnLastName = $('<td></td>').text(data[i].lastName);
	row.append(columnLastName);
	var columnemail = $('<td></td>').text(data[i].email);
	row.append(columnemail);
	var columntel= $('<td></td>').text(data[i].tel);
	row.append(columntel);
	var columnDelete= $('<td></td>');

	//buttons edit and delete
	var deleteButton =$('<button>Delet</button>');
	deleteButton.attr('id', data[i].contactId||data[i].id);
	deleteButton.attr('class', 'btn-danger');
	deleteButton.click(function(){ deleteUser(this.id); $("#userListView").hide();
	bootstrapAlertInfo("Deleting selected user(s)");});
	columnDelete.append(deleteButton);
	row.append(columnDelete);

	var editColumn= $('<td></td>');
	var editButton =$('<button>Edit</button>')
	editButton.attr('id', data[i].contactId||data[i].id);
	editButton.attr('class', 'btn-warning');
	editButton.click(function(){ location.href='user.html?userId='+this.id});
	editColumn.append(editButton);
	row.append(editColumn);
	table.append(row);
}
	table.append('</tbody>');
   $('#userList').html(table);
   $('#userList').show;
};

function handleError(error) {
	console.log(error);
};

//alert for success process
var bootstrapAlertSuccess = function(message) {
						$('#alert_placeholder').attr('class', 'alert alert-success');
						$('#alert_placeholder').
						html('<div class="alert"><a id="closeX" class="close">×</a><span><strong>'
						+message+'</strong></span></div><div id="navigateButton"><button class="btn-success">Accept</button></div>');
						$('#navigateButton').click(function() {
							navigate("index.html");
							return false;
						});
						$('#alert_placeholder').show();
					};

//alert for fail process
var bootstrapAlertFail = function(message) {
							$('#alert_placeholder').attr('class', 'alert alert-danger');
							$('#alert_placeholder').
							html('<div class="alert"><a class="close">×</a><span><strong>'
							+message+'</strong></span></div><div id="navigateButton"><button class="btn-danger">Accept</button></div>');
							$('#navigateButton').click(function() {
							navigate("index.html");
							return false;
						});
						$('#alert_placeholder').show();
					};

//alert to show some info
var bootstrapAlertInfo = function(message) {
								$('#alert_placeholder').attr('class', 'alert alert-info');
								$('#alert_placeholder').
								html('<div class="alert"><a id="closeX" class="close">×</a><span><strong>'
								+message+'</strong></span></div>');
								$('#alert_placeholder').show();
							};