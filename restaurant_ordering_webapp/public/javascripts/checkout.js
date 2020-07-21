// Stripe.setPublishableKey('pk_test_F0agafpeLU1vHhXvwrJE8wI400ydt9rLZo');

// Stripe.card.createToken({
//     number: $('#card-number').val(),
//     cvc: $('#card-cvc').val(),
//     exp_month: $('#card-expiry-month').val(),
//     exp_year: $('#card-expiry-year').val(),
//     address_zip: ('#address_zip').val() 
//   }, stripeResponseHandler);

// function stripeResponseHandler(status, response) {

//     // Grab the form:
//     var $form = $('#checkout-form');
  
//     if (response.error) { // Problem!
  
//       // Show the errors on the form
//       $form.find('#charge-error').text(response.error.message);
//       $form.find('#charge-error').removeClass('hidden');
//       $form.find('button').prop('disabled', false); // Re-enable submission
  
//     } else { // Token was created!
  
//       // Get the token ID:
//       var token = response.id;
  
//       // Insert the token into the form so it gets submitted to the server:
//       $form.append($('<input type="hidden" name="stripeToken" />').val(token));
  
//       // Submit the form:
//       $form.get(0).submit();
  
//     }
//   }









// // console.log("Hiiiiiii");
// // Stripe.setPublishableKey('pk_test_F0agafpeLU1vHhXvwrJE8wI400ydt9rLZo');

// // var form = document.getElementById("checkout-form");
// // console.log(form);

// // document.querySelector("button").on('submit',function(event){
// //     form.find('button').prop('disabled', true);
// //     Stripe.card.createToken({
// //         number:$('#card-number').val(),
// //         cvc: $('#card-cvc').val(),
// //         exp_month: $('#card-expiry-month').val(),
// //         exp_year: $('#card-expiry-year').val(),
// //         name: $('#card-name')
    
// //     }, stripeResponseHandler());
   
// //     return false;

// // });


// // function stripeResponseHandler (status, response){
// //     if (response.error) {
// //         // show the errors on the form
// //         $('#charge-error').text(response.error.message)
// //         $('#charge-error').removeClass('hidden');
// //         form.find('button').prop('disbled, false'); //enable resubmission button

// //         form.find()

// //     } else {//TOKEN IS CREATED
// //         var token= response.id;
// //         // insert token into the form so it gets submitted to the server
// //         form.append($('<inpute type="hidden" name="stripeToken" />').val(token));

// //         //submit the form
// //          form.get(0).submit();
    
// //     }
    




// //  }
