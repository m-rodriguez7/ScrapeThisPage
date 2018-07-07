// at the top of the page, a button to scrape a page for more articles.
// the newest articles will show at the top.
$("#scrape").on("click", event => {
    event.preventDefault();
    console.log("scrape button");
    $.get("/scrape", data => {
        console.log(data);
    })

    // grab json articles
    $.getJSON("/stories", data => {
        for (i in data) {
            let {_id, title, link, sub} = data[i];
            
            /* console.log(data[i]);
            console.log(title); */
            
            // prepend articles so they show up by most recent
            $("#stories").prepend(`
                <div class="notebody">
                <h2 data-id=${_id}>${title}</h2>
                <p>${link}</p>
                <p>${sub}</p>
                </div>
            `)
        };

    

        // Bring up form to insert note based on article.
        $("h2").on('click', function () {// alpha notation was NOT passing the "this" object as i expected
            console.log('h2 clicked');
            $("#notesform").empty();
            let thisId = $(this).attr("data-id");
            console.log(thisId);

            // first add a form to add a note in the appropriate location
            $("#notesform").append(`
                <h3>Add a note!</h3>
                <div class="form-group">
                    <label for="title">Note Title</label>
                    <input type="text" class="form-control" id="titleinput">
                </div>
                <div class="form-group">
                    <label for="Note">Note</label>
                    <textarea class="form-control" rows="5" id="bodyinput"></textarea>
                </div> 
                <button data-id="${thisId}" class='btn btn-large btn-success' id='savenote'>Save Note</button>
                `)
            // code to save note to mongodb
            $("#savenote").on("click", function(event) {
                event.preventDefault();
                console.log("savenote clicked");
                let thisId = $(this).attr("data-id"); // the id is stored in the "savenote" button
                $.ajax({
                    method: "POST",
                    url: "/articles/" + thisId,
                    //url: "/articles/" + this.attr("data-id")
                    data: {
                        // Value taken from title input
                        title: $("#titleinput").val(),
                        // Value taken from note textarea
                        body: $("#bodyinput").val()
                        }
                    })
                        // With that done
                        .then(function(data) {
                        // Log the response
                        console.log(data);
                        });
                    
                    // Also, remove the values entered in the input and textarea for note entry
                    $("#titleinput").val("");
                    $("#bodyinput").val("");
                    alert("comment saved!. click the article again to see the change.");
            });

            // then, populate the page with any previous notes by OTHER people
            $.getJSON("/allarticles/" + thisId, data => {
                // empty notes from previously clicked article
                $("#notes").empty();
                // data is an object of length one
                // BUT, NOTES will have an array of many notes
                // in these notes there will be titles and text bodies
                console.log(data);
                let notes = data.note;
                console.log(notes);
                for (i in notes) {
                    let {_id, title, body} = notes[i];
                    $("#notes").prepend(`
                        <div class='notebody'>
                        <h3>${title}</h3>
                        <p>${body}</p>
                        <button data-id= "${_id}" class='btn btn-large btn-danger delete'>DELETE</button>
                        </div>
                    `);

                    // this code only worked on all delete buttons if it was IN THIS LOOP.
                    // backtick templating is weird man
                    
                };

                $(".delete").on("click", function () {
                    let thisId = $(this).attr("data-id");
                    console.log(thisId);
                    console.log("delete button clicked!");
                    $.ajax({
                        method: "DELETE",
                        url: "/delete/" + thisId
                    }).then(data => {
                        console.log(data);
                    });
                    alert("comment deleted. click the article again to see the change.");
                })
            });

        });

    });

});