import express, { Request, Response, Router } from "express";
import { CONTACT_MODEL, SERVICEMAN_SIGNUP_MODEL, SERVICE_MODEL } from "../../model";

class CommonController {
    private router: Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/contact", this.handleContactForm);
        // Add additional routes here
        this.router.get("/allservice", this.handleAllService);
        this.router.get("/service/:serviceName", this.handleService);
        this.router.post("/forgotpassword", this.handleForgotPassword);
    }

    private handleContactForm = async (req: Request, res: Response): Promise<void> => {
        const { email, subject, message } = req.body;
        try {
            const createContact = new CONTACT_MODEL({
                email,
                subject,
                message,
            });
            await createContact.save();
            res.status(200).json({ code: 200, msg: "created" });
        } catch (err) {
            res.send({ msg: "Something went wrong", code: 412, error: err });
        }
    };

    private handleAllService = async (_req: Request, res: Response): Promise<void> => {
        try {
            const services = await SERVICE_MODEL.find();
            res.status(200).json({ code: 200, msg: "All Service", data: services });
        } catch (err) {
            res.send({
                msg: "Something went wrong in getting the service",
                code: 412,
                error: err,
            });
        }
    };

    private handleService = async (req: Request, res: Response): Promise<void> => {
        const { serviceName } = req.params;

        try {
            const service = await SERVICE_MODEL.findOne({ serviceName: serviceName.toLowerCase() });
            if (service) {
                const servicemen = await SERVICEMAN_SIGNUP_MODEL.aggregate([
                    {
                        $match: { _id: { $in: service.associatedServiceman } },
                    },
                    {
                        $project: {
                            token: 0,
                        },
                    },
                ]);

                res.status(200).json({ code: 200, msg: 'Servicemen found', data: servicemen });
                return;
            }
            res.status(404).json({ code: 404, msg: 'Service not found' });
        } catch (err) {
            res.send({
                msg: "Something went wrong in getting the service",
                code: 412,
                error: err,
            });
        }
    };


    private handleForgotPassword = async (req: Request, res: Response): Promise<void> => {
        const { phonenumber, password } = req.body;

        try {
            const user = await SERVICEMAN_SIGNUP_MODEL.findOne({ phoneNumber: phonenumber });

            if (!user) {
                res.status(404).json({ code: 404, msg: "User not found" });
                return
            }
            // Modify the code to use TypeScript for 'serviceman' model
            // await serviceman.updateOne(
            //   { phoneNumber: phonenumber },
            //   { $set: { password: password } }
            // );

            res.send({ code: 200, msg: "Phone Number Found" });
        } catch (err) {
            res.status(500).send({ msg: "Internal Server Error", code: 500, error: err });
        }
    };


    public getRouter(): Router {
        return this.router;
    }
}

export default CommonController;