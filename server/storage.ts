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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private inquiries: Map<number, Inquiry>;
  private responses: Map<number, Response>;
  private templates: Map<number, Template>;
  private activities: Map<number, Activity>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.inquiries = new Map();
    this.responses = new Map();
    this.templates = new Map();
    this.activities = new Map();
    this.currentId = 1;

    // Initialize with default user and templates
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "sarah.johnson",
      password: "password"
    };
    this.users.set(1, defaultUser);

    // Create default templates
    const defaultTemplates: Template[] = [
      {
        id: 2,
        name: "Assignment Help",
        type: "assignment_help",
        content: "Dear Parent,\n\nThank you for reaching out about the assignment. I understand your child might be finding it challenging.\n\n[Assignment specific guidance will be provided here]\n\nPlease don't hesitate to reach out if you have any other questions.\n\nBest regards,\n[Teacher Name]",
        language: "en",
        usageCount: 45,
        userId: 1,
        createdAt: new Date()
      },
      {
        id: 3,
        name: "Grade Explanation",
        type: "grade_inquiry",
        content: "Dear Parent,\n\nThank you for your inquiry about your child's grade.\n\n[Grade breakdown and explanation will be provided here]\n\nI'm happy to schedule a meeting to discuss this further if needed.\n\nBest regards,\n[Teacher Name]",
        language: "en",
        usageCount: 32,
        userId: 1,
        createdAt: new Date()
      },
      {
        id: 4,
        name: "Schedule Info",
        type: "schedule_question",
        content: "Dear Parent,\n\nThank you for your question about the schedule.\n\n[Schedule information will be provided here]\n\nPlease let me know if you need any clarification.\n\nBest regards,\n[Teacher Name]",
        language: "en",
        usageCount: 28,
        userId: 1,
        createdAt: new Date()
      },
      {
        id: 5,
        name: "Parent Communication",
        type: "parent_communication",
        content: "Dear Parent,\n\nThank you for reaching out.\n\n[Communication content will be provided here]\n\nI look forward to working together to support your child's education.\n\nBest regards,\n[Teacher Name]",
        language: "en",
        usageCount: 21,
        userId: 1,
        createdAt: new Date()
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });

    this.currentId = 6;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentId++;
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id, 
      createdAt: new Date(),
      userId: 1 // Default to user 1 for demo
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async getInquiriesByUser(userId: number): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).filter(inquiry => inquiry.userId === userId);
  }

  async getResponse(id: number): Promise<Response | undefined> {
    return this.responses.get(id);
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const id = this.currentId++;
    const response: Response = { 
      ...insertResponse, 
      id, 
      generatedAt: new Date(),
      sentAt: null
    };
    this.responses.set(id, response);
    return response;
  }

  async updateResponse(id: number, updateData: Partial<Response>): Promise<Response | undefined> {
    const response = this.responses.get(id);
    if (!response) return undefined;
    
    const updatedResponse = { ...response, ...updateData };
    this.responses.set(id, updatedResponse);
    return updatedResponse;
  }

  async getResponsesByInquiry(inquiryId: number): Promise<Response[]> {
    return Array.from(this.responses.values()).filter(response => response.inquiryId === inquiryId);
  }

  async getResponsesByUser(userId: number): Promise<Response[]> {
    const userInquiries = await this.getInquiriesByUser(userId);
    const inquiryIds = userInquiries.map(inquiry => inquiry.id);
    return Array.from(this.responses.values()).filter(response => 
      response.inquiryId && inquiryIds.includes(response.inquiryId)
    );
  }

  async getRecentResponses(userId: number, limit: number = 10): Promise<Response[]> {
    const responses = await this.getResponsesByUser(userId);
    return responses
      .sort((a, b) => (b.generatedAt?.getTime() || 0) - (a.generatedAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.currentId++;
    const template: Template = { 
      ...insertTemplate, 
      id, 
      usageCount: 0,
      userId: 1, // Default to user 1 for demo
      createdAt: new Date()
    };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: number, updateData: Partial<Template>): Promise<Template | undefined> {
    const template = this.templates.get(id);
    if (!template) return undefined;
    
    const updatedTemplate = { ...template, ...updateData };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async getTemplatesByUser(userId: number): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(template => template.userId === userId);
  }

  async getTemplatesByType(type: string, userId: number): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(template => 
      template.type === type && template.userId === userId
    );
  }

  async incrementTemplateUsage(id: number): Promise<void> {
    const template = this.templates.get(id);
    if (template) {
      template.usageCount = (template.usageCount || 0) + 1;
      this.templates.set(id, template);
    }
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = { 
      ...insertActivity, 
      id, 
      userId: 1, // Default to user 1 for demo
      createdAt: new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getActivitiesByUser(userId: number, limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
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

export const storage = new MemStorage();
