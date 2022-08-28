const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload')
const app = express();
app.use(helmet({crossOriginResourcePolicy: false,}));
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const { PrismaClient } = require('@prisma/client');
const { createNoSubstitutionTemplateLiteral } = require('typescript');
const prisma = new PrismaClient()

app.use(bodyParser.json(), express.static('public'), fileupload())


app.route('/food').get(async(req, res) => {
  try {
    const response = await prisma.dishes.findMany()
    res.send(response)
  }
  catch(e) {
    res.send(e);
  }
})

app.route('/food').post(async (req, res) => {
  try {
    const name = req.body.name
    const fileName = name + '.jpeg'
    const path = __dirname + '/public/img/' + fileName
    const data = req.body
    req.files.image.mv(path)

    await prisma.dishes.create({
      data: data,
    })
    res.send('Блюдо добавлено')
  }
  catch (e) {
    res.send(e);
  }
})

app.route('/food').patch(async (req, res) => {
  try {
    const id = Number(req.body.id)
    const data = {
      name: req.body.name,
      description: req.body.description,
      region: req.body.region,
      tag: req.body.tag,
      price: req.body.price,
    }
    if (req.files) {
      const name = req.body.name
      const fileName = name + '.jpeg'
      const path = __dirname + '/public/img/' + fileName
      req.files.image.mv(path)
    }
    await prisma.dishes.update({
      where: {
        id: id,
      },
      data: data,
    })
    res.send('Блюдо обновлено')
  }
  catch (e) {
    res.send(e);
  }
})

module.exports = app;

app.listen(3000, () => console.log('server running ...'))