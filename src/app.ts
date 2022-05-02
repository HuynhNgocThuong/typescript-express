import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import 'dotenv';
class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller: any) => {
      this.app.use('/', controller.router);
    });
  }

  private connectToTheDatabase() {
    const {MONGO_USER, MONGO_PASSWORD, MONGO_PATH} = process.env;
    mongoose.connect(`${MONGO_PATH}`);
  }
}
export default App;
