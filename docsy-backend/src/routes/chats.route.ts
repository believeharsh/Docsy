import express, { Request, Response } from "express";
import { queryDocument } from "../services/chatService.js";
import { ChatRequest } from "../types/index.js";

const chatRoutes = express.Router();

// Chat endpoint
chatRoutes.post(
  "/",
  async (req: Request<{}, {}, ChatRequest>, res: Response): Promise<any> => {
    try {
      const { question, documentId } = req.body;

      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }

      console.log("💬 Question:", question);

      // Query the document
      const result = await queryDocument(question, documentId);

      res.json({
        success: true,
        answer: result.answer,
        citations: result.citations,
        context: result.context,
      });
    } catch (error: any) {
      console.error("❌ Chat error:", error);
      res.status(500).json({
        error: "Failed to process question",
        details: error.message,
      });
    }
  }
);

export default chatRoutes;
