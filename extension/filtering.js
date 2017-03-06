/* Shamelessly stolen from Max */

function saveToLocalStorage(key, ...value) {
    const values = JSON.parse(localStorage.getItem(key)) || [];

    localStorage.setItem(key, JSON.stringify(values.concat(value)));
}

function removeFromLocalStorage(key, value) {
    const values = JSON.parse(localStorage.getItem(key));
    const index = values.indexOf(value);

    values.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(values));
}

function toggleMark(listItem, className, char) {
    const mark = listItem.getElementsByClassName(className)[0] ||
        listItem.parentElement.getElementsByClassName(className)[0] ||
        listItem.parentElement.parentElement.getElementsByClassName(className)[0];

    mark.textContent = mark.textContent ? '' : char;
}

function addMarks(items, className, char) {
    items.forEach(i => {
        Array.from(document.getElementsByClassName(className)).forEach(a => {
            if (a.parentElement.textContent === i) {
                a.textContent = char;
            }
        });
    });
}

function addCrossMarks(columns) {
    addMarks(columns, 'cross', 'X');
}

function getColumn(column) {
    return Array.from(document.getElementsByClassName('js-project-column-name')).filter(c => c.textContent === column)[0];
}

function hideColumns(columns) {
    columns.forEach(c => {
        const columnToHide = getColumn(c);
        columnToHide.parentElement.parentElement.parentElement.setAttribute('style', 'display:none !important');
    });
}

function showColumns(columns) {
    columns.forEach(c => {
        const columnToShow = getColumn(c);
        columnToShow.parentElement.parentElement.parentElement.style.display = '';
    });
}

function columnClick() {
    return e => {
        const source = e.target.tagName === 'A' ? e.target.parentElement : e.target;
        const columnText = source.textContent.replace('X', '');
        const localStorageKey = 'hiddencolumns';
        const hiddenColumns = JSON.parse(localStorage.getItem(localStorageKey));

        if (hiddenColumns && hiddenColumns.includes(columnText)) {
            showColumns([columnText]);
            e.stopPropagation();
            removeFromLocalStorage(localStorageKey, columnText);
        } else {
            hideColumns([columnText]);
            e.stopPropagation();
            saveToLocalStorage(localStorageKey, columnText);
        }
        toggleMark(e.target, 'cross', 'X');
    };
}

function addCheckMarks(issues) {
    addMarks(issues, 'check', '✓');
}

function getIssuesToShow(labelText) {
    const issues = [];
    Array.from(document.getElementsByClassName('issue-card')).forEach(el => {
        const hasLabel = el.querySelector('.labels');
        if (hasLabel && hasLabel.textContent.includes(labelText)) {
            issues.push(el);
        }
    });
    return issues;
}

function getIssuesToHide(labels) {
    const issues = [];
    Array.from(document.getElementsByClassName('issue-card')).forEach(el => {
        const hasLabel = el.querySelector('.labels');
        if (hasLabel) {
            let containsLabel = false;
            labels.forEach(l => {
                if (hasLabel.textContent.includes(l)) {
                    containsLabel = true;
                }
            });
            if (!containsLabel) {
                issues.push(el);
            }
        }
    });
    return issues;
}

function showAllIssues() {
    Array.from(document.getElementsByClassName('issue-card')).forEach(el => {
        el.style.display = '';
    });
}

function showIssues(shownLabels) {
    if (shownLabels.length === 0) {
        showAllIssues();
    } else {
        shownLabels.forEach(l => {
            const issues = getIssuesToShow(l);
            issues.forEach(i => i.style.display = '');
        });
        getIssuesToHide(shownLabels).forEach(i => i.style.display = 'none');
    }
}

function getUniqueLabels() {
    let labels = [];
    document.querySelectorAll('.issue-card').forEach(el => {
        const hasLabel = el.querySelector('.labels');
        if (hasLabel) {
            const issueLabels = hasLabel.textContent.trim().split('\n').map(l => l.trim());
            labels = labels.concat(issueLabels);
            labels = labels.filter((item, pos) => labels.indexOf(item) === pos);
        }
    });

    return labels;
}

function labelClick() {
    return e => {
        const source = e.target.tagName === 'A' ? e.target.parentElement : e.target;
        const labelText = source.textContent.replace('✓', '');
        const hiddenKey = 'hiddenissues';
        const shownKey = 'shownissues';
        const shownIssues = JSON.parse(localStorage.getItem(shownKey));
        const hiddenIssues = JSON.parse(localStorage.getItem(hiddenKey));

        if (!shownIssues && !hiddenIssues) {
            saveToLocalStorage(shownKey, labelText);
            getUniqueLabels().filter(l => l !== labelText).forEach(l => saveToLocalStorage(hiddenKey, l));
        } else if (shownIssues.includes(labelText)) {
            removeFromLocalStorage(shownKey, labelText);
            saveToLocalStorage(hiddenKey, labelText);
        } else if (hiddenIssues.includes(labelText)) {
            removeFromLocalStorage(hiddenKey, labelText);
            saveToLocalStorage(shownKey, labelText);
        }
        showIssues(JSON.parse(localStorage.getItem(shownKey)));
        toggleMark(e.target, 'check', '✓');
        e.stopPropagation();
    };
}

function createMenuListItem(text, onclickCallback, markClass) {
    const item = document.createElement('div');
    const itemHeading = document.createElement('div');
    const itemText = document.createElement('span');
    const mark = document.createElement('a');

    mark.className = markClass;
    mark.style.color = markClass === 'cross' ? 'red' : '#33cc33';
    mark.style.fontSize = '122%';
    mark.style.fontWeight = 'bold'
    mark.style.marginLeft = '-10%';
    mark.style.top = '-1.5%';
    mark.style.width = '10%';
    mark.style.textAlign = 'center';

    item.className = 'select-menu-item js-navigation-item';
    itemHeading.className = 'select-menu-item-text';
    item.style.display = 'flex';
    itemText.className = 'select-menu-item-heading';
    item.setAttribute('role', 'menuitem');
    item.tabIndex = 0;
    itemText.textContent = text;

    itemHeading.appendChild(itemText);
    item.appendChild(mark);
    item.appendChild(itemHeading);
    item.onclick = onclickCallback;

    return item;
}

function createMenuList(hideColumnsDropDown, listText) {
    const selectMenuList = hideColumnsDropDown.getElementsByClassName('select-menu-list')[0];
    const socialCount = hideColumnsDropDown.getElementsByClassName('social-count')[0];
    const selectMenuHeader = hideColumnsDropDown.getElementsByClassName('select-menu-header')[0];

    hideColumnsDropDown.getElementsByClassName('js-select-button')[0].textContent = listText;
    socialCount.parentElement.removeChild(socialCount);
    selectMenuHeader.parentElement.removeChild(selectMenuHeader);
    while (selectMenuList.childNodes.length > 0) {
        selectMenuList.childNodes.forEach(el => {
            el.parentElement.removeChild(el);
        });
    }

    return selectMenuList;
}

function runIt() {
    var hiddenColumns = JSON.parse(localStorage.getItem('hiddencolumns'));
    var shownIssues = JSON.parse(localStorage.getItem('shownissues'));

    hiddenColumns && hideColumns(hiddenColumns);
    shownIssues && showIssues(shownIssues);

    var dropDownList = document.getElementsByClassName('pagehead-actions')[0];
    var hideColumnsDropDown = dropDownList.childNodes[1].cloneNode(true);
    var filterLabelsDropDown = dropDownList.childNodes[1].cloneNode(true);
    var hideColumnsMenuList = createMenuList(hideColumnsDropDown, 'Hide/Show Columns ;)');
    var filterLabelsMenuList = createMenuList(filterLabelsDropDown, 'Filter Labels ;)');
    var columnNames = Array.from(document.getElementsByClassName('js-project-column-name')).map(col => col.textContent);
    var labels = getUniqueLabels();
    var hideColumnsMenuItems = [];
    var filterLabelsMenuItems = [];

    columnNames.forEach(col => hideColumnsMenuItems.push(createMenuListItem(col, columnClick(), 'cross')));
    hideColumnsMenuItems.forEach(item => hideColumnsMenuList.appendChild(item));
    dropDownList.insertBefore(hideColumnsDropDown, dropDownList.childNodes[0]);
    labels.forEach(l => filterLabelsMenuItems.push(createMenuListItem(l, labelClick(), 'check')));
    filterLabelsMenuItems.forEach(item => filterLabelsMenuList.appendChild(item));
    dropDownList.insertBefore(filterLabelsDropDown, dropDownList.childNodes[0]);

    hiddenColumns && addCrossMarks(hiddenColumns);
    shownIssues && addCheckMarks(shownIssues);
}

if (location.href.indexOf('projects') > 0) {
    // Not the most elegant but it works... good enough
    setTimeout(runIt, 500);
}
