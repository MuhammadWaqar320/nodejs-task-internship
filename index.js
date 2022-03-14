import mongoose from "mongoose";
import myapp from "./app.js";

// port
const PORT = process.env.PORT || 3000;
const connection_string =
  "mongodb+srv://waqar:1234@movies-databas.ygkit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    myapp.listen(PORT, () => {
      console.log(`server is running on ${PORT}`);
    })
  )
  .catch((error) => console.log(error.message));
