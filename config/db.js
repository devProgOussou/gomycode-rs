const mongoose = require("mongoose");

mongoose
  .connect(`mongodb://localhost/${process.env.DB_USER}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`Connected to DB!`);
    console.log("====================================");
  })
  .catch((err) => console.log(err));
