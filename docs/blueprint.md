# **App Name**: CriticalFirst

## Core Features:

- Patient Registration: Allow patient registration (or front-desk staff registration) with name, age, symptom description and optional vitals, generating a token number automatically. Registration must work fully offline.
- AI-Assisted Triage: Implement semantic understanding of symptom descriptions and automatically assign one of four priorities: Critical, High, Medium, Low, with online AI/ML-assisted triage and offline rule-based triage.
- Manual Override: Allow nurses/doctors to manually override priority, with the system keeping an audit log for overrides.
- Priority Queue Management: Implement a token-based queue with priority-aware sorting, where it is Priority first (Critical → Low) and FIFO within the same priority.
- Real-time Queue Reordering: Auto-reorder queues in real time when a new patient registers, a priority changes, or staff availability changes. Showing estimated wait time per patient and highlight CRITICAL patients.
- Offline Data Sync: Function fully offline for patient registration, token generation, local queue updates and local triage fallback. Automatically sync data to Firestore when connectivity is restored, resolving conflicts using Manual override > system decision; Older timestamp precedence.
- Admin Controls: Include admin controls to simulate patient surge and staff availability drop; the system will be scalable for multi-clinic support. Maintain correct prioritization, prevent queue collapse, protect critical patient flow. Includes alerts if critical patients wait too long.

## Style Guidelines:

- Primary color: Soft teal (#45B3A9), a calming and trustworthy hue for the app's main interface elements.
- Background color: Clean white (#FFFFFF) provides a neutral and professional backdrop.
- Accent color: Light blue (#A7D9ED) is used for interactive elements and highlights to maintain a sense of calm, while red (#FF4136) will only be used to display CRITICAL cases
- Headline font: 'Poppins', a geometric sans-serif font providing a precise and fashionable look.
- Body font: 'Inter', a grotesque sans-serif font, for displaying longer amounts of text.
- Use a set of consistent, minimalist icons sourced from a professional icon library. Ensure icons are easily recognizable and align with the app's calming aesthetic.
- Design a responsive, grid-based layout optimized for both desktop and tablet use. Use rounded cards with subtle shadows to create a sense of depth and visual appeal.
- Implement smooth micro-interactions such as hover effects, queue reorder animations, and subtle alerts. Animations should be used sparingly to enhance usability without overwhelming the user.