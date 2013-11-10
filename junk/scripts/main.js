function hasTouch() {
  return (('ontouchstart' in window) ||
          (navigator.maxTouchPoints > 0) ||
          (navigator.msMaxTouchPoints > 0));
}

function showAll() {
  if($('body.page-').length == 0) return;
	$('.top').removeClass("hideit").addClass("animated").addClass('fadeInUp');
	$('.featured-h2').removeClass("hideit").addClass("animated").addClass('fadeInLeft');
  $('body').unbind('mouseenter mouseleave mousemove');
}

if(hasTouch()){
  setTimeout(showAll, 1000);
}

$(document).ready(function(){
  $("#signUpForm").find(".form-group img").hide();
});
$('body.page-').mousemove(showAll)

$('.menuTrigger, .close-trigger').click(function() {
	$('.menu').toggleClass("openMenu");
	$('.content').toggleClass("movecontent");
	$('.menuTrigger').toggleClass("active");
  return false;
});

$('#signUpForm').submit(function(){
  var el = $(this),
      from = el.find("input[name=from]").val();

  el.find('button').html('<img src="/img/dots.gif" />');
  el.find('input').trigger('blur'); //Revalidate before submitting
  var hc = $(this).find('input').hasClass('wrong');
  if(!hc) {
    $.ajax({
      url: '/signup',
      type: 'POST',
      data: el.serialize(),
      success: function(data) {
        data = JSON.parse(data);
        if(data.error !== undefined && data.error.message !== undefined) {
          $("#inputEmail").parent().find("img.check").hide();
          $("#inputEmail").parent().find("img.error").fadeIn();
          $("#inputEmail").parent().find("input").addClass('wrong');
          el
            .find('button')
              .text('Create my account')
              .end()
            .find('span').html(data.error.message);

        } else {
          //make fiirst letter upercase
          from = from.substr(0,1).toUpperCase() + from.substr(1);
          _gaq.push(['_trackEvent', 'Website clicks', 'Website signups', 'User signed up on ' + from + ' page']);
          window.location = '/signup/'+encodeURIComponent($("#inputFullName").val());
        }
      }
    }).always(function(){
        el.find('button').text('Create my account');
    });
  } else {
        el.find('button').text('Create my account');
  }
  return false;
}).find('input').bind("blur keyup", function(e){
  //Which keys to ignore
  if(e.keyCode != undefined && $.inArray(e.keyCode, [9, 17, 16, 20, 18]) != -1) {
    return;
  }
  var el = $(this);
  var name = el.attr('name');
  var val = el.val();
  var isValid = true;
  switch(name) {
    case 'email':
      if( !(/(.+)@(.+){2,}\.(.+){2,}/.test(val)) ){
        isValid = false;
      }
      break;
    case 'name':
    case 'company':
      if (!$.trim(val)) {
			  isValid = false;
			}
      break;
    case 'password':
      val = $.trim(val);
      if (val.length<6) {
			  isValid = false;
			}
      break;
    case 'from':
      return;
  }

  if(isValid) {
    el.parent().find('img.check').fadeIn();
    el.parent().find("img.error").fadeOut();
    el.removeClass('wrong');
  } else {
    el.parent().find('img.check').fadeOut();
    el.parent().find("img.error").fadeIn();
    el.addClass('wrong');
  }
});

// $('.left-arrow-div').hover(function() {
// 	$('.arrow-left').fadeToggle();
// });

// $('.right-arrow-div').hover(function() {
// 	$('.arrow-right').fadeToggle();
// });

// $('.arrow-right').hover(function() {
// 	$('.arrow-right').show();
// });

  var social = $('.social');

    social
      .find('li a')
        .click(function(){
          var el = $(this),
              aboutPage = el.hasClass('inner') ? true : false,
              href = el.attr('href'),
              from;

              if (el.hasClass('fb')) {
                from = 'Facebook icon';
              } else if (el.hasClass('tw')) {
                from = 'Twitter icon';
              } else {
                from = 'LinkedIn icon';
              }

              if (aboutPage) {
                from = from + ' on about page';
              } else {
                from = from + ' in sidebar';
              }

              _gaq.push(['_trackEvent', 'Website clicks', 'Feature testing', 'User clicked on ' + from ]);
              window.open(href, '_blank');

              return false;
        });
