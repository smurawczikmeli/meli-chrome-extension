window.onload = function () {

    fetchTableIds();

    function fetchTableIds() {
        let tds = [[], []];
        let tdInterval = setInterval(() => {
            let allEmpty = tds.every(td => { return td.length === 0 });
            if (allEmpty) {
                tds = getTds();
            } else {
                saveData(tds);
                clearInterval(tdInterval);
            }
        }, 1500);
    }

    function saveData(tds) {
        let users = [];
        tds[0].forEach((td, index) => {
            users.push({id: tds[0][index].innerHTML, siteId: tds[1][index].innerHTML});
        });

        chrome.storage.sync.set({'users': users}, function() {
            // alert("user ids saved " + JSON.stringify(users));
        });
    }

    function getTds() {
        return [document.querySelectorAll("table td:first-child"), document.querySelectorAll("table td:nth-child(5)")]
    }
}