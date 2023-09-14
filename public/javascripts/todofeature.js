var title = "", complete = "", strDealine = "", endDeadline = "";
var sortBy = "_id", sortMode = "desc";
var page = 1, limitation = 10;
var executor = null, deadline = null;
var todoId = null;

const formModal = new bootstrap.Modal($('#todoForm'), {
    keyboard: false
});
const deleteModal = new bootstrap.Modal($('#todoDelete'), {
    keyboard: false
});

function executorid(userid) {
    executor = userid;
    Todo.list();
}

class Filter {
    static find() {
        title = $('#inputTitle').val();
        strDealine = $('#strDate').val();
        endDeadline = $('#endDate').val();
        if ($('#completeStat').val()) complete = $('#completeStat').val();
        Todo.list();
    }

    static findReset() {
        title = "";
        strDealine = "";
        endDeadline = "";
        complete = "";
        Todo.list();
    }
}

class Sort {
    static asc(by) {
        sortBy = by;
        sortMode = 'asc';
        $('#btn-deadline').hide();
        $('#btn-deadline-up').show();
        Todo.list();
    };

    static desc(by) {
        sortBy = by;
        sortMode = 'desc';
        $('#btn-deadline-up').hide();
        $('#btn-deadline-down').show();
        Todo.list();
    }
    static _id() {
        sortBy = '_id';
        sortMode = 'desc';
        $('#btn-deadline-down').hide();
        $('#btn-deadline').show();
        Todo.list();
    }
}

class ShowModal {
    static update(_id, title, deadline,complete) {
        $('#title').val(title);
        $('#deadline').val(moment(deadline).format('YYYY-MM-DDTHH:mm'));
        $('#complete').prop('checked', JSON.parse(complete));
        todoId = _id;
        formModal.show();
    }

    static delete(_id) {
        todoId = _id;
        deleteModal.show()
    }
}

class Todo {
    static async list() {
        try {
            const response = await fetch(
                `http://localhost:3000/todos/?page=${page}&limit=${limitation}&title=${title}&complete=${complete}&startDateDeadline=${strDealine}&endDateDeadline=${endDeadline}&sortBy=${sortBy}&sortMode=${sortMode}&executor=${executor}`
            );
            const todos = await response.json();
            let html = "";
            let pageNumber = '';
            let pagination = "";

            todos.data.forEach((value, index) => {
                html += `
            <div class="input-group mb-3 py-2 px-3 rounded-2${value.complete ? ' bg-success-subtle': ''}${new Date(value.deadline).getTime() < Date.now() && !value.complete ? ' bg-danger-subtle': ' bg-secondary-subtle'}" id="index${index}">
            <span class="form-control border-0 bg-transparent ps-0">${moment(value.deadline).format('DD-MM-YYYY hh:mm a')} ${value.title}</span>
            <button type="button" class="btn p-1" onclick="ShowModal.update('${value._id}','${value.title}', '${value.deadline}', '${value.complete}')">
                <i class="fa-sharp fa-solid fa-pencil"></i>
            </button>
            &nbsp
            <button type="button" class="btn p-1" onclick="ShowModal.delete('${value._id}')">
                <i class="fa-solid fa-trash" data-bs-toggle="modal"></i>
            </button>
            </div>
            `
            });
            for (let i = 1; i <= todos.pages; i++) pageNumber += `<li class="page-item${todos.page == i ? ' active' : ''}"><a class="page-link" onclick="Filter.changePage(${i})">${i}</a></li>`;

            pagination = `<span>Show ${todos.offset + 1} to ${(Number(todos.limit) + Number(todos.offset)) <= todos.total ? (Number(todos.limit) + Number(todos.offset)) : todos.total } of ${todos.total} entries</span>
            <nav class="d-inline-block">
            <ul class="pagination mx-3 mb-0">
                 ${todos.page == 1 ? '' : `<li class="page-item">
                 <a class="page-link" onclick="Filter.changePage(${page - 1})" aria-label="Previous">
                   <span aria-hidden="true">&laquo;</span>
                 </a>
               </li>`}
                 ${pageNumber}
                 ${(todos.pages == 1 || todos.page == todos.pages) ? '' : `<li class="page-item">
                 <a class="page-link" onclick="Filter.changePage(${page + 1})" aria-label="Next">
                   <span aria-hidden="true">&raquo;</span>
                 </a>
               </li>`}             
               </ul>
               </nav>`;

            $("#todos-list").html(html);
            $("#pagination").html(pagination);
        } catch (err) { console.log(err) }
    }

    static async add() {
        try {
            let title = $("#todoTitle").val()
            const response = await fetch("http://localhost:3000/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, executor }),
            });
            const todos = await response.json();

            Todo.list();
            $('#todoTitle').val('')
        } catch (err) { console.log(err) }
    }

    static async update() {
        try {
            let title = $('#title').val()
            let deadline = $('#deadline').val()
            let complete = $('#complete').prop('checked')
            const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, deadline, complete }),
            });

            const todos = await response.json();
            Todo.list();
            formModal.hide()
        } catch (err) { console.log(err) }
    }

    static async delete() {
        try {
            const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const todos = await response.json();

            Todo.list();
            deleteModal.hide()
        } catch (err) { console.log(err) }
    }
}

