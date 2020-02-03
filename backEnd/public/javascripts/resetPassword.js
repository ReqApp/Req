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

    $('#submitButton').click(function(e) {
        e.preventDefault();
        const newPassword = $('#passwordBox').val();
        if (validateInput(newPassword, "password")) {
            $.ajax({
                type: 'POST',
                url: '/users/resetPassword',
                dataType: 'json',
                data: {
                    "newPassword": newPassword,
                    "fromUrl": window.location.href
                },
                success: function(res) {
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
        }
    });
});