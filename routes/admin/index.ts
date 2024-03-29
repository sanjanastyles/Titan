import express, { Router } from 'express';
import { adminController } from '../../controller';

class AdminController {
  private router: Router;
  constructor () {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes (): void {
    this.router.get('/users', adminController.handleAllUsers);
    this.router.get('/get/admin', adminController.handleAllAdmin);
    this.router.post('/create/service', adminController.handleAddService);
    this.router.post('/create/admin', adminController.handleCreateAdmin);
    this.router.post('/block', adminController.handleBlock);
    //   this.router.get('/abc', async (_, res) => {
    //     const data = await SERVICE_MODEL.find();
    //     res.status(200).json({ c: 200, d: data });
    //   });

    //   this.router.post('/xyz', async (_, res) => {
    //     const newService = new SERVICE_MODEL({
    //       serviceName: 'name',
    //       serviceId: 'keyWord',
    //     });
    //     await newService.save();
    //     res.status(200).json({ c: 200, d: newService });
    //   });
  }

  public getRouter (): Router {
    return this.router;
  }
}
export default AdminController;
