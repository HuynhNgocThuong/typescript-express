import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller: any) => {
      this.app.use('/', controller.router);
    });
  }

  private async connectToTheDatabase() {
    const {MONGO_USER, MONGO_PASSWORD, MONGO_PATH} = process.env;
    await mongoose
      .connect(`${MONGO_PATH}`)
      .then(() => console.log('Database connected.'))
      .catch((err) => console.log(err));
  }
}
export default App;
