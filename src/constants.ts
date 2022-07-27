export const COMPANIES_TABLES = {
  AUDIT: 'audit',
  INCIDENT: 'incident',
  MONITORED_DEVICE: 'monitored_device',
  INSIGHT: 'insight',
  TASK: 'task'
}

export const TRUSTNET_TABLES = {
  COMPANY: 'company',
  USERS: 'users',
  ADMIN_COMPANY: 'admin_company',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum IncidentStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in progress',
  WAITING = 'waiting',
  CLOSE = 'close',
}

export enum IncidentSeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum taskStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in progress',
  CLOSE = 'close',
}

export enum insightStatus {
  WAITING_FOR_WORK = 'waiting for work',
  RECOMMENDED_FOR_YOU = 'recommended for you',
  AT_WORK = 'at work',
  FINISHED = 'finished',
}

export enum deviceStatus {
  CONNECTED = 'connected',
  NOT_CONNECTED = 'not connected',
}