'use strict'

const input = document.getElementById('fileinput');
const label = input.nextElementSibling;

function createTable(tableData) {
    const table = document.createElement('table');
    table.setAttribute('align', 'center');
    const tableBody = document.createElement('tbody');

    tableData.forEach(function (rowData) {
        const row = document.createElement('tr');

        rowData.forEach(function (cellData) {
            const cell = document.createElement('td');
            if (cellData !== 'Blank')
                cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);
    document.body.appendChild(table);
}

const modal = document.getElementById('select_track');
const close = document.getElementsByClassName("close")[0];

$("#file-form").submit((e) => {
    $('#cover-spin').show(0)
});


function getBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        displayTracks(MidiParser.parse(reader.result));
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

function expand_tracks(file) {
    getBase64(file)
}

function displayTracks(midiObj) {
    const buttonList = $('#button-list')[0];
    buttonList.innerHTML = '';

    const trackNames = [];
    let trackNo = 0;
    midiObj.track.forEach((track) => {
        track['event'].forEach((event) => {
            if (event.hasOwnProperty('metaType')) {
                if (event['metaType'] == '3') {
                    trackNames.push(trackNo + " " + event['data']);
                    trackNo++;
                }
            }
        })
    });

    trackNames.forEach(trackName => {
        if (/^\d$/.test(trackName.trim()))
            return;

        const para = document.createElement('p');
        const radio = document.createElement('input');

        radio.setAttribute('value', trackName);
        radio.setAttribute('type', 'radio');
        radio.setAttribute('class', 'track-button');
        radio.setAttribute('name', 'track-button');
        radio.setAttribute('id', trackName);

        const label = document.createElement('label');
        label.setAttribute('for', trackName);
        label.setAttribute('class', 'track-label')

        label.innerText = trackName;
        para.appendChild(radio);
        para.appendChild(label);
        para.appendChild(document.createElement('br'));

        buttonList.appendChild(para);
    });

    $('#button-list > p:first-child input + label').addClass('selected-track');

    setFormEvents();
}

function setFormEvents() {
    const trackButtons = $('input[name="track-button"]');
    trackButtons.each(function (index, button) {

        $(button).on('click', function(e) {
            $(this).trigger('check');
            trackButtons.not($(this)).trigger('uncheck');
        });

        $(button).on('check', function(e) {
            $(this).next().addClass('selected-track');
        });

        $(button).on('uncheck', function(e) {
            $(this).next().removeClass('selected-track');
        });
    });

    $('input.submit').on('click', function(e) {
        e.preventDefault();
        analyzeMidi();
    });
}

function analyzeMidi() {
    fetch('analyze/').then(response => {
        return response.json();
    }).then(json => {
        console.log(json);
    }).catch(error => {
        console.log(error)
    });
}


$('#fileinput').on('change', function (e) {
    if (this.files) {
        $("#not-midi-warning")[0].style.visibility = 'hidden';
        const filename = this.files[0].name;
        if (filename.substring(filename.length - 4, filename.length) === '.mid') {
            label.children.text.innerHTML = filename;
            label.setAttribute('style', 'background-color: red;');
            $('#fileinput').trigger('valid');
            getBase64(this.files[0]);
        } else {
            $("#not-midi-warning")[0].style.visibility = 'visible';
            $('#fileinput').trigger('invalid');
        }
        this.blur();
    }
});

$('#fileinput').on('valid', (e) => {
    $('#button-list')[0].style.display = 'block';
    $('#file-submit')[0].style.display = 'inline';
});

$('#fileinput').on('invalid', (e) => {
    shake($('#label-file')[0]);
});


const shake = ((e, distance = 10, duration = 500) => {
    // shake element e left and right.
    const originalStyle = e.style.cssText;
    e.style.position = "relative";
    const startTime = (new Date()).getTime();

    const animateIt = (() => {
        const now = (new Date()).getTime();
        const elapsedTime = now - startTime;
        const fraction = elapsedTime / duration;

        if (fraction < 1) {
            let x = distance * Math.sin(fraction * 4 * Math.PI);
            e.style.left = x + "px";
            setTimeout(animateIt, Math.min(25, duration - elapsedTime));
        } else {
            e.style.cssText = originalStyle;
        }
    });

    animateIt();

});