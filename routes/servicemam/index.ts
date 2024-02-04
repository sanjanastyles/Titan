import express, { Request, Response, Router } from 'express';
import { createToken } from '../../utils/utils';
import { auth } from '../../middleware';
import { SERVICEMAN_SIGNUP_MODEL, SERVICE_MODEL } from '../../model';

class ServiceManController {
    private router: Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/login', this.handleLogin);
        this.router.post('/signup', this.handleSignup);
        this.router.get('/profile', auth, this.handleProfile);
        this.router.post('/profile', auth, this.handleProfilePost);
        this.router.get('/see/reviews', auth, this.handleSeeReviews);
    }

    private handleLogin = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const user = await SERVICEMAN_SIGNUP_MODEL.findOne({ email });

            if (user && user.password === password) {
                res.status(200).json({ code: 200, msg: 'Success', data: user });
            } else {
                res.status(401).json({ code: 401, msg: 'Invalid credentials', data: {} });
            }
        } catch (err) {
            res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
        }
    };

    private handleSignup = async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                firstName,
                lastName,
                phoneNumber,
                email,
                address,
                passcode,
                password,
                jobs,
            } = req.body;

            const existingUser = await SERVICEMAN_SIGNUP_MODEL.findOne({ email });
            if (existingUser) {
                res.status(409).json({ code: 409, msg: 'Email already registered', data: {} });
                return;
            }

            // Generate a token based on passcode (assuming createToken is defined and works)
            const token = createToken(passcode);

            // Create a new SERVICEMAN_SIGNUP_MODEL instance
            const newServiceMan = new SERVICEMAN_SIGNUP_MODEL({
                firstName,
                lastName,
                phoneNumber,
                email,
                address,
                passcode,
                password,
                jobs,
                isServiceman: true,
                token,
            });

            // Save the new Serviceman to the database
            await newServiceMan.save();

            // Update the associatedServiceman array in the Service model
            newServiceMan.jobs.forEach(async (e) => {
                await SERVICE_MODEL.findOneAndUpdate(
                    { serviceName: e.toLowerCase() },
                    { $push: { associatedServiceman: newServiceMan._id } },
                    { new: true }
                );
            })


            // Respond with success message and token
            res.status(201).json({ code: 201, msg: 'Created Successfully', token });
        } catch (err) {
            // Handle errors and respond with an error message
            res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
        }
    };


    private handleProfile = (req: Request, res: Response): void => {
        res.send({ KEY: 'profile', TOKEN: 'token' });
    };

    private handleProfilePost = (req: Request, res: Response): void => {
        res.send({ KEY: 'profile_post', TOKEN: 'token' });
    };

    private handleSeeReviews = (req: Request, res: Response): void => {
        res.send({ KEY: 'see_reviews', TOKEN: 'token' });
    };

    public getRouter(): Router {
        return this.router;
    }
}

export default ServiceManController;
