import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").default("teacher"), // teacher, admin, parent, student
  preferences: jsonb("preferences"), // theme, notifications, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  language: text("language").notNull(),
  detectedLanguage: text("detected_language"),
  studentId: integer("student_id").references(() => students.id),
  parentId: integer("parent_id").references(() => parents.id),
  userId: integer("user_id").references(() => users.id),
  priority: text("priority").default("normal"), // low, normal, high, urgent
  createdAt: timestamp("created_at").defaultNow(),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  inquiryId: integer("inquiry_id").references(() => inquiries.id),
  content: text("content").notNull(),
  language: text("language").notNull(),
  tone: text("tone").default("professional"), // formal, friendly, neutral, professional
  status: text("status").notNull().default("draft"), // draft, sent
  generatedAt: timestamp("generated_at").defaultNow(),
  sentAt: timestamp("sent_at"),
  responseTime: integer("response_time"), // in milliseconds
  attachments: text("attachments").array(), // attachment IDs
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  language: text("language").notNull(),
  usageCount: integer("usage_count").default(0),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced Personalization - Student/Parent Profiles
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  grade: text("grade").notNull(),
  studentId: text("student_id").unique(),
  parentId: integer("parent_id").references(() => users.id),
  teacherId: integer("teacher_id").references(() => users.id),
  subjects: text("subjects").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const parents = pgTable("parents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  preferredLanguage: text("preferred_language").default("en"),
  communicationPreferences: jsonb("communication_preferences"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Scheduled & Bulk Messaging
export const scheduledMessages = pgTable("scheduled_messages", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  recipients: jsonb("recipients"), // array of parent/student IDs
  scheduledFor: timestamp("scheduled_for").notNull(),
  status: text("status").default("scheduled"), // scheduled, sent, failed
  messageType: text("message_type").default("individual"), // individual, broadcast
  createdAt: timestamp("created_at").defaultNow(),
  sentAt: timestamp("sent_at"),
});

// Attachments & Resource Sharing
export const attachments = pgTable("attachments", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resourceLibrary = pgTable("resource_library", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  attachmentId: integer("attachment_id").references(() => attachments.id),
  category: text("category").notNull(),
  tags: text("tags").array(),
  teacherId: integer("teacher_id").references(() => users.id),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Smart Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // follow_up, urgent_message, system_alert
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedId: integer("related_id"), // ID of related inquiry/response
  priority: text("priority").default("normal"), // low, normal, high, urgent
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const followUpReminders = pgTable("follow_up_reminders", {
  id: serial("id").primaryKey(),
  inquiryId: integer("inquiry_id").references(() => inquiries.id),
  reminderDate: timestamp("reminder_date").notNull(),
  status: text("status").default("pending"), // pending, sent, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Improvement Tools
export const sentimentAnalysis = pgTable("sentiment_analysis", {
  id: serial("id").primaryKey(),
  inquiryId: integer("inquiry_id").references(() => inquiries.id),
  sentiment: text("sentiment").notNull(), // positive, negative, neutral, urgent
  confidence: integer("confidence"), // 0-100
  keywords: text("keywords").array(),
  flagged: boolean("flagged").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// FAQ & Knowledge Base
export const faqItems = pgTable("faq_items", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  language: text("language").default("en"),
  isActive: boolean("is_active").default(true),
  viewCount: integer("view_count").default(0),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const knowledgeBase = pgTable("knowledge_base", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  language: text("language").default("en"),
  isPublished: boolean("is_published").default(false),
  viewCount: integer("view_count").default(0),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Communication Insights & Reports
export const communicationMetrics = pgTable("communication_metrics", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").references(() => users.id),
  date: timestamp("date").notNull(),
  totalInquiries: integer("total_inquiries").default(0),
  totalResponses: integer("total_responses").default(0),
  avgResponseTime: integer("avg_response_time"), // in minutes
  languagesUsed: text("languages_used").array(),
  sentimentBreakdown: jsonb("sentiment_breakdown"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Data Privacy & Permissions
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  resource: text("resource").notNull(), // students, parents, templates, etc.
  action: text("action").notNull(), // read, write, delete
  granted: boolean("granted").default(false),
  grantedBy: integer("granted_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  resourceId: integer("resource_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // response_sent, template_created, response_translated, etc.
  description: text("description").notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema types for all tables
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export const insertParentSchema = createInsertSchema(parents).omit({
  id: true,
  createdAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  generatedAt: true,
  sentAt: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
  usageCount: true,
  userId: true,
});

export const insertScheduledMessageSchema = createInsertSchema(scheduledMessages).omit({
  id: true,
  createdAt: true,
  sentAt: true,
});

export const insertAttachmentSchema = createInsertSchema(attachments).omit({
  id: true,
  createdAt: true,
});

export const insertResourceLibrarySchema = createInsertSchema(resourceLibrary).omit({
  id: true,
  createdAt: true,
  usageCount: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertFaqItemSchema = createInsertSchema(faqItems).omit({
  id: true,
  createdAt: true,
  viewCount: true,
});

export const insertKnowledgeBaseSchema = createInsertSchema(knowledgeBase).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
  userId: true,
});

// Types for all tables
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Parent = typeof parents.$inferSelect;
export type InsertParent = z.infer<typeof insertParentSchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type Response = typeof responses.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export type ScheduledMessage = typeof scheduledMessages.$inferSelect;
export type InsertScheduledMessage = z.infer<typeof insertScheduledMessageSchema>;

export type Attachment = typeof attachments.$inferSelect;
export type InsertAttachment = z.infer<typeof insertAttachmentSchema>;

export type ResourceLibrary = typeof resourceLibrary.$inferSelect;
export type InsertResourceLibrary = z.infer<typeof insertResourceLibrarySchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type FollowUpReminder = typeof followUpReminders.$inferSelect;
export type SentimentAnalysis = typeof sentimentAnalysis.$inferSelect;

export type FaqItem = typeof faqItems.$inferSelect;
export type InsertFaqItem = z.infer<typeof insertFaqItemSchema>;

export type KnowledgeBase = typeof knowledgeBase.$inferSelect;
export type InsertKnowledgeBase = z.infer<typeof insertKnowledgeBaseSchema>;

export type CommunicationMetrics = typeof communicationMetrics.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
