window.onload = function (){
    if (location.pathname === "/items/create") {
        setTimeout(() => {
            init();
        }, 2500);
    }

    document.head.appendChild(document.createElement('script')).text = '(' +
    function() {
        var _pushState = history.pushState;
        history.pushState = function(state, title, url) {
            _pushState.call(this, state, title, url);
            window.dispatchEvent(new CustomEvent('state-changed', {detail: url}));
        };
    } + ')();';

    window.addEventListener('state-changed', function(e) {
        if (e.detail === "/items/create") {
            setTimeout(() => {
                init();
            }, 2500);
        }
    });
}

function init () {
    var filteredCats = [];
    var cats = [];

    var siteID = document.querySelector("[name='site_id']")

    siteID.addEventListener("input", function (e) {
        var value = e.target.value;
        fetchShit(value);
    });

    fetchShit("MLA");

    function fetchShit(value) {
        fetch(chrome.runtime.getURL(value.toUpperCase() + '.json')).then(resp => {
            return resp.json();
        }).then(json => {
            cats = json;
    
            var category = document.querySelector('[name="category"]');
            category.addEventListener("input", function (evt) {
                var value = evt.target.value;
    
                filteredCats = cats.filter(cat => cat.name.toLowerCase().indexOf(value.toString().toLowerCase()) >= 0);
                if (value.length) {
                    optList.innerHTML = generateOpts(filteredCats);
                    optList.style.display = "block";
                } else {
                    optList.style.display = "none";
                    optList.innerHTML = "";
                }
                
            });
    
            document.addEventListener("click", function (evt) {
                if (evt.target.classList.contains("optlistoption")) {
                    var catid = evt.target.getAttribute("data-id");
                    const inputEvent = new Event('input', {bubbles: true});
                    category.value = catid;
                    category.dispatchEvent(inputEvent);
                    optList.style.display = "none";
                }
            })
    
            var optList = document.createElement("div");
            optList.className = "optlist";
            document.body.appendChild(optList)
            optList.style.top = getOffsetTopToParent(category) + category.offsetHeight + 1 + "px";
            optList.style.left = getOffsetLeftToParent(category) + "px";
        });    
    }
    
    function getOffsetTopToParent( elem ) {
        var offsetTop = 0;
        do {
        if ( !isNaN( elem.offsetTop ) )
        {
            offsetTop += elem.offsetTop;
        }
        } while( elem = elem.offsetParent );
        return offsetTop;
    }

    function getOffsetLeftToParent( elem ) {
        var offsetLeft = 0;
        do {
        if ( !isNaN( elem.offsetLeft ) )
        {
            offsetLeft += elem.offsetLeft;
        }
        } while( elem = elem.offsetParent );
        return offsetLeft;
    }

    function generateOpts(opts) {
        return opts.reduce((prev, element) => {
            return prev + "<div class='optlistoption' data-id='" + element.id + "'>" + element.name + "</div>";
        }, "");
    }
}