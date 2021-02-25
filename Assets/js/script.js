// Global Variables
var tvShows = ['game of thrones', 'the simpsons', 'the sopranos'];


// Helper Set Attributes function
function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

//Helper Remove all child nodes
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

//Get gifs and display
  async function showEventHandler(show){
    try{
        const url = 'https://api.giphy.com/v1/gifs/search?q=' + show + '&api_key=KTfvK3vSyQMXeNShXEKmsGQEoMZ1mbvE&limit=10';
        const res = await axios.get(url)
        let results = res.data.data;
        const gifsContainter = document.getElementById('gifsHere')

                for (var i = 0; i < results.length; i++) {
                    let gifDiv = document.createElement("div");
                    // gifDiv.classList.add('col-md-6 mb-2')
                
                    let rating = results[i].rating;

                    let p = document.createElement('p') 
                    p.innerText = `Rating: ${rating}`;

                    let showImage = document.createElement('img')
                    let imgAttr = {
                        "src": results[i].images.fixed_height_still.url,
                        "data-still": results[i].images.fixed_height_still.url,
                        "data-animate": results[i].images.fixed_height.url,
                        "data-state": "still",
                        "dragable": true,
                        "ondragstart": 'drag(event)',
                        'id': results[i].id
                    }
                    setAttributes(showImage, imgAttr )

                    showImage.classList.add("gif")

                    gifDiv.prepend(showImage);
                    gifDiv.prepend(p);

                    gifsContainter.prepend(gifDiv);
                }

    }catch (e){
        console.log(e)
    }
  }

// create buttons for each item in the array
    function renderButtons() {
        const btnContainer = document.getElementById('buttons')
        //Helper Function
        removeAllChildNodes(btnContainer)
        for (let index = 0; index < tvShows.length; index++) {
            const newBtn = document.createElement("button" , 'btn-primary')
            newBtn.classList.add('buttoneSearch')
            newBtn.setAttribute('data-show', tvShows[index])
            newBtn.innerText = tvShows[index]
            newBtn.addEventListener('click', function(){showEventHandler(tvShows[index])} )
            btnContainer.appendChild(newBtn);
        }
    };



    function renderTextAreaAndBtns(){
    //Div container for attaching text area and button
    const inputDiv = document.getElementById('inputDiv')

    // text area for the input received bu the user
    const submitTextArea = document.createElement('input')
    setAttributes(submitTextArea, {'id' : 'add-tvshow', 'type' : 'text', 'placeholder' : 'Add Tv Show'})

    //Button for adding tv shows
    const addButton = document.createElement('button')
    addButton.innerText = 'Add Button'
    setAttributes(addButton, {'type' : 'submit', 'id':'submitBtn'})
    addButton.addEventListener('click', addNewShow)

    inputDiv.appendChild(submitTextArea)
    inputDiv.appendChild(addButton)
    };

    //Add new show to the list event
    function addNewShow(event){
        event.preventDefault();
        const inputArea = document.getElementById('add-tvshow')
        const inputValue = inputArea.value
        tvShows.push(inputValue)
        inputArea.value = ''
        renderButtons()
    }

    // remove items from favorites
    function removeOnDblClick(e){
        e.target.remove()
    }
    
    //Event listeners for gifs
    const containters = ['gifsHere', 'favorites']
    containters.forEach(container => {
       const element = document.getElementById(container);
       //Event for one click to to change state
       element.addEventListener('click', function(e){
           const element = e.target
           const state = element.getAttribute('data-state')

           if (state === "still") {
               const dataAnimate = element.getAttribute('data-animate')
               element.setAttribute('src', dataAnimate)
               element.setAttribute('data-state', 'animate')
            } else {
            const dataStill = element.getAttribute('data-still')
            element.setAttribute('src', dataStill)
            element.setAttribute('data-state', 'still')
        }
       });

       //Event dbl click to remove
       element.addEventListener('dblclick', function(e){removeOnDblClick(e)})
    })

    // Dragable gifs to choose favorites
    function allowDrop(allowdropevent) {
        allowdropevent.preventDefault();
    }
    
    function drag(dragevent) {
        dragevent.dataTransfer.setData("url", dragevent.target.dataset.still);
        dragevent.dataTransfer.setData("urlanimate", dragevent.target.dataset.animate);
    }
    
    function drop(dropevent) {
        dropevent.preventDefault();
        const url = dropevent.dataTransfer.getData("url");
        const urlanimate = dropevent.dataTransfer.getData("urlanimate");
        const newGif = document.createElement('img')
        
        const attrs = {
            "src": url,
            "data-still": url,
            "data-animate": urlanimate,
            "data-state": "still",
        }

        setAttributes(newGif, attrs)
        newGif.classList.add('gif', 'gifFav')

        const favContainter = document.getElementById('favorites')
        favContainter.append(newGif)
    }

    //Onload
    window.onload = function() {
        renderButtons();
        renderTextAreaAndBtns()
      };