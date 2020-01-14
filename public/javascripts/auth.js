$(document).ready(function() {

    $.getScript("//cdnjs.cloudflare.com/ajax/libs/validate.js/0.13.1/validate.min.js")
        // .done(function( script, textStatus ) {
        //     console.log( textStatus );
        // })
        .fail(function(jqxhr, settings, exception) {
            $("div.log").text("Triggered ajaxError handler.");
        });

    function validateInput(input) {
        if (input.length > 0 && input.length < 25) {
            return true;
        } else {
            return false;
        }
    }

    $('#submitButton').click(function(e) {
        e.preventDefault();
        let requestType = $('#currMode').html();

        if (escape($('#usernameBox').val()) == $('#usernameBox').val() &&
            escape($('#passwordBox').val()) == $('#passwordBox').val() &&
            validateInput(escape($('#usernameBox').val())) &&
            validateInput(escape($('#passwordBox').val()))) {

            if (requestType === 'Register') {

                $.ajax({
                    type: 'POST',
                    url: '/users/register',
                    dataType: 'json',
                    data: {
                        "user_name": $('#usernameBox').val(),
                        "password": $('#passwordBox').val()
                    },
                    success: function(token) {
                        $(location).attr('href', '/');
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        swal({
                            icon: 'error',
                            title: 'Oops...',
                            text: jqXHR.responseJSON.body
                        })
                    }
                });
            } else {
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
        } else {
            swal({
                icon: 'error',
                title: 'Oops...',
                text: 'Illegal characters in username or password'
            })
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