var id = '';
var gid = '0';
var json = {}

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    if(getSheetID()){
        loadData()
    } else {
        //loadData()
    }
});

function getSheetID() {
    var scripts = document.getElementsByTagName('script');
    var script = scripts.namedItem("gsheetcms");

    if(script) {
        id = script.getAttribute('data-gsheet');
        return true;
    }
    return false  
}

function loadData() {
    if (id) {
        const url = 'https://docs.google.com/spreadsheets/d/' + id + '/gviz/tq?tqx=out:json&tq&gid=' + gid;
        fetch(url)
            .then(response => response.text())
            .then(data => {
                json = JSON.parse(data.slice(47, -2));
                setCMSData(json);
            });
    }
}

function setCMSData(json){
    elements = document.querySelectorAll('[data-gsheetcms]');
   
    elements.forEach(element => {
        if(element.dataset.gsheetcms){
            
            let dataLocation = element.dataset.gsheetcms.split(',');
            dataLocation[0] = parseInt(dataLocation[0]);
            dataLocation[1] = parseInt(dataLocation[1]);

            setElementData(element, json.table.rows[dataLocation[0]].c[dataLocation[1]], dataLocation[2])
        }
    });
}

function setElementData(element, value, type) {
    switch(type){
        case 'text': element.innerHTML = value.v; break;
        case 'image-link': element.src = value.v; break;
        default: element.innerHTML = value.v;
    }
}
