$(function(scope, rootScope, peop) {
	$('#sidebar-toggle-right').click(function(){
		console.log('hi');
		$('body').toggleClass('sidebar-open-right');
	});	
	$('#sidebar-toggle-left').click(function(){
		// console.log('hi');
		$('body').toggleClass('sidebar-open-left');
	});
//Sidebar Demo Actions
	$('#about').click(function(){
		 console.log('about-clicked');
		$('#demo').toggleClass('about');
	});
//PROMPT BIO
	// if($rootScope.userID){
	// 	console.log('there is a user')
	// } else {
	// 	console.log('there is NOT a user')
	// }
});