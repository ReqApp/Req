$(document).ready(function() {

    function validateInput(input, type) {
        if (type === 'password') {
            if (input.length > 8) {
                return true;
            } else {
                return false;
            }
        } else if (type === "username") {
            if (input.length < 32 && input.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    $.getScript("//cdnjs.cloudflare.com/ajax/libs/validate.js/0.13.1/validate.min.js")
        // .done(function( script, textStatus ) {
        //     console.log( textStatus );
        // })
        .fail(function(jqxhr, settings, exception) {
            $("div.log").text("Triggered ajaxError handler.");
        });

    $('#submitButton').click(function(e) {
        e.preventDefault();
        let requestType = $('#currMode').html();
        const username = $('#usernameBox').val();
        const password = $('#passwordBox').val();

        let run = true;

        // if (escape($('#usernameBox').val()) == $('#usernameBox').val() &&
        //     escape($('#passwordBox').val()) == $('#passwordBox').val() &&
        //     validateInput(escape($('#usernameBox').val())) &&
        //     validateInput(escape($('#passwordBox').val()))) {

        if (!(username === encodeURIComponent(username))) {
            swal({
                icon: 'error',
                title: 'Oops...',
                text: "Username cannot contain those characters"
            });
            run = false;
        }
        if (!validateInput(username, "username")) {
            swal({
                icon: 'error',
                title: 'Oops...',
                text: "Username be between 1 and 32 characters in length"
            });
            run = false;
        }

        if (!validateInput(password, "password")) {
            swal({
                icon: 'error',
                title: 'Oops...',
                text: "Password must be more than 8 characters in length"
            });
            run = false;
        }

        if (!validateInput(password, "email")) {
            swal({
                icon: 'error',
                title: 'Oops...',
                text: "Invalid email address"
            });
            run = false;
        }

            if (requestType === 'Register' && run) {

                $.ajax({
                    type: 'POST',
                    url: '/users/register',
                    dataType: 'json',
                    data: {
                        "user_name": $('#usernameBox').val(),
                        "password": $('#passwordBox').val(),
                        "email":$("#emailBox").val()
                    },
                    success: function(token) {
                        $(location).attr('href', '/users/verifyAccount');
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        swal({
                            icon: 'error',
                            title: 'Oops...',
                            text: jqXHR.responseJSON.body
                        })
                    }
                });
            } else if (requestType === "Login" && run) {
                $.ajax({
                    type: 'POST',
                    url: '/users/login',
                    dataType: 'json',
                    data: {
                        "user_name": $('#usernameBox').val(),
                        "password": $('#passwordBox').val()
                    },
                    success: function(token) {
                        $(location).attr('href', '/');
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // console.log(jqXHR.responseJSON.body);
                        // swal("Oops", jqXHR.responseJSON.body, 'Not GOOD!');
                        swal({
                            icon: 'error',
                            title: 'Oops...',
                            text: jqXHR.responseJSON.body
                        })
                    }
                });
            }
    });

    $('#usernameBox').keydown(function() {
        $('#usernameBox').attr('style', 'border-color: #dedede');
        let input = $('#usernameBox').val();
        if (input.length == 15) {
            $('#usernameBox').attr('style', 'border-color: #f31c1c');
        }

    });

    $('#passwordBox').keydown(function() {
        $('#passwordBox').attr('style', 'border-color: #dedede');
        let input = $('#passwordBox').val();
        if (input.length == 30) {
            $('#passwordBox').attr('style', 'border-color: #f31c1c');
        }

    });

    $('#switchText').click(function(e) {
        e.preventDefault();
        let currentMode = $('#currMode').html();

        if (currentMode == 'Login') {
            $('#currMode').html('Register');
            $('#submitButton').html('Register');
            $('#switchText').html(`Not new? <a href="" id="switchInterface"> Login here`);
            return;
        }

        if (currentMode == 'Register') {
            $('#currMode').html('Login');
            $('#submitButton').html('Login');
            $('#switchText').html(`New? <a href="" id="switchInterface"> Register here`);
            return;
        }
    })

});