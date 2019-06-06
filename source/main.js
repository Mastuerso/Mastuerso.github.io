var swap_language = document.getElementById("swap-language");
var container = document.getElementById("resume");
var languages = ["english", "spanish"];
var json_counter = 0;

LoadJsonFile(languages[json_counter]);

swap_language.addEventListener("click", function () {
    LoadJsonFile(languages[json_counter]);
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
        <article>
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
    swap_language.innerHTML = languages[json_counter];
    //console.log(data["Main-Title"]);
    container.innerHTML = `
    <h1>${data["Main-Title"]}</h1>
    <img id="mugshot" src="assets/${data.Mugshot}" alt="">
    <section id="id-card">
        <h2>${data.Name}</h2>
        <p>${data.Contact.Birthday}</p>
        <p>${data.Contact.Address}</p>
        <p>${data.Contact.Email}</p>
        <p>${data.Contact.Website}</p>
        <p>${data.Contact.Repository}</p>
    </section>
    <img id="spider-chart" src="assets/${data.Graph}" alt="">
    ${articles_template(data.Articles)}
    `;
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