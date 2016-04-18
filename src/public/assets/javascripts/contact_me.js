$(function() {
    var $contactForm = $('form#contactForm');
    var $success = $('#success');

    $contactForm.find('input, textarea').jqBootstrapValidation({
        preventSubmit: true,
        submitSuccess: sendMessage,
        filter: function() {
            return $(this).is(":visible");
        },
    });


    function showErrorMessage(message) {

      $success.html("<div class='alert alert-danger'>");

      var $alertError = $('#success > .alert-danger');

      $alertError.html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
          .append("</button>");

      $alertError.append("<strong>" + message + "</strong>");
      
      $alertError.append('</div>');
        }

    function showSuccessMessage(message) {

       $success.html("<div class='alert alert-success'>");

       var $alertSuccess = $('#success > .alert-success');

       $alertSuccess.html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
       .append("</button>");
       
       $alertSuccess.append("<strong>" + message + "</strong>");
       
       $alertSuccess.append('</div>');
      //clear all fields
      $contactForm.trigger("reset");
        }

    function sendMessage($form, event) {

      event.preventDefault();

      var data = $form.serialize();

            $.ajax({
                url: '/send-message',
                method: 'POST',
                data: data,
                success: function(data) { 
                    var message = "Your message has been sent."

                    try {
                        message = data.responseJSON.message 
                    } catch(e) {}

                    showSuccessMessage(message)
                },
                error: function(err) {
                    console.error(err);

                    var message = "Sorry, it seems that my mail server is not responding. Please try again later!";
                    
                    try {
                        message = err.responseJSON.message 
                    } catch(e) {}
  
                    showErrorMessage(message)
                }
            })      
        }


    // $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
    //     preventSubmit: true,
    //     submitError: function($form, event, errors) {
    //         // additional error messages or events
    //     },
    //     submitSuccess: function($form, event) {
    //         event.preventDefault(); // prevent default submit behaviour
    //         // get values from FORM
    //         var name = $("input#name").val();
    //         var email = $("input#email").val();
    //         var subject = $("input#subject").val();
    //         var message = $("textarea#message").val();
    //         var firstName = name; // For Success/Failure Message
    //         // Check for white space in name for Success/Fail message
    //         if (firstName.indexOf(' ') >= 0) {
    //             firstName = name.split(' ').slice(0, -1).join(' ');
    //         }
    //         // $.ajax({
    //         //     url: "././mail/contact_me.php",
    //         //     type: "POST",
    //         //     data: {
    //         //         name: name,
    //         //         phone: phone,
    //         //         email: email,
    //         //         message: message
    //         //     },
    //         //     cache: false,
    //         //     success: function() {
    //         //         // Success message
    //         //         $('#success').html("<div class='alert alert-success'>");
    //         //         $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
    //         //             .append("</button>");
    //         //         $('#success > .alert-success')
    //         //             .append("<strong>Your message has been sent. </strong>");
    //         //         $('#success > .alert-success')
    //         //             .append('</div>');

    //         //         //clear all fields
    //         //         $('#contactForm').trigger("reset");
    //         //     },
    //         //     error: function() {
    //         //         // Fail message
    //                 // $('#success').html("<div class='alert alert-danger'>");
    //                 // $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
    //                 //     .append("</button>");
    //                 // $('#success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!");
    //                 // $('#success > .alert-danger').append('</div>');
    //                 // //clear all fields
    //                 // $('#contactForm').trigger("reset");
    //         //     },
    //         // })
    //     },
    //     filter: function() {
    //         return $(this).is(":visible");
    //     },
    // });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
