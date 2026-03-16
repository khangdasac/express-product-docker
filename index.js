const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./views'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', require('./routes/index'))

app.listen(3000, () => {
    console.log('Server is running...')
});