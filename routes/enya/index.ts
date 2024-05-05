import express, { Router, Request, Response } from 'express';
import http from 'http';

class ChatbotController {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/enya', this.handleChatbotRequest);
  }

  private handleChatbotRequest(req: Request, res: Response): void {
    const chatbotUrl = 'http://localhost:8081/chatbot';

    const { msg } = req.body;

    const postData = JSON.stringify({ message: msg });

    const options = {
      hostname: 'localhost',
      port: 8081,
      path: '/chatbot',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const chatbotReq = http.request(options, (chatbotRes) => {
      let data = '';

      chatbotRes.on('data', (chunk) => {
        data += chunk;
      });

      chatbotRes.on('end', () => {
        res.send(data);
      });
    });

    chatbotReq.on('error', (error) => {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
    });

    chatbotReq.write(postData);
    chatbotReq.end();
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default ChatbotController;
