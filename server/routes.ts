import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertResponseSchema, insertTemplateSchema, insertActivitySchema } from "@shared/schema";
import { generateResponse, translateText, detectLanguage } from "./services/gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const userId = 1; // Default user for demo
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  // Create new inquiry
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      
      // Log activity
      await storage.createActivity({
        type: "inquiry_created",
        description: `New ${inquiry.type} inquiry received`
      });

      res.json(inquiry);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      res.status(400).json({ message: "Invalid inquiry data" });
    }
  });

  // Generate response for inquiry
  app.post("/api/inquiries/:id/generate-response", async (req, res) => {
    try {
      const inquiryId = parseInt(req.params.id);
      const inquiry = await storage.getInquiry(inquiryId);
      
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }

      const { targetLanguage = inquiry.language, teacherName = "Ms. Johnson", subject = "" } = req.body;

      const result = await generateResponse({
        inquiryText: inquiry.content,
        inquiryType: inquiry.type,
        targetLanguage,
        teacherName,
        subject
      });

      const response = await storage.createResponse({
        inquiryId,
        content: result.response,
        language: targetLanguage,
        status: "draft",
        responseTime: result.responseTime
      });

      // Update inquiry with detected language if not set
      if (!inquiry.detectedLanguage) {
        // This would update the inquiry in a real database
      }

      // Log activity
      await storage.createActivity({
        type: "response_generated",
        description: `AI response generated for ${inquiry.type} inquiry`
      });

      res.json({ response, detectedLanguage: result.detectedLanguage });
    } catch (error) {
      console.error("Error generating response:", error);
      res.status(500).json({ message: "Failed to generate response" });
    }
  });

  // Translate text
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;
      
      if (!text || !targetLanguage) {
        return res.status(400).json({ message: "Text and target language are required" });
      }

      const translatedText = await translateText(text, targetLanguage);
      
      // Log activity
      await storage.createActivity({
        type: "text_translated",
        description: `Text translated to ${targetLanguage}`
      });

      res.json({ translatedText });
    } catch (error) {
      console.error("Error translating text:", error);
      res.status(500).json({ message: "Failed to translate text" });
    }
  });

  // Detect language
  app.post("/api/detect-language", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const detectedLanguage = await detectLanguage(text);
      res.json({ detectedLanguage });
    } catch (error) {
      console.error("Error detecting language:", error);
      res.status(500).json({ message: "Failed to detect language" });
    }
  });

  // Get templates
  app.get("/api/templates", async (req, res) => {
    try {
      const userId = 1; // Default user for demo
      const templates = await storage.getTemplatesByUser(userId);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Create template
  app.post("/api/templates", async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      
      // Log activity
      await storage.createActivity({
        type: "template_created",
        description: `New template "${template.name}" created`
      });

      res.json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(400).json({ message: "Invalid template data" });
    }
  });

  // Use template
  app.post("/api/templates/:id/use", async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const template = await storage.getTemplate(templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      await storage.incrementTemplateUsage(templateId);
      
      // Log activity
      await storage.createActivity({
        type: "template_used",
        description: `Template "${template.name}" used`
      });

      res.json(template);
    } catch (error) {
      console.error("Error using template:", error);
      res.status(500).json({ message: "Failed to use template" });
    }
  });

  // Get responses
  app.get("/api/responses", async (req, res) => {
    try {
      const userId = 1; // Default user for demo
      const { limit = 50 } = req.query;
      const responses = await storage.getRecentResponses(userId, parseInt(limit as string));
      
      // Get related inquiries for each response
      const responsesWithInquiries = await Promise.all(
        responses.map(async (response) => {
          const inquiry = response.inquiryId ? await storage.getInquiry(response.inquiryId) : null;
          return { ...response, inquiry };
        })
      );

      res.json(responsesWithInquiries);
    } catch (error) {
      console.error("Error fetching responses:", error);
      res.status(500).json({ message: "Failed to fetch responses" });
    }
  });

  // Update response
  app.patch("/api/responses/:id", async (req, res) => {
    try {
      const responseId = parseInt(req.params.id);
      const updateData = req.body;
      
      // Add sent timestamp if status is being set to sent
      if (updateData.status === "sent" && !updateData.sentAt) {
        updateData.sentAt = new Date();
      }

      const response = await storage.updateResponse(responseId, updateData);
      
      if (!response) {
        return res.status(404).json({ message: "Response not found" });
      }

      // Log activity if response was sent
      if (updateData.status === "sent") {
        await storage.createActivity({
          type: "response_sent",
          description: "Response sent to parent/student"
        });
      }

      res.json(response);
    } catch (error) {
      console.error("Error updating response:", error);
      res.status(500).json({ message: "Failed to update response" });
    }
  });

  // Get recent activities
  app.get("/api/activities", async (req, res) => {
    try {
      const userId = 1; // Default user for demo
      const { limit = 10 } = req.query;
      const activities = await storage.getActivitiesByUser(userId, parseInt(limit as string));
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
