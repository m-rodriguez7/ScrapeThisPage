$("#scrape").on("click", event => {
    event.preventDefault();
    console.log("scrape button");
    $.get("/scrape", data => {
        console.log(data);
    })
    // insert code to populate page with notes

});

$("#addNote").on("click", event => {
    event.preventDefault();
    console.log("note button clicked");
    // code to bring up a form
})

// grab json articles
$.getJSON("/stories", data => {
    for (i in data) {
        let {title, link, sub} = data[i];
        console.log(data[i]);
        console.log(title);
        $("#stories").append(`
            <h2>${title}</h2>
            <p>${link}</p>
            <p>${sub}</p>
        `)
    }
})