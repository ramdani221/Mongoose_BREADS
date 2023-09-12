var userId = null, userName = null, userPhone = null;
var limitation = document.getElementById('limitation').value || 10;
var page = 1;
var search = "";
var sortBy = "_id", sortMode = "desc";



const formModal = new bootstrap.Modal(document.getElementById('userForm'), {
    keyboard: false
});
const deleteModal = new bootstrap.Modal(document.getElementById('userDelete'), {
    keyboard: false
});

class Filter {
    static setLimit() {
        limitation = document.getElementById('limitation').value
        User.list()
    };

    static find() {
        search = document.getElementById('find').value;
        User.list()
    };

    static clearFind() {
        document.getElementById('find').value = '';
        search = ''
        User.list()
    };

    static changePage(pageNo) {
        page = pageNo;
        User.list()
    }
}

class ShowModal {
    static add() {
        document.getElementById('btnadd').style.display = 'block';
        document.getElementById('btnupdate').style.display = 'none';
        document.getElementById('name').value = ''
        document.getElementById('phone').value = ''
        formModal.show();
    }

    static update(_id, name, phone) {
        document.getElementById('name').value = name;
        document.getElementById('phone').value = phone;
        userId = _id;
        document.getElementById('btnadd').style.display = 'none';
        document.getElementById('btnupdate').style.display = 'block';
        formModal.show();
    }

    static delete(_id) {
        deleteModal.show()
        userId = _id
    }
}

class Sort {
    static asc(name) {
        sortBy = name
        sortMode = 'asc'
        document.getElementById(`btn-${name}`).style.display = 'none';
        document.getElementById(`btn-${name}-up`).style.display = 'block';
        User.list()
    };

    static desc(name) {
        sortBy = name
        sortMode = 'desc'
        document.getElementById(`btn-${name}-up`).style.display = 'none';
        document.getElementById(`btn-${name}-down`).style.display = 'block';
        User.list()
    }

    static byId(name) {
        sortBy = '_id'
        sortMode = 'desc'
        document.getElementById(`btn-${name}-down`).style.display = 'none';
        document.getElementById(`btn-${name}`).style.display = 'block';
        User.list()
    }
}

class User {
    static async list() {
        try {
            const response = await fetch(
                `http://localhost:3000/users/?page=${page}&limit=${limitation}&search=${search}&sortBy=${sortBy}&sortMode=${sortMode}`
            );
            const users = await response.json();
            let html = "";
            let pageNumber = '';
            let pagination = "";

            users.data.forEach((value, index) => {
                html += `
            <tr>
                <th scope="row">${index + users.offset + 1}</th>
                <td>${value.name}</td>
                <td>${value.phone}</td>
                <td>
                <button type="button" class="btn btn-success rounded-2" onclick="ShowModal.update('${value._id}', '${value.name}', '${value.phone}')">
                <i class="fa-sharp fa-solid fa-pencil"></i>
                </button>
                &nbsp
                <button type="button" class="btn btn-danger rounded-2" onclick="ShowModal.delete('${value._id}')">
                <i class="fa-solid fa-trash" data-bs-toggle="modal"></i>
                </button>
                &nbsp
                <a class="btn btn-warning rounded-2" href="/users/${value._id}/todos"><i class="fa-solid fa-right-to-bracket"></i></a>
                </td>
            </tr>
            `
            });

            for (let i = 1; i <= users.pages; i++) pageNumber += `<li class="page-item${users.page == i ? ' active' : ''}"><a class="page-link" onclick="Filter.changePage(${i})">${i}</a></li>`;

            pagination = `<span>Show ${users.offset + 1} to ${users.limit} of ${users.total} entries</span>
            <nav class="d-inline-block">
            <ul class="pagination mx-3 mb-0">
                 ${users.page == 1 ? '' : `<li class="page-item">
                 <a class="page-link" onclick="Filter.changePage(${page - 1})" aria-label="Previous">
                   <span aria-hidden="true">&laquo;</span>
                 </a>
               </li>`}
                 ${pageNumber}
                 ${(users.pages == 1 || users.page == users.pages) ? '' : `<li class="page-item">
                 <a class="page-link" onclick="Filter.changePage(${page + 1})" aria-label="Next">
                   <span aria-hidden="true">&raquo;</span>
                 </a>
               </li>`}             
               </ul>
               </nav>`;

            document.getElementById("users-table").innerHTML = html;
            document.getElementById("pagination").innerHTML = pagination

        } catch (err) { console.log(err) }
    }

    static async add() {
        try {
            let name = document.getElementById('name').value
            let phone = document.getElementById('phone').value
            const response = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, phone }),
            });
            const users = await response.json();

            User.list();
            formModal.hide()
        } catch (err) { console.log(err) }
    }

    static async update() {
        try {
            let name = document.getElementById('name').value
            let phone = document.getElementById('phone').value
            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, phone }),
            });

            const users = await response.json();
            User.list();
            formModal.hide()
        } catch (err) { console.log(err) }
    }

    static async delete() {
        try {
            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const users = await response.json();

            User.list();
            deleteModal.hide()
        } catch (err) { console.log(err) }
    }
};

User.list()