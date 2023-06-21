/*!
=========================================================
* Steller Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// smooth scroll
$(document).ready(function(){
	$(".nav-link").on('click', function(event) {

    	if (this.hash !== "") {

			event.preventDefault();

			var hash = this.hash;

			$('html, body').animate({
				scrollTop: $(hash).offset().top
			}, 700, function(){
				window.location.hash = hash;
			});
      	} 
    });
});

window.addEventListener('scroll', fadeInOnScroll);

function fadeInOnScroll() {
  const container = document.id('about');
  const containerTop = container.getBoundingClientRect().top;
  const windowBottom = window.innerHeight;

  if (containerTop < windowBottom) {
    container.style.opacity = '1';
  }
}