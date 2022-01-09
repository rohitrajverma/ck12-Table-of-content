// // Your JS code goes here

var root = document.getElementById('root');

getData();

function getData() {
    fetch('../api/book/maths')
        .then(response => response.json())
        .then(data => appendData(data.response, root))
        .catch(err => console.log('error: ' + err));
}

function fetchChildData(id, element) {
    if (element.childNodes.length <= 2) {
        addCursorWait(element);
        fetch('../api/book/maths/section/' + id)
            .then(response => response.json())
            .then(data => appendData(data.response[id], element))
            .catch(err => console.log('error: ' + err));
    }
}

function appendData(data, element) {

    data = data.sort((a, b) => a.sequenceNO - b.sequenceNO);
    var par = document.createElement('ul');
    for (var i = 0; i < data.length; i++) {
        var item = document.createElement('li');

        var li = par.appendChild(item);
        li.classList.add("closed")
        li.setAttribute("id", data[i].id);

        if (data[i].childrenCount && data[i].childrenCount > 0) {
            li.setAttribute("hasChild", true);
        } else {
            li.setAttribute("hasChild", false);
        }

        if (data[i].status) {
            switch (data[i].status) {
                case 'COMPLETE':
                    item.innerHTML = '<span tooltip="completed"><img src="../assets/images/check.png" class="imgC"></span>' + data[i].title;
                    break;
                case 'IN_PROGRESS':
                    item.innerHTML = '<span tooltip="in progress"><img src="../assets/images/inProgress.png" class="imgC"></span>' + data[i].title;
                    break
                case 'NOT_STARTED':
                    item.innerHTML = '<span tooltip="not started"><img src="../assets/images/notStarted.png" class="imgC"></span>' + data[i].title;
                    break
                default:
                    item.innerHTML = data[i].title;
                    break;
            }
        } else {
            if (data[i].childrenCount === data[i].completeCount) {
                item.innerHTML = '<span tooltip="completed"><img src="../assets/images/check.png" class="imgC"></span>' + data[i].title;
            } else {
                item.innerHTML = '<span tooltip="in progress"><img src="../assets/images/inProgress.png" class="imgC"></span>' + data[i].title;
            }
        }

        li.addEventListener('click', function(e) {
            var child = e.target;
            if (child && child.classList.contains('opened')) {
                closeItem(child);
            } else {
                openItem(child, this.getAttribute("id"), this.getAttribute("haschild"));
            }
            e.stopPropagation();
        })
        element.appendChild(par);
    }
    removeCursorWait(element);
}

function openItem(item, id, hasChild) {
    if (hasChild === 'true') {
        item.classList.add('opened');
        item.classList.remove('closed');
        fetchChildData(id, item);
    }
}

function closeItem(item) {
    item.classList.add('closed');
    item.classList.remove('opened');
}

function addCursorWait(el) {
    el.style.setProperty('cursor', 'wait');
}

function removeCursorWait(el) {
    el.style.setProperty('cursor', 'pointer');
}