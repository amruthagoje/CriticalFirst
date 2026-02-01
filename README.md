🏥 CriticalFirst

CriticalFirst is a scalable, Firebase-powered patient queue and triage optimization system designed to manage high patient inflow in clinics and hospitals while ensuring accurate prioritization of critical cases.

The system leverages token-based queueing, rule-driven triage scoring, and real-time data synchronization to dynamically adapt to changing operational conditions such as patient surges and reduced staff availability.

🎯 Project Goals

Implement a priority-aware patient queue system

Ensure critical-condition patients are served first

Maintain queue stability during sudden load increases

Support staff shortage scenarios through adaptive scheduling

Provide an offline-first, fault-tolerant architecture

⚙️ System Functionality

This build includes:

Patient registration with automatic token generation

Rule-based triage scoring using symptoms and urgency levels

Priority queue management with real-time updates

Dynamic queue reordering based on system mutations:

Mutation A: Patient volume doubling

Mutation B: 40% reduction in staff availability

Firebase Firestore for real-time, consistent state management

Offline data persistence with background synchronization

🧠 Design Rationale

Traditional clinical queue systems often rely on static ordering or manual triage, which becomes unreliable during peak loads.
CriticalFirst addresses this limitation by introducing a deterministic, data-driven triage mechanism that preserves prioritization correctness under stress conditions.

The project models real-world healthcare constraints and demonstrates how cloud-native technologies can be applied to critical infrastructure systems.

🌐 Use Cases & Extensibility

This system can be adopted or extended for:

OPD and clinic queue digitization

Emergency triage simulations

Healthcare system prototyping

Academic and hackathon demonstrations

Future enhancements may include:

AI-assisted triage prediction models

Role-based dashboards for medical staff

Analytics and patient flow visualization

Integration with hospital information systems (HIS)

🛠️ Tech Stack

Frontend: Next.js (React), TypeScript

Styling: Tailwind CSS

Backend / Database: Firebase Firestore

Hosting: Firebase Hosting

Architecture: Offline-first, real-time sync
