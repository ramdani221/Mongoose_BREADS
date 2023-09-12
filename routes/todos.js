var express = require('express');
var router = express.Router();
const Todo = require('../models/Todos');
const moment = require('moment');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const { page = 1, limit = 10, title, complete, startDateDeadline, endDateDeadline, sortBy = '_id', sortMode = 'desc', executor } = req.query;
    const sort = {};
    sort[sortBy] = sortMode;
    const params = {};

    if (executor) params['executor'] = executor;
    if (title) params['title'] = new RegExp(title, 'i');
    if (complete) params['complete'] = complete;
    if(startDateDeadline && endDateDeadline) {
      params['deadline'] = {'$gte': startDateDeadline, '$lte': endDateDeadline}
    } else if(startDateDeadline) {
      params['deadline'] = {'$gte': startDateDeadline}
    } else if (endDateDeadline) {
      params['deadline'] = {'$lte': endDateDeadline}
    }

    const offset = (page - 1) * limit;
    const total = await Todo.count(params)
    const pages = Math.ceil(total / limit)

    const todos = await Todo.find(params).sort(sort).limit(limit).skip(offset);
    // console.log(todos.map(item => {
    //   return  {_id: item._id, title: item.title, complete: item.complete, executor: item.executor, deadline: moment(item.deadline).format('DD-MM-YYYY, h:mm a'), deadlineInput: moment(item.deadline).format('YYYY-MM-DDTh:mm')}
    // }));
    res.status(200).json({
      data: todos,
      moment,
      total,
      pages,
      page,
      limit,
      offset,
    });
  } catch (err) {
    res.status(500).json({ err })
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { title, executor } = req.body
    const todos = await Todo.create({ title, executor })
    res.status(201).json(todos)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const { title, deadline, complete } = req.body;
    const todos = await Todo.findByIdAndUpdate(req.params.id, { title, deadline, complete }, { new: true })
    res.status(201).json(todos)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const todos = await Todo.findByIdAndDelete(req.params.id, { new: true })
    res.status(200).json(todos)
  } catch (err) {
    res.status(500).json({ err })
  }
});

module.exports = router;
