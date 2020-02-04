$(document).ready(() => {

    function getTimeDiff(nowTime, commentTime) {
        let timeDiff = nowTime - commentTime;

        let seconds = (timeDiff / 1000).toFixed(0);
        let minutes = (timeDiff / (1000 * 60)).toFixed(0);
        let hours = (timeDiff / (1000 * 60 * 60)).toFixed(0);
        let days = (timeDiff / (1000 * 60 * 60 * 24)).toFixed(0);

        if (seconds < 60) {
            return `${seconds}s left`;
        } else if (minutes < 60) {
            return `${minutes}m left`;
        } else if (hours < 24) {
            return `${hours}h left`;
        } else {
            return `${days}d left`;
        }

    }

    loadBets();

    var siteMenu = document.getElementById("sitenameMenu");
    var yearMenu = document.getElementById("yearMenu");
    var submitButton = document.getElementById("submitButton");
    var resDiv = document.getElementById("resDiv");
    var dateBox = document.getElementById("dateBox")

    function loadDirectoryForm(sitename) {
        var directory = document.getElementById("directoryDiv");
        switch (sitename) {
            case 'BBC':
                console.log("chose BBC");
                directory.innerHTML = `<div class="form-group text-center">
            <select class="form-control text-center" id="directoryMenu" style="width:40%">
                <option>all</option>
                <option>world</option>
                <option>uk</option>
                <option>business</option>
                <option>politics</option>
                <option>health</option>
                <option>education</option>
                <option>science_and_environment</option>
                <option>technology</option>
                <option>entertainment_and_arts</option>
                <option>world/africa</option>
                <option>world/asia</option>
                <option>world/europe</option>
                <option>world/latin_america</option>
                <option>world/middle_east</option>
                <option>world/us_and_canada</option>
                <option>england</option>
                <option>northern_ireland</option>
                <option>wales</option>
            </select>
            </div>`;
                break;
            case 'CNN':
                console.log("chose CNN");
                directory.innerHTML = `<div class="form-group text-center">
            <select class="form-control text-center" id="directoryMenu" style="width:40%">
                <option>all</option>
                <option>edition_world</option>
                <option>edition_africa</option>
                <option>edition_americas</option>
                <option>edition_asia</option>
                <option>edition_europe</option>
                <option>edition_space</option>
                <option>edition_us</option>
                <option>edition_money_news_international</option>
                <option>edition_technology</option>
                <option>edition_entertainment</option>
                <option>edition_sport</option>
                <option>edition_football</option>
                <option>edition_golf</option>
                <option>edition_motorsport</option>
                <option>edition_tennis</option>
            </select>
            </div>`;
                break;
            case 'RT':
                console.log("chose RT");
                directory.innerHTML = `<div class="form-group text-center">
            <select class="form-control text-center" id="directoryMenu" style="width:40%">
                <option>all</option>    
                <option>news</option>
                <option>usa</option>
                <option>uk</option>
                <option>sport</option>
                <option>russia</option>
                <option>business</option>
            </select>
            </div>`;
                break;
            case 'Guardian':
                console.log("chose guardian");
                directory.innerHTML = `<div class="form-group text-center">
            <select class="form-control text-center" id="directoryMenu" style="width:40%">
                <option>all</option>
            </select>
            </div>`;
                break;
            default:
                console.log("default case");
                break;
        }
    }

    function loadMonthsFrom(year) {
        var months = document.getElementById("monthsDiv");
        switch (year) {
            case '2020':
                months.innerHTML = `<div class="form-group text-center">
            <select class="form-control text-center" id="monthMenu" style="width:40%">
                <option>1</option>
            </select>
            </div>`;
                break;
            case '2019':
                months.innerHTML = `<div class="form-group text-center">
            <select class="form-control text-center" id="monthMenu" style="width:40%">
                <option>12</option>
            </select>
            </div>`;
                break;
            default:
                console.log("Shouldn't see this");
                break;
        }
    }

    function loadCard(res, search) {
        resDiv.innerHTML += `<div class="card" id="${res.body._id}">
        <h5 class="card-header pt-1 pb-1">${search.site} - ${search.dir}</h5>
        <div class="card-body">
          <p class="card-text">[${search.month}/${search.year}]</p>
          <p class="card-text">${res.body.for} for ${res.body.against} against</p>

          <a href="#" class="btn btn-info ${res.body._id}}">Bet for</a> <a href="" class="btn btn-info ${res.body._id}"> Bet against</a>
        </div>
      </div>`;
    }

    function loadBets() {
        $.ajax({
            url: '/getArticleBets',
            type: 'GET',
            success: (data) => {
                console.log(data);
                const currTime = new Date();


                for (let i  = 0; i < data.length; i++) {
                    resDiv.innerHTML += `<div class="card mt-2" id="${data[i]._id}">
        <h5 class="card-header pt-1 pb-1">${data[i].title}</h5>
        <div class="card-body">
          <p class="card-text">${data[i].subtext}</p>
          <p class="card-text">${data[i].for} for ${data[i].against} against</p>
          <p class="card-text"> ${getTimeDiff(data[i].ends,currTime)} </p>
          <button class="btn btn-info betButton" id="${data[i]._id}">Bet for</a> <button class="btn btn-info betButton" id="${data[i]._id}"> Bet against</a>
        </div>
      </div>`;
                }

            },
            error: (jqXHR) => {
                console.log(jqXHR.responseJSON);
            }
        })
    }

    siteMenu.addEventListener("click", (event) => {
        console.log(siteMenu.options[siteMenu.selectedIndex].value);

        loadDirectoryForm(siteMenu.options[siteMenu.selectedIndex].value);
    });

    yearMenu.addEventListener("click", (event) => {
        loadMonthsFrom(yearMenu.options[yearMenu.selectedIndex].value)
    });

    $('#submitButton').on("click", (event) => {
        event.preventDefault();

        console.log(siteMenu.options[siteMenu.selectedIndex].value, directoryMenu.options[directoryMenu.selectedIndex].value);
        console.log(yearMenu.options[yearMenu.selectedIndex].value, monthMenu.options[monthMenu.selectedIndex].value);
        console.log($('#searchTermBox').val())
        const site = siteMenu.options[siteMenu.selectedIndex].value;
        const dir = directoryMenu.options[directoryMenu.selectedIndex].value;
        const year = yearMenu.options[yearMenu.selectedIndex].value;
        const month = monthMenu.options[monthMenu.selectedIndex].value;
        const date = dateBox.value;

        console.log(`Date: ${date}`);

        $.ajax({
            type: 'POST',
            url: '/createArticleBet',
            dataType: 'json',
            data: {
                "betType": "article",
                "sitename": site,
                "directory": dir,
                "month": month,
                "year": year,
                "searchTerm": $('#searchTermBox').val(),
                "ends": date
            },
            success: function(response) {
                console.log(`The response: ${JSON.stringify(response)}`);
                let searchObj = { site, dir, year, month }
                loadCard(response, searchObj);
                // swal({
                //     icon: 'success',
                //     title: 'Response',
                //     text: token.body
                // })

            },
            error: function(jqXHR, textStatus, errorThrown) {
                // console.log(jqXHR.responseJSON.body);
                // swal("Oops", jqXHR.responseJSON.body, 'Not GOOD!');
                swal({
                    icon: 'error',
                    title: 'Oops...',
                    text: jqXHR.responseJSON.body
                });
            }
        });
    });
});


$(document).on("click", ".betButton", function(e) {
    console.log('from: ', e.target.id);
    
    $.ajax({
        type: 'POST',
        url: '/updateOdds',
        data: {
            "side":"for",
            "id":e.target.id,
            "type":"increment"
        },
        success: (response) => {
            console.log(response);
        },
        error: (err) => {
            console.log('err');
        }
    })
	
});