$(document).ready(function() {
    $('#submitButton').click(function(e) {
        e.preventDefault();
        const activationCode = $('#codeBox').val();
        console.log("The code: " + activationCode);
        const searchQuery = /^[0-9a-zA-Z]+$/;

        if (activationCode.match(searchQuery)) {
            $.ajax({
                type: 'POST',
                url: '/users/verifyAccount',
                dataType: 'json',
                data: {
                    "activationCode": activationCode
                },
                success: function(token) {
                    $(location).attr('href', 'http://localhost:8673/users/profile');
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