
var id = '';
var gid = '0';
var json = {}
var integrationScript = ''

function getSheetID() {
    const gSheetURL = document.getElementById("gSheetURL").value;
    if (gSheetURL) {
        const capturedId = gSheetURL.match(/\/d\/(.+)\//)
        id = capturedId[1];
        loadData(id, gid);
        showConnectionScript(id);
    } else {
        alert('Please add a valid Google Sheet URL');
    }

}

function loadData() {
    if (id) {
        const url = 'https://docs.google.com/spreadsheets/d/' + id + '/gviz/tq?tqx=out:json&tq&gid=' + gid;
        fetch(url)
            .then(response => response.text())
            .then(data => document.getElementById("json").innerHTML = myItems(data.slice(47, -2))
            );
    }
}

function myItems(jsonString) {
    json = JSON.parse(jsonString);
    var table = `<table class="items-center bg-transparent w-full border-collapse ">
                    <thead>
                        <tr>`;

    table += '<th class="w-24 px-6 bg-p-truegray-50 text-p-truegray-500 align-middle border  py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">'
        + '' + //leave empty
        '</th>'

    json.table.cols.forEach(
        colonne => {
             table += '<th class="px-6 bg-p-truegray-50 text-p-truegray-500 align-middle border  py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">'
            + colonne.id +
            '</th>';})
    table += `
                        </tr>
                    </thead>
                    <tbody>
  `;


    json.table.rows.forEach((line, i) => {

        table += '<tr>'
        table += '<th class="w-24 border-t-0 px-6 align-middle bg-p-truegray-50 border text-xs whitespace-nowrap p-2">'
            + i +
            '</th>'
        line.c.forEach((cell, j) => {
            try { var value = cell.f ? cell.f : cell.v }
            catch (e) { var value = '' }

            table += `
                <td onclick="setCellPosition(${i}, ${j})" class="max-w-xs overflow-hidden border-t-0 px-6 align-middle border text-sm whitespace-nowrap p-2 cursor-pointer hover:shadow-md">
                ${(value ? htmlEscape(value) : ' ')}
                </td>`;
        })
        table += '</tr>'
    }
    )
    table += '</tbody></table>'
    return table
}

function setCellPosition(rowNo, cellNo) {
    if(json){
        const value = json.table.rows[rowNo].c[cellNo];
        if(value){
            document.getElementById('selectedCellDetails').innerHTML =`
You clicked on Position <b> [ ${json.table.cols[cellNo].id} ${rowNo} ] </b>

4. Set <span class="p-2 bg-p-gray-100 rounded-md mx-1 whitespace-nowrap"> data-gsheetcms="${rowNo}, ${cellNo}, text"</span>  <button onclick="copyAttributeToClipboard(${rowNo}, ${cellNo}, 'text')" pazly-editable="innerHTML bg" target="_blank" class="rounded-md inline-flex items-center p-2 focus:outline-none text-base my-2 whitespace-pre-line text-p-white bg-p-purple-700"><i class="fas fa-copy mx-1"></i></button>
on your website element that will show 

<div class="px-2 py-3 bg-p-gray-100 rounded-md"> ${value.v}</div>
            `;
        } 
    }
    
}

function showConnectionScript(id) {
    if (id) {
        integrationScript = `<script id="gsheetcms" data-gsheet="${id}" src="https://pazly.dev/gsheetcms/gsheetcms-runtime.js?v=${new Date().getTime()}"></script>`;
        document.getElementById('scriptTag').innerHTML = htmlEscape(integrationScript);
    }
}

function htmlEscape(str) {
    return str.replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function copyIntegartionsScriptToClipboard(){
    if(integrationScript) {
        navigator.clipboard.writeText(integrationScript);
    }
}

function copyAttributeToClipboard(row, col, type){
    console.log('test');
    navigator.clipboard.writeText(`data-gsheetcms="${row}, ${col}, ${type}"`);
    
}