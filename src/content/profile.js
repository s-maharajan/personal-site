// Career profile for the About page, drawn from my CV. Employer and client
// names, contact details and figures are deliberately left out.
export const profile = {
  years: 16,
  intro: [
    "I have spent 16 years in integration engineering across banking and retail: messaging, file transfer, APIs and events, and the platforms they run on.",
    "I help move large middleware estates without stopping the business. That means treating migration as an engineering discipline: understand the landscape, make the dependencies visible, and change one reliable seam at a time.",
    "Right now I focus on practical agents for the unglamorous, high-leverage work: discovery, mapping and repeatable delivery. Let the agents gather the evidence and do the grunt work; leave judgement with the people who own the system.",
  ],
  // AI first, then the rest.
  focus: [
    ["AI in engineering and operations", "Bringing coding agents into delivery: custom agents for code review, security audit and migration, and LLM-assisted incident triage."],
    ["Integration", "Messaging, file transfer, APIs and events with IBM MQ and ACE, MuleSoft, Kafka, Azure Service Bus and Apache Camel."],
    ["Cloud and migration", "Legacy-to-cloud moves on Azure and AKS, one reliable seam at a time, with Terraform and GitHub Actions."],
    ["Security and DevSecOps", "Supply-chain security, code scanning and repository health across an estate, with GHAS, Snyk and Semgrep, OAuth2 and mTLS."],
    ["Observability", "One view of the health of every platform and critical flow, with Dynatrace and New Relic."],
  ],
  highlights: [
    "Led the adoption of GitHub Copilot and agentic AI in engineering, including custom agents for code review, security audit and migration, and a pilot of LLM-assisted incident triage.",
    "Built self-serve integration patterns on an internal developer platform, so delivery teams provision MQ, managed file transfer and Azure Service Bus themselves.",
    "Led integration design and delivery for a data-centre exit to Azure.",
    "Led a MuleSoft Enterprise to Community migration that removed enterprise licence costs.",
    "Built a control-tower dashboard that scores repository health across an integration estate, and introduced DORA metrics.",
    "Key engineer on a legacy-to-modern core banking migration, recognised with a client contribution award.",
  ],
  timeline: [
    ["2024 – now", "Principal software engineer, enterprise integration", "Retail"],
    ["2021 – 2024", "Integration architect", "Retail"],
    ["2017 – 2021", "Engineering lead", "Retail"],
    ["2013 – 2017", "Senior software engineer", "Banking"],
    ["2010 – 2013", "System analyst", "Banking"],
  ],
  certifications: [
    ["AI Fluency: Framework & Foundations", "Anthropic"],
    ["MuleSoft Certified Integration Architect", "MuleSoft, Mule 4"],
    ["Azure Architect Technologies (AZ-303)", "Microsoft"],
    ["IBM Certified Solution Architect", "IBM, Cloud Pak for Integration"],
    ["MongoDB SI Associate", "MongoDB"],
    ["Sun Certified Java Professional", "Sun Microsystems"],
  ],
  openSource: [
    {
      name: "copilot-sessions",
      url: "https://github.com/smaharajan/copilot-sessions",
      description: "A terminal app to search, inspect and resume GitHub Copilot CLI sessions. Read-only and fully local.",
      stack: "Python · Homebrew",
    },
  ],
};
