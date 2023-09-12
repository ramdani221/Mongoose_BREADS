var express = require('express');
var router = express.Router();
const User = require('../models/User');
const moment = require('moment');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const { page = 1, limit, search, sortBy, sortMode } = req.query;
    const sort = {};
    sort[sortBy] = sortMode;
    const params = {};

    if (Number.isInteger(parseInt(search))) {
      params['phone'] = new RegExp(search, 'i')
    } else params['name'] = new RegExp(search, 'i');

    const offset = (page - 1) * limit;
    const total = await User.count(params);
    let pages = Math.ceil(total / limit);
    if (pages == Infinity) pages = 1;

    const users = await User.find(params).sort(sort).limit(limit).skip(offset);
    res.status(200).json({
      data: users,
      total,
      pages,
      page,
      limit,
      offset
    });
  } catch (err) {
    res.status(500).json({ err })
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { name, phone } = req.body
    const users = await User.create({ name, phone })
    res.status(201).json(users)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const { name, phone } = req.body;
    const users = await User.findByIdAndUpdate(req.params.id, { name, phone }, { new: true })
    res.status(201).json(users)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const users = await User.findByIdAndDelete(req.params.id, { new: true })
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ err })
  }
});

router.get('/:id/todos', async function (req, res, next) {
  res.render('todo', {userid: req.params.id, moment})
});

module.exports = router;
