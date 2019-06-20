// Wrap every letter in a span
function main() {

  let h1 = document.querySelector('h1');
  h1.style.display = 'block';

  $('.ml11 .letters').each(function () {
    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
  });

  anime.timeline({ loop: false })
    .add({

    })
    .add({

    }).add({
      targets: '.ml11 .letter',
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 600,
      offset: '-=775',
      delay: function (el, i) {
        return 34 * (i + 1)
      }
    }).add({
      targets: '.ml11',


    });

}

var timesClicked = 0;

function keyAnimations() {

  if (timesClicked > 1) {
    return;
  }

  if (timesClicked === 0) {
    timesClicked++;
    let ellipse1 = document.getElementById('path4698');
    ellipse1.style.animationPlayState = 'running';
    document.querySelector('#username').onclick = () => {
      if (ellipse1.style.animationPlayState === 'paused')
        ellipse1.style.animationPlayState = 'running';
      else
        ellipse1.style.animationPlayState = 'paused';
    }


  } else {
    
    let ellipse1 = document.getElementById('ellipse4728');
    ellipse4728.style.animationPlayState = 'running';
    document.querySelector('#username').onclick = () => {
      if (ellipse4728.style.animationPlayState === 'paused')
        ellipse4728.style.animationPlayState = 'running';
      else
        ellipse4728.style.animationPlayState = 'paused';
    }


  }

}


document.addEventListener('DOMContentLoaded', () => {
  setTimeout(function () {
    main();
  }, 500);
});

