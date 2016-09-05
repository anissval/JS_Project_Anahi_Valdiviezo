
$(document).ready(function() {
    updateUserForm();
	$('.error').hide();
    $('#alert_placeholder').hide();
    $('#userIdField').hide();

	$("#send-btn").click(function() {
        $("#userForm").hide();
        bootstrapAlertLoading("Creating user ... please wait ");
        createUser(getDatos()).catch(handleError);
		return false;
	});

    $("#cancel-btn").click(function() {
        location.href = "index.html";
        return false;
    });

    $("#update-btn").click(function() {
        $("#userForm").hide();
        bootstrapAlertLoading("Updating user ... please wait ");
        updateUser(getDatos()).catch(handleError);
        return false;
    });

    $("#update-btn").hide();
});

  
//User class
function User(name, lastName, email, tel) {
    var self = this;
    self.name = name;
    self.lastName = lastName;
    self.email = email;
    self.tel = tel;

};

function UserEditable (name, lastName, email, tel, id) {
    var self = this;
    self.id = id;
    User.call(self,name,lastName,email,tel);
}

//gets a particular user
function getUser(id) {
 return $.ajax('/contacts/'+ id, { method: "GET" }).then(function(data){
    $("input#userId").attr('value', data.contactId || data.id );
    $('#userIdField').show();
    $("input#name").attr('value', data.name );
    $("input#lastName").attr('value', data.lastName );
    $("input#email").attr('value', data.email );
    $("input#tel").attr('value', data.tel );
    $("#update-btn").show();
    $("#send-btn").hide();
        }, function(error){
            $('#userForm').hide();
            bootstrapAlertFail("There was a problem retriving the user ...please reload the page");
            console.log(error);
        });
};

//retriving user data
function getDatos() {
    var id = $("input#userId").val();
    var name = $("input#name").val();
    var lastName = $("input#lastName").val();
    var email = $("input#email").val();
    var tel = $("input#tel").val();
    if(id.length!==0){
    var user = new UserEditable(name, lastName, email, tel, id);
    } else{
    var user = new User(name, lastName, email, tel);
    }
    return user;
};

//creates a user
function createUser(contact) {
    return $.ajax('/contacts', { method: "POST", data: {contact} }).then(function(data) {
    setTimeout(function(){ bootstrapAlertSuccess('User successfully created'); }, 2000);
    console.log(" User successfully created ");

    }, function(error){
        $('#userForm').hide();
        setTimeout(function(){ bootstrapAlertFail('Fail creating new user .. please try again'); }, 2000);
        console.log(error);
    });

};

//updates a user
function updateUser(contact) {
   return $.ajax('/contacts/' +contact.id, { method: "PUT", data: { contact }}).then(function(data) {
    setTimeout(function(){ bootstrapAlertSuccess('User successfully updated'); }, 2000);
     console.log(" User successfully updated ");
    }, function(error){
        $('#userForm').hide();
        setTimeout(function(){ bootstrapAlertFail('Fail updating user .. please try again'); }, 2000);
        console.log(error);
    });
    
};

function handleError(error) {
    console.log(error);
};
//navigate to a href
function navigate(href) {
    location.href = href;
};
//retrives the id from the user that we are going to update.
function updateUserForm(){
   var URLsearch = window.location.search;

    if(URLsearch!==null && URLsearch!=='undefined' && URLsearch.length !== 0 ){
        var _editUserId = URLsearch.substr(8,URLsearch.length);
        getUser(_editUserId);
    }

};

//alert for succesfull process
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
                        html('<div class="alert"><a id="closeX" class="close">×</a><span><strong>'
                        +message+'</strong></span></div><div><button id="reTry">Reintentar</button><button id="goList>Ver usuarios</button></div>');
                        $('#reTry').click(function() {
                                                        navigate("user.html");
                                                        return false;
                                                        });
                        $('#goList').click(function() {
                                                        navigate("index.html");
                                                        return false;
                                                        });
                        $('#alert_placeholder').show();
                    };
//alert to show some info
var bootstrapAlertLoading = function(message) {
                                $('#alert_placeholder').attr('class', 'alert alert-info');
                                $('#alert_placeholder').
                                html('<div class="alert"><a id="closeX" class="close">×</a><span><strong>'
                                +message+'</strong></span></div>');
                                $('#alert_placeholder').show();
                            };




