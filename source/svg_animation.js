var spiderChart_autodraw = new Animation_Config();
spiderChart_autodraw.animation_name = "autodraw";
spiderChart_autodraw.exclude_id = "octagon";
spiderChart_autodraw.duration = 100;

var spiderChart_fade_in = new Animation_Config();
spiderChart_fade_in.animation_name = "fade_in";
spiderChart_fade_in.focus_id = "octagon";
spiderChart_fade_in.duration = 500;

var spiderChart_morph = new Animation_Config();
spiderChart_morph.animation_name = "morph";
spiderChart_morph.focus_id = "octagon";
spiderChart_morph.duration = 800;
spiderChart_morph.values = [ //only required when "morphing"
    { value: 'M126.155 148.908l5.146-12.424 12.425-5.147 12.424 5.147 5.146 12.424-5.146 12.424-12.424 5.146-12.425-5.146z' },
    { value: 'M91.477 148.908l18.362-33.887 33.887-6.097 34.938 5.045 17.924 34.939-6.628 46.234-46.234 2.512-31.91-16.837z' }
];
spiderChart_morph.fill = ["#000", "#95f"];

var text_fade_in = new Animation_Config();
text_fade_in.animation_name = "fade_in";
text_fade_in.focus_id = "text";
text_fade_in.duration = 750;

var spiderChart = new Animation_Preset();
spiderChart.svg_id = "svg4712";
spiderChart.svg_animations = [spiderChart_autodraw, spiderChart_fade_in, spiderChart_morph, text_fade_in]; //available preset names are: "morph", "fade_in", "autodraw"
spiderChart.timeline = "sequencial"; //sequencial or synchronous

//loadSVG("../assets/webmap.svg", "spider-chart", spiderChart);

//----------------------------------------------------------

function loadSVG(svg_path, div_id, animation) {
    let svg_file = new XMLHttpRequest();
    svg_file.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById(div_id).innerHTML =
                this.responseText;
        }
    };

    svg_file.onload = function () {
        if (svg_file.status >= 200 && svg_file.status < 400) {
            //Animation function goes here
            if (animation !== undefined)
                go_animate(animation);
        } else {
            console.log("We connected to the server but it returned an error.");
        }
    };

    svg_file.onerror = function () {
        console.log("Connection error.");
    };

    svg_file.open("GET", svg_path, true);
    svg_file.send();
}

