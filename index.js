const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    // console.log(`Server has been started on ${port}`)
});
