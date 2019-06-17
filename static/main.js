var timesClicked = 0;

function keyAnimations() {

    if (timesClicked > 1) {
        return;
    }

    if (timesClicked === 0) {
        timesClicked++;
        let ellipse1 = document.getElementById('path4698');
    ellipse1.style.animationPlayState  = 'running';
    document.querySelector('form-control').onclick = () => {
        if (ellipse1.style.animationPlayState  === 'paused')
        ellipse1.style.animationPlayState = 'running';
        else
        ellipse1.style.animationPlayState  = 'paused';
    }

    
    } else {

        let ellipse1 = document.getElementById('ellipse4728');
        ellipse4728.style.animationPlayState  = 'running';
    document.querySelector('form-control').onclick = () => {
        if (ellipse4728.style.animationPlayState  === 'paused')
        ellipse4728.style.animationPlayState = 'running';
        else
        ellipse4728.style.animationPlayState  = 'paused';
    }


    }
    
}