function go_animate(animation) {
    let svg_content = document.getElementById(animation.svg_id);
    let tl;
    if (animation.timeline == "sequencial") {
        tl = anime.timeline({});
    } else {
        tl = undefined;
    }
    let targets = svg_content.children[0].children;
    for (let i = 0; i < animation.svg_animations.length; i++) {
        let localAnimation = animation.svg_animations[i];
        let animation_name = localAnimation.animation_name;
        console.log("-------------------------------------");
        console.log(`Animation Name: ${animation_name}`);
        //console.log(`focus: ${localAnimation.focus_id}`);
        //console.log(`excluded: ${localAnimation.exclude_id}`);
        let duration = localAnimation.duration;
        let delay = localAnimation.delay;
        for (let index = 0; index < targets.length; index++) {
            let target_id;
            if (localAnimation.focus_id !== undefined) {
                let wildcardLen = localAnimation.focus_id.length;
                //if (localAnimation.focus_id == targets[index].id) {
                if (targets[index].id.substring(0, wildcardLen) == localAnimation.focus_id) {
                    target_id = targets[index].id;
                }
            }
            if (localAnimation.exclude_id !== undefined) {
                let wildcardLen = localAnimation.exclude_id.length;
                //if (localAnimation.exclude_id !== undefined && `/^${localAnimation.exclude_id}` !== targets[index].id) {
                if (targets[index].id.substring(0, wildcardLen) != localAnimation.exclude_id) {
                    target_id = targets[index].id;
                }
            }
            if (localAnimation.focus_id === undefined && localAnimation.exclude_id === undefined) {
                target_id = targets[index].id;
            }
            if (target_id !== undefined) {
                target_id = `#${target_id}`;
                switch (animation_name) {
                    case "fade_in":
                        fade_in(target_id, duration, delay, tl);
                        break;
                    case "autodraw":
                        if (targets[index] == "[object SVGPathElement]") {
                            let stroke_Length = `${targets[index].getTotalLength()}px`;
                            //console.log(`${index}: Target id: ${target_id}`);
                            auto_draw(target_id, stroke_Length, duration, delay, tl);
                        }
                        break;
                    case "morph":
                        //let morph_target = `#${localAnimation.focus_id}`;
                        morph(target_id, localAnimation.values, localAnimation.fill, duration, delay, tl);
                        break;
                    case "delay":
                        a_delay(target_id, delay, tl);
                        break;
                }
            }
        }

    }

    /*
    var elements = document.getElementsByTagName('text');
    var webElements = document.getElementsByTagName('path');
    var tl = anime.timeline({});

    for (let j = 0; j < webElements.length; j++) {
        if (webElements[j].id != "octagon") {
            let stroke_Length = `${webElements[j].getTotalLength()}px`;
            let elemntID = `#${webElements[j].id}`;
            let duration = 100;
            let delay = 0;
            auto_draw(elemntID, stroke_Length, duration, delay, tl);
        }
    }

    fade_in('#octagon', 750, 500, tl);

    let morph_descriptor = [
        { value: 'M126.155 148.908l5.146-12.424 12.425-5.147 12.424 5.147 5.146 12.424-5.146 12.424-12.424 5.146-12.425-5.146z' },
        { value: 'M91.477 148.908l18.362-33.887 33.887-6.097 34.938 5.045 17.924 34.939-6.628 46.234-46.234 2.512-31.91-16.837z' }
    ];
    let fill = ["#000", "#95f"];
    let duration = 750;
    let delay = 0;
    morph('#octagon', morph_descriptor, fill, duration, delay, tl);


    for (let i = 0; i < elements.length; i++) {
        let elementID = `#${elements[i].id}`;
        //fade_in(elementID, 1000, 0, tl); //Sequencial play
        //Delaying everything a littlebit this is for the syncronous play
        let duration = 1500;
        let delay = (duration / 5) * i + 3100;
        fade_in(elementID, duration, delay);
    }
    */
}



function morph(targets, morph_descriptor, fill = ['#383645', '#b0ff64'], duration = 1000, delay = 0, timeline) {
    if (timeline === undefined) {
        anime({
            targets: targets,
            d: morph_descriptor,
            fill: fill,
            easing: 'easeInOutExpo',
            duration: duration,
            delay: delay
        });
    } else {
        timeline.add({
            targets: targets,
            d: morph_descriptor,
            fill: fill,
            easing: 'easeInOutExpo',
            duration: duration,
            delay: delay
        });
    }

}

function auto_draw(targets, stroke_Length = '100px', duration = 1000, delay = 0, timeline) {
    let style = [
        `stroke-dasharray: ${stroke_Length}; stroke-dashoffset: ${stroke_Length};`,
        `stroke-dasharray: ${stroke_Length}; stroke-dashoffset: 0px;`
    ];
    if (timeline === undefined) {
        anime({
            targets: targets,
            style: style,
            easing: 'linear',
            duration: duration,
            delay: delay
        });
    } else {
        timeline.add({
            targets: targets,
            style: style,
            easing: 'linear',
            duration: duration,
            delay: delay
        });
    }
}

function a_delay(targets, delay = 500, timeline) {
    timeline.add({
        targets: targets,
        delay: delay
    });

}

function fade_in(targets, duration = 1000, delay = 0, timeline) {
    if (timeline === undefined) {
        anime({
            targets: targets,
            opacity: ['0', '1'],
            duration: duration,
            delay: delay
        });
    } else if (timeline) {
        timeline.add({
            targets: targets,
            opacity: ['0', '1'],
            duration: duration,
            delay: delay
        });
    }
}

function Animation_Config(animation_name, focus_id, exclude_id, duration, delay, timeline, values, fill) {
    this.animation_name = animation_name;
    this.focus_id = focus_id;
    this.exclude_id = exclude_id;
    this.duration = duration;
    this.delay = delay;
    this.values = values;
    this.fill = fill;
}

function Animation_Preset(svg_id, svg_animations, timeline) {
    this.svg_id = svg_id;
    this.svg_animations = svg_animations;
    this.timeline = timeline;
}