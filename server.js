const mongoose = require("mongoose");
const app = require("./app");

DB_HOST = 'mongodb+srv://Oleksii:GCs33CxuZde0m8Sx@cluster0.g6e9a8j.mongodb.net/contact_reader?retryWrites=true&w=majority'


mongoose
.connect(DB_HOST)
.then(() => {
  const server = app.listen(3000, () => {
    console.log("Database connection successful");
    const port = server.address().port;
    console.log(`Server is running on http://localhost:${port}`);
  });
})
  .catch((error) => {
    console.log(error.message), process.exit(1);
  });

