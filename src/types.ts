import { IncidentSeverity, IncidentStatus, insightStatus, taskStatus } from "../src/constants"

export interface IUser {
  id?: number
  company_id: number
  first_name: string
  last_name: string
  user_name: string
  email:string
  position?:string
  active?:boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface ICompany {
  api_key: string
  companyId: number
  id: number
  company_name: string,
  joining_date: Date,
  renew_date: Date,
  active: boolean,
  sector: string,
  country: string,
}
export interface ITask {
  id:number,
  status?: taskStatus
  priority?: string
  title: string
  summary: string
  description: string
  owner: string
  is_relevant: boolean
  created: Date
}

export interface IInsight {
  id:number
  title: string
  status: insightStatus
  priority?: string
  summary: string
  description: string
  is_relevant: boolean
  created: Date
}

export interface IImage {
  id:number
  key: string
  url?: string
  created_at: Date
  updated_at: Date
}

export interface IIncident {
  id:number
  external_id: number// for know only like jira ticket
  incident_name: string
  severity?: IncidentSeverity 
  status?: IncidentStatus 
  category_name?: string
  title: string
  summary?: string
  description?: string
  mitre_tactic?: string
  investigation?: string
  owner?: string
  origin?: string
  host_name?: string
  last_update?: Date
  renew_date?: Date
  source_user?: string
  destination_user?: string
  analyst_name?: string
  source_ip?: string
  destination_ip?: string
  source_geo?: string
  destination_geo?: string
  active?: boolean
  sector?: string
  sla_assign?: Date
  sla_initial_triage: Date
  sla_time_to_resolve: Date
  remediation_action:number
  created_at: Date
  updated_at: Date
}
export interface INotification {
  id?: number
  title: string
  description: string
  trigger: string
  created_at?: Date
  updated_at?: Date
}

export interface AuthInfo {
  exp: number // Expiration time
  nbf: number // Not before - identifies the time before which the JWT MUST NOT be accepted
  ver: string // 1.0
  iss: string // Issuer - identifies the principal that issued the JWT
  sub: string // Subject - identifies the principal that is the subject of the JWT
  aud: string // Audience - identifies the recipients that the JWT is intended for
  acr: string // Authentication Context Class Reference
  nonce: string // String value used to associate a Client session with an ID Token
  iat: number // Issued at - claim identifies the time at which the JWT was issued
  auth_time: number // Time when the End-User authentication occurred
  tid: string // Tenant id
  name: string // End-User's full name
  idp: string // Identity provider
  emails: string[]
  given_name: string
  family_name: string
  jobTitle: string
}