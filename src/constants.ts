export const TRUSTNET_SCHEMA = 'public'

export const COMPANIES_TABLES = {
  AUDIT: 'audit',
  INCIDENT: 'incident',
  MONITORED_DEVICE: 'monitored_device',
  INSIGHT: 'insight',
  TASK: 'task',
  NOTIFICATION: 'notification',
  SLA: 'sla',
  SOURCE_IP: 'source_ip',
  CONFIGURATION: 'configuration',
  IMAGE: 'image'
}

export const TRUSTNET_TABLES = {
  COMPANY: 'company',
  USERS: 'users',
  ADMIN_COMPANY: 'admin_company',
  IMAGE: 'image'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum IncidentStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in progress',
  WAITING = 'waiting',
  CLOSE = 'close'
}

export enum IncidentSeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum taskStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in progress',
  CLOSE = 'close'
}

export enum taskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum insightStatus {
  NEW_RECOMMENDATION = 'new recommendation',
  WAITING_FOR_WORK = 'waiting for work',
  AT_WORK = 'at work',
  FINISHED = 'finished'
}

export enum insightUserPreference {
  RECOMMENDED_FOR_YOU = 'recommended for you',
  INTERESTED = 'interested',
  WE_GOT_ONE = 'we got one',
  MAYBE_LATER = 'maybe later'
}

export enum deviceStatus {
  CONNECTED = 'connected',
  NOT_CONNECTED = 'not connected'
}

export enum notificationStatus {
  NEW_INCIDENT = 'new incident',
  NEW_TASK = 'new task',
  NEW_INSIGHT = 'new insight',
  INSIGHT_CHANGED = 'insight changed',
  INCIDENT_CHANGED = 'incident changed',
  TASK_CHANGED = 'task changed'
}

export enum SLASeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  INFO = 'info',
}