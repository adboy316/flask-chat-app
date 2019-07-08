// Sources: https://speckyboy.com/page-transition-effects/

document.addEventListener('DOMContentLoaded', () => {


    $('.btn').on('click', function (e) {
        
        e.preventDefault();
        transition();
        setTimeout(function(){ $("#loginform").unbind("submit").submit(); }, 1000);
        
        
    });

    function transition() {
        var tl = new TimelineMax();

        tl.to(CSSRulePlugin.getRule('body:before'), 0.2, { cssRule: { top: '50%' }, ease: Power2.easeOut }, 'close')
            .to(CSSRulePlugin.getRule('body:after'), 0.2, { cssRule: { bottom: '50%' }, ease: Power2.easeOut }, 'close')


            .to($('.loader'), 0.2, { opacity: 1})
            .to(CSSRulePlugin.getRule('body:before'), 0.2, { cssRule: { top: '0%' }, ease: Power2.easeOut }, '+=1.5', 'open')
            .to(CSSRulePlugin.getRule('body:after'), 0.2, { cssRule: { bottom: '0%' }, ease: Power2.easeOut }, '-=0.2', 'open')
            .to($('.loader'), 0.2, { opacity: 0 }, '-=0.2');
            
        
    }

   
   
});