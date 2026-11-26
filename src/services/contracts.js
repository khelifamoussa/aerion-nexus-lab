/**
 * Provider-neutral contracts for the AERION backend.
 * Implementations must live server-side when they require secrets.
 */
export const ServiceStatus = Object.freeze({
  UNCONFIGURED: 'unconfigured',
  READY: 'ready',
  DEGRADED: 'degraded'
})

export class SimulationService {
  async submitCampaign(_spec) { throw new Error('Simulation adapter is not configured') }
  async getCampaign(_id) { throw new Error('Simulation adapter is not configured') }
}

export class EvidenceService {
  async registerArtifact(_artifact) { throw new Error('Evidence adapter is not configured') }
  async verifyIntegrity(_id) { throw new Error('Evidence adapter is not configured') }
}

export class AgentService {
  async runGovernedCycle(_input) { throw new Error('AI agent adapter is not configured') }
}

export class PublicationService {
  async generateDraft(_manuscript) { throw new Error('Document adapter is not configured') }
  async createSubmissionChecklist(_journal) { throw new Error('Journal adapter is not configured') }
}

export function platformCapabilities() {
  return {
    authentication: import.meta.env.VITE_AUTH_MODE || 'preview',
    simulation: ServiceStatus.UNCONFIGURED,
    evidenceStore: ServiceStatus.UNCONFIGURED,
    aiAgents: ServiceStatus.UNCONFIGURED,
    documentGeneration: ServiceStatus.UNCONFIGURED,
    journalSubmission: 'manual-only'
  }
}
