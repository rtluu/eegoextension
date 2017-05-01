
function authenticateUser(){
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    var token = localStorage.getItem('user_token');

    let request = $.ajax({
      method: 'POST',
      url: 'https://eego.co/api/items',
      headers: { 'Authorization': 'JWT ' +  token},
      data: {
        originalUrl: url
      }
    });

  });

}

function userLogin(){

  /*Get URL*/
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    /*Grab Url*/
    var tab = tabs[0];
    var url = tab.url;

    /*Get User Email/Password from Form*/
    var email = $('#login-form')[0].children.email.value;
    var password = $('#login-form')[0].children.password.value;

    let request = $.ajax({
      method: 'POST',
      url: 'https://eego.co/api/auth/login',
      data: {
        email: email,
        password: password
      }
    });

    request.done(function(response){
      localStorage.setItem('user_token', response.token);
      let request = $.ajax({
        method: 'POST',
        url: 'https://eego.co/api/items',
        headers: { 'Authorization': 'JWT ' +  response.token},
        data: {
          originalUrl: url
        }
      });
    });
  });

  $('.popup-container').removeClass('must-auth');
}

document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.length > 0){
    authenticateUser(function(){});
  } else{
    $('.popup-container').addClass('must-auth');
  }

});

document.getElementById('login-form').addEventListener('submit', function(evt){
    evt.preventDefault();
    userLogin(function() {});
});
