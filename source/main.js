var swap_language = document.getElementById("swap-language");
var download_doc = document.getElementById("download");
var container = document.getElementById("resume");
var languages = ["english", "spanish"];
var canvas_name =["planos_estrella_de_la_muerte.png", "death_star_plans.png"];
var json_counter = 0;

LoadJsonFile(languages[json_counter]);

swap_language.addEventListener("click", function () {
    LoadJsonFile(languages[json_counter]);
});

download_doc.addEventListener("click", function() {
    if(window.confirm("(づ｡◕‿‿◕｡)づ \n    ¿Save?")){
        html2canvas(document.getElementById("resume")).then(canvas => {
            //document.body.appendChild(canvas)
            console.log(canvas.width);
            console.log(canvas.height);
            var image = canvas.toDataURL().replace("image/png", "image/octet-stream");
            //window.location.href = image;

            /*
            let link = document.createElement("a");
            link.setAttribute("download", "deathStarPlans.png");
            link.setAttribute("href", image);
            document.body.appendChild(link);
            link.click();
            link.remove();
            */

            let xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function () {
                let a = document.createElement('a');
                a.href = window.URL.createObjectURL(xhr.response);
                //a.download = 'death_star_plans.png';
                a.download = canvas_name[json_counter];
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                a.remove();
            };
            xhr.open('GET', image); // This is to download the canvas Image
            xhr.send();

        });
    }
});

function m_article_template(m_article){
    var template = "";
    for (let i = 0; i < m_article.length; i++) {
        template += `
        <section>
            ${m_article[i].title ? "<h5>" + m_article[i].title + "</h5>" : ""}
            <p>
            ${(m_article[i].accent ? "<strong>" + m_article[i].accent + "</strong> " :  "")
            + m_article[i].content}
            </p>
        </section>
        `;
    }
    return template;
}

function articles_template(articles){
    var template = "";
    for (let i = 0; i < articles.length; i++) {
        template += `
        <article id="article-${i}">
            <h3>${articles[i].Title}</h3>
            ${articles[i]["sub-title"] ? "<h5>" + articles[i]["sub-title"] + "</h5>" : ""}
            ${articles[i].content ? "<p>" + articles[i].content + "</p>" : ""}
            ${articles[i]["mini-Article"] ? m_article_template(articles[i]["mini-Article"]) : ""}
        </article>
        `;
    }
    return template;
}

function renderHTML(data) {
    //swap_language.innerHTML = languages[json_counter];
    //console.log(data["Main-Title"]);
    container.innerHTML = `
    <h1 id="cv">${data["Main-Title"]}</h1>
    <div id="img-holder">
        <div id="mugshot_slot">
            <img id="mugshot" src="assets/${data.Mugshot}" alt="">
        </div>
        <div id="graph_slot">
        
        </div>
    </div>

    <section id="id-card">
        <h2>${data.Name}</h2>
        <p>${data.Contact.Birthday}</p>
        <p>${data.Contact.Address}</p>
        <p>${data.Contact.Email}</p>
        <p>${data.Contact.Website}</p>
        <p>${data.Contact.Repository}</p>
    </section>
    ${articles_template(data.Articles)}
    `;
    //<img id="spider-chart" src="assets/${data.Graph}" alt=""></img>
    //console.log(data.Graph);
    
    loadSVG(`../assets/${data.Graph}`, "graph_slot", spiderChart); 
    
    
    for (let i = 0; i < container.childNodes.length; i++) {
        if (container.childNodes[i].id !== undefined) {
            //console.log(container.childNodes[i].id);
            if (container.childNodes[i].id != "img-holder") {
                fade_in(`#${container.childNodes[i].id}`, 1500, 500);                            
            } else {
                for (let ii = 0; ii < container.childNodes[i].children.length; ii++) {                    
                    //console.log(container.childNodes[i].children[ii].id);                    
                    if(container.childNodes[i].children[ii].id != "graph_slot") {
                        fade_in(`#${container.childNodes[i].children[ii].id}`, 1500, 500);
                    }
                }                
            }            
        }        
        
    }
    
}

function LoadJsonFile(language) {
    //console.log(language);
    var JRequest = new XMLHttpRequest();
    JRequest.open(
        "GET",
        "./json/" + language + ".json"
    );

    JRequest.onload = function() {
        if(JRequest.status >= 200 && JRequest.status < 400){
            var JData = JSON.parse(JRequest.responseText);
            //console.log(JData);
            renderHTML(JData);
        } else {
            console.log("We connected to the server but it returned an error.");
        }
    };

    JRequest.onerror = function() {
        console.log("Connection error.");
    };

    JRequest.send();
    json_counter ++;
    if(json_counter >= languages.length){
        json_counter = 0;
    }
}