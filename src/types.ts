import { IncidentSeverity, IncidentStatus, insightStatus, taskStatus } from "../src/constants"

export interface IUser {
  id?: number
  firstName: string
  lastName: string
  username: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ICompany {
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
  title: string
  status: insightStatus
  priority?: string
  summary: string
  description: string
  is_relevant: boolean
  created: Date
}

export interface IIncident {
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
  created?: Date
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
}
