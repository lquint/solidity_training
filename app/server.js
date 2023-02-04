const express = require('express');
const path = require('path')
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', (req,res)=>{
    res.render("pages/home")
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});