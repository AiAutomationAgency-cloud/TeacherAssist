import { 
  users, 
  inquiries, 
  responses, 
  templates, 
  activities,
  type User, 
  type InsertUser,
  type Inquiry,
  type InsertInquiry,
  type Response,
  type InsertResponse,
  type Template,
  type InsertTemplate,
  type Activity,
  type InsertActivity
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Inquiries
  getInquiry(id: number): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiriesByUser(userId: number): Promise<Inquiry[]>;

  // Responses
  getResponse(id: number): Promise<Response | undefined>;
  createResponse(response: InsertResponse): Promise<Response>;
  updateResponse(id: number, response: Partial<Response>): Promise<Response | undefined>;
  getResponsesByInquiry(inquiryId: number): Promise<Response[]>;
  getResponsesByUser(userId: number): Promise<Response[]>;
  getRecentResponses(userId: number, limit?: number): Promise<Response[]>;

  // Templates
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<Template>): Promise<Template | undefined>;
  getTemplatesByUser(userId: number): Promise<Template[]>;
  getTemplatesByType(type: string, userId: number): Promise<Template[]>;
  incrementTemplateUsage(id: number): Promise<void>;

  // Activities
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivitiesByUser(userId: number, limit?: number): Promise<Activity[]>;

  // Analytics
  getDashboardStats(userId: number): Promise<{
    totalInquiries: number;
    autoResponses: number;
    avgResponseTime: number;
    languageDistribution: { language: string; count: number; percentage: number }[];
  }>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize database with default data if needed
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    try {
      // Check if default user exists
      const existingUser = await db.select().from(users).where(eq(users.username, "sarah.johnson")).limit(1);
      
      if (existingUser.length === 0) {
        // Create default user
        await db.insert(users).values({
          username: "sarah.johnson",
          password: "password"
        });

        // Get the created user
        const [newUser] = await db.select().from(users).where(eq(users.username, "sarah.johnson"));

        // Create default templates
        await db.insert(templates).values([
          {
            name: "Assignment Help",
            type: "assignment_help",
            content: "Dear Parent,\n\nThank you for reaching out about the assignment. I understand your child might be finding it challenging.\n\n[Assignment specific guidance will be provided here]\n\nPlease don't hesitate to reach out if you have any other questions.\n\nBest regards,\n[Teacher Name]",
            language: "en",
            usageCount: 45,
            userId: newUser.id
          },
          {
            name: "Grade Explanation",
            type: "grade_inquiry",
            content: "Dear Parent,\n\nThank you for your inquiry about your child's grade.\n\n[Grade breakdown and explanation will be provided here]\n\nI'm happy to schedule a meeting to discuss this further if needed.\n\nBest regards,\n[Teacher Name]",
            language: "en",
            usageCount: 32,
            userId: newUser.id
          },
          {
            name: "Schedule Info",
            type: "schedule_question",
            content: "Dear Parent,\n\nThank you for your question about the schedule.\n\n[Schedule information will be provided here]\n\nPlease let me know if you need any clarification.\n\nBest regards,\n[Teacher Name]",
            language: "en",
            usageCount: 28,
            userId: newUser.id
          },
          {
            name: "Parent Communication",
            type: "parent_communication",
            content: "Dear Parent,\n\nThank you for reaching out.\n\n[Communication content will be provided here]\n\nI look forward to working together to support your child's education.\n\nBest regards,\n[Teacher Name]",
            language: "en",
            usageCount: 21,
            userId: newUser.id
          }
        ]);
      }
    } catch (error) {
      console.log("Default data already exists or error initializing:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getInquiry(id: number): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry || undefined;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db
      .insert(inquiries)
      .values({
        ...insertInquiry,
        userId: 1 // Default to user 1 for demo
      })
      .returning();
    return inquiry;
  }

  async getInquiriesByUser(userId: number): Promise<Inquiry[]> {
    return await db.select().from(inquiries).where(eq(inquiries.userId, userId));
  }

  async getResponse(id: number): Promise<Response | undefined> {
    const [response] = await db.select().from(responses).where(eq(responses.id, id));
    return response || undefined;
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const [response] = await db
      .insert(responses)
      .values(insertResponse)
      .returning();
    return response;
  }

  async updateResponse(id: number, updateData: Partial<Response>): Promise<Response | undefined> {
    const [response] = await db
      .update(responses)
      .set(updateData)
      .where(eq(responses.id, id))
      .returning();
    return response || undefined;
  }

  async getResponsesByInquiry(inquiryId: number): Promise<Response[]> {
    return await db.select().from(responses).where(eq(responses.inquiryId, inquiryId));
  }

  async getResponsesByUser(userId: number): Promise<Response[]> {
    const userInquiries = await this.getInquiriesByUser(userId);
    const inquiryIds = userInquiries.map(inquiry => inquiry.id);
    if (inquiryIds.length === 0) return [];
    
    return await db.select().from(responses).where(
      sql`${responses.inquiryId} = ANY(${inquiryIds})`
    );
  }

  async getRecentResponses(userId: number, limit: number = 10): Promise<Response[]> {
    const userInquiries = await this.getInquiriesByUser(userId);
    const inquiryIds = userInquiries.map(inquiry => inquiry.id);
    if (inquiryIds.length === 0) return [];

    return await db.select().from(responses)
      .where(sql`${responses.inquiryId} = ANY(${inquiryIds})`)
      .orderBy(desc(responses.generatedAt))
      .limit(limit);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const [template] = await db
      .insert(templates)
      .values({
        ...insertTemplate,
        userId: 1 // Default to user 1 for demo
      })
      .returning();
    return template;
  }

  async updateTemplate(id: number, updateData: Partial<Template>): Promise<Template | undefined> {
    const [template] = await db
      .update(templates)
      .set(updateData)
      .where(eq(templates.id, id))
      .returning();
    return template || undefined;
  }

  async getTemplatesByUser(userId: number): Promise<Template[]> {
    return await db.select().from(templates).where(eq(templates.userId, userId));
  }

  async getTemplatesByType(type: string, userId: number): Promise<Template[]> {
    return await db.select().from(templates)
      .where(sql`${templates.type} = ${type} AND ${templates.userId} = ${userId}`);
  }

  async incrementTemplateUsage(id: number): Promise<void> {
    await db
      .update(templates)
      .set({ usageCount: sql`${templates.usageCount} + 1` })
      .where(eq(templates.id, id));
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values({
        ...insertActivity,
        userId: 1 // Default to user 1 for demo
      })
      .returning();
    return activity;
  }

  async getActivitiesByUser(userId: number, limit: number = 10): Promise<Activity[]> {
    return await db.select().from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async getDashboardStats(userId: number): Promise<{
    totalInquiries: number;
    autoResponses: number;
    avgResponseTime: number;
    languageDistribution: { language: string; count: number; percentage: number }[];
  }> {
    const inquiries = await this.getInquiriesByUser(userId);
    const responses = await this.getResponsesByUser(userId);
    const sentResponses = responses.filter(r => r.status === "sent");
    
    const totalInquiries = inquiries.length;
    const autoResponses = sentResponses.length;
    
    const responseTimes = responses
      .filter(r => r.responseTime)
      .map(r => r.responseTime || 0);
    const avgResponseTime = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) 
      : 0;

    // Calculate language distribution
    const languageCount = new Map<string, number>();
    inquiries.forEach(inquiry => {
      const count = languageCount.get(inquiry.language) || 0;
      languageCount.set(inquiry.language, count + 1);
    });

    const languageDistribution = Array.from(languageCount.entries()).map(([language, count]) => ({
      language,
      count,
      percentage: totalInquiries > 0 ? Math.round((count / totalInquiries) * 100) : 0
    }));

    return {
      totalInquiries,
      autoResponses,
      avgResponseTime,
      languageDistribution
    };
  }
}

export const storage = new DatabaseStorage();
