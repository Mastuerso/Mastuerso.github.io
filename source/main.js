var jRequest = new XMLHttpRequest();
jRequest.open('GET', 'source/english.json');
jRequest.onload = function () {
    var resumeData = JSON.parse(jRequest.responseText);
    buildPage(resumeData);
};
jRequest.send()

function buildPage(data) {
    let Title = data.Title;
    let Name = data.Name;
    let Mugshot = data.Mugshot;
    let Graph = data.Graph;
    //Contact Data
    let contactCard = `
    ${data.Contact.birthday} <br>
    ${data.Contact.address} <br>
    ${data.Contact.email} <br>
    ${data.Contact.website} <br>
    ${data.Contact.repo}
    `;
    //==============Content==============
    //"Objective", "Languages", "Education", "TechSummary", "Experience", "OngoingProject"
    let Transcript = data.Transcript;
    let Topics = new Map();
    //==============Objective==============
    let objText = data.Topics.Objective;
    //console.log(objText);
    Topics.set("Objective", objText);    
    //==============Languages==============
    let langText = data.Topics.Languages;
    //console.log(langText);
    Topics.set("Languages", langText);    
    //==============Education==============
    let Education = data.Topics.Education;    
    //displayVals(Education);
    let eduText = "";
    for (let i = 0; i < Education.length; i++) {
        eduText += `
        <b>${Education[i].Career}</b> @ ${Education[i].School} (${Education[i].TimeLapse}) <br>
        `;
    }
    //console.log(eduText);
    Topics.set("Education", eduText);
    //==============Technology Summary==============
    let techSummary = data.Topics.TechSummary;
    //displayVals(techSummary);
    let techTetx = `
    <b>${Transcript.ProgrammingLanguages}:</b><br>
    ${data.Topics.TechSummary.ProgrammingLanguages}<br>
    <b>${Transcript.DesignSoftware}:</b><br>
    ${data.Topics.TechSummary.DesignSoftware}<br>
    <b>${Transcript.IDETools}:</b><br>
    ${data.Topics.TechSummary.IDETools}<br>
    <b>${Transcript.Systems}:</b><br>
    ${data.Topics.TechSummary.Systems}<br>
    <b>${Transcript.Complementary}:</b><br>
    ${data.Topics.TechSummary.Complementary}<br>
    `;
    //console.log(techTetx);
    Topics.set("TechSummary", techTetx);
    //==============Experience==============
    let Experience = data.Topics.Experience;
    //displayVals(Experience);
    let expText = "";
    for (let i = 0; i < Experience.length; i++) {
        if (Experience[i].Company === "") {
            expText += `
            <b>${Experience[i].TimeLapse} ${Experience[i].Job}</b><br>
            `;
        } else {
            expText += `
            <b>${Experience[i].TimeLapse} ${Experience[i].Job} @ ${Experience[i].Company}</b><br>
            `;
        }
        expText += ` ${Experience[i].Description}<br>
        `;
    }
    //console.log(expText);
    Topics.set("Experience", expText);
    //==============Ongoing Project==============
    let OngoingProject = data.Topics.OngoingProject;
    //displayVals(Project);
    let projText = `
    <b>${OngoingProject.Task}</b><br>
    ${OngoingProject.Motivation}
    `;
    //console.log(projText);
    Topics.set("OngoingProject", projText);
    //console.log(Topics);
    //==============Building the website==============
    document.getElementsByClassName("header")[0].textContent = Title;
    document.getElementsByClassName("name")[0].textContent = Name;
    document.getElementsByClassName("mugshot")[0].innerHTML = `
    <img src = "assets/${Mugshot}"></img>`;
    let contactDiv = document.getElementsByClassName("contact");
    for (let index = 0; index < contactDiv.length; index++) {
        contactDiv[index].innerHTML = contactCard;
    }
    document.getElementsByClassName("spider")[0].innerHTML = `<img src = "assets/${Graph}"></img>`;
    let Content = document.getElementsByClassName("content")[0];
    Content.innerHTML = "";
    for (var [key, value] of Topics) {
        //console.log(Transcript[key]);
        //console.log(key + ' = ' + value);
        Content.innerHTML += `
        <div class="topic">
            <div class="title">${Transcript[key]}</div>
            <div class="text">${value}</div>
        </div>
        `;         
      }
}

function getKeys(container) {
    let counter = Object.keys(container).length;
    let keysArray = [];
    for (let i = 0; i < counter; i++) {
        let key = Object.keys(container)[i];
        //console.log("Key: " + key);
        keysArray[i] = key;
    }
    return keysArray;
}

function getVals(container, keys) {
    let vals = [];
    for (let i = 0; i < keys.length; i++) {
        let key = "" + keys[i];
        //console.log(key);
        vals[i] = container[key];
        //console.log(container[key]);
    }
    return vals;
}

function displayVals(container, name = "") {
    let parent = name;
    let keys = getKeys(container);
    let vals = getVals(container, keys);
    for (let i = 0; i < keys.length; i++) {
        if (typeof vals[i] === 'object') {
            if (parent === "") {
                console.log("===" + keys[i] + "===");
            } else {
                console.log("===" + parent + "." + keys[i] + "===");
            }
            displayVals(vals[i], keys[i]);
        } else {
            console.log(keys[i] + ": " + vals[i]);
        }

    }

}