// We will be using MixItUp's 'changeLayout' API method to add and remove a 
// 'list' class to the container. This class changes the styling of our target 
// elements (see CSS).
  
 // NB: Changing layout doesn't have to be between grid/list only, we can add
 // any class we want and use it to affect the styling of our elements.

$(function(){
   if (window.innerWidth > 600){ // changes display on screen size
      var layout = 'grid'
   } else {
      var layout = 'list'
   };
   
   console.log(layout);
      $container = $('#list-container'); // Cache the MixItUp container
      $changeLayout = $('#ChangeLayout'); // Cache the changeLayout button
      
  // Instantiate MixItUp with some custom options:
  
  // $container.mixItUp({
  //   animation: {
  //     animateChangeLayout: true, // Animate the positions of targets as the layout changes
  //     animateResizeTargets: true, // Animate the width/height of targets as the layout changes
  //     duration: 500,
  //     effects: 'fade rotateZ(180deg) rotateX(180deg) scale(0.01)',
  //     easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  //   },
  //   layout: {
  //     containerClass: layout // Add the class 'list' to the container on load
  //   }
  // });
  
  // MixItUp does not provide a default "change layout" button, so we need to make our own and bind it with a click handler:
  
  $changeLayout.on('click', function(){
    
    // If the current layout is a list, change to grid:
    
    if(layout == 'list'){
      layout = 'grid';
      
      $changeLayout.html('<span class="glyphicon glyphicon-list"></span>'); // Update the button text
      
      $container.mixItUp('changeLayout', {
        containerClass: layout // change the container class to "grid"
      });
      
    // Else if the current layout is a grid, change to list:  
    
    } else {
      layout = 'list';
      
      $changeLayout.html('<span class="glyphicon glyphicon-th"></span>'); // Update the button text
      
      $container.mixItUp('changeLayout', {
        containerClass: layout // Change the container class to 'list'
      });
    }
  });

  $('.sort').on('click', function(){ // changes button to asc and desc respectively
     $('.sort').toggle(); // changes button
  })
  
});