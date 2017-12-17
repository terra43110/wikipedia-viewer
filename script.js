"use strict";

$(document).ready( function() {
    view.init();
});

let model = {
    // buttons
    btnSearchTopic: document.getElementById('btn-search-topic'),

    // bootstrap classes
    class_a: 'list-group-item',
    class_h4: 'list-group-item-heading',
    class_p: 'list-group-item-text',

    // HTML elements
    inputTopic: document.getElementById('input-topic'),
    searchResults: document.getElementById('search-results'),

    // text nodes
    resultTitle: document.createTextNode(''),
    resultBody: document.createTextNode(''),
    resultLink: document.createTextNode('')
};

let view = {
    init() {
        view.setupEventListeners();
    },
    setupEventListeners() {
        model.btnSearchTopic.addEventListener('click', function(event) {
            if (model.inputTopic.value !== '') {
                handlers.getWiki(event);
            }
            // TODO: else statement for conditional, when <input> value is left blank
        });
    }
};

let handlers = {
    clear() {
        document.getElementById('search-results').innerHTML = '';
    },

    getWiki(event) {
        event.preventDefault();
        handlers.clear();

        return new Promise( function(resolve, reject) {
            const searchValue = model.inputTopic.value;
            const urlPrefix = "https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?action=opensearch&search=";
            const urlSuffix = "&format=json";
            const url = urlPrefix + searchValue + urlSuffix;

            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.addEventListener('readystatechange', () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);

                    for (let i = 0; i < 10; i++) {
                        model.resultTitle = data[1][i];
                        model.resultBody = data[2][i];
                        model.resultLink = data[3][i];

                        handlers.createListItem();
                    }

                    resolve();
                }
                else if (xhr.status === 404  ||  xhr.status === 500) {
                    reject(xhr.status);
                }
            });

            xhr.send(null);
        });
    },

    createListItem(title, body, link) {
        let h4, p, a;

        h4 = document.createElement('h4');
        h4.textContent = model.resultTitle;

        p = document.createElement('p');
        p.textContent = model.resultBody;

        a = document.createElement('a');
        a.appendChild(h4);
        a.appendChild(p);

        h4.className = model.class_h4;
        p.className = model.class_p;
        a.className = model.class_a;

        a.setAttribute('href', model.resultLink);
        a.setAttribute('target', '_blank');

        model.searchResults.appendChild(a);
    }
};
