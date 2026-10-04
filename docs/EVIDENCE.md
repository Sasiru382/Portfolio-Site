# Evidence and editorial boundaries

Authority order: current user brief for technical direction and skills → user-confirmed degree → repository implementation for project details → historical portfolio/profile for identity and contact only. Old undergraduate phrasing is not reused.

| Published area | Evidence | Limit |
|---|---|---|
| Name, email, Sri Lanka | Original index.html and public Sasiru382 profile README | Home address and phone deliberately removed |
| Computer Science degree | User explicitly confirms it in the brief | No institution, classification or dates asserted |
| Cloud / DevOps / networking / security toolkit | User-provided technical profile | No expertise percentages, certification or employment claim |
| API + Azure workflow | form-demo-backend @ e60d98c260113422b218145d1957adcdd40768bf: index.js, schema.js, .github/workflows/main_demo-backend-form.yml | Workflow configuration verified, actual deployment success not verified |
| Python / MySQL student system | SQL_Plus_Python_Project @ e2c2fd52819ffe55a73a6f21a41500927befde1f: StudentDataSystem.py | Learning project; interpolation/root credentials called out as limitations |
| Java consultation system | OOP_CW_Java @ 3fc3b009ef35e2e9b4a8cf1d0f9595cf103c0d0c: domain models, table models, Driver.java, test file | Coursework, no clinical/production/compliance claim; test existence not test success |
| LinkedIn | Direct www.linkedin.com/in/sasiru-vishmika link in public profile README corroborates original redirected URL | Automated request blocked (999); user should manually confirm |

Public repositories and files were retrieved through GitHub API/raw endpoints; website source links are pinned to the reviewed commit. `repository-evidence.json` records research provenance without duplicating source code, credentials, private addresses or binary data. Published source links are also in `src/content/projects.ts`.

## Deliberately not published as achievements
- Kamus master @ 32596e1038eadd1392e91cf32ed8e238263c4119 is a fork of **Soluto/kamus**. Its Kubernetes secret-encryption architecture, KMS providers, Helm and threat model belong to upstream authors. Public branches only expose master; no Kamus26 modernization evidence was found. Do not market the original system as Sasiru's work. A future case study needs the actual modernization repository/branch and a diff separating contributions.
- R5D5-Project identifies Sasiru as a team member, not sole author. A usable individual case study needs responsibility attribution and model evidence, so it is not selected.
- Broad examples in the brief (AKS, Helm, Key Vault private networking, GCP voice systems, AI agent infrastructure on Azure, Flutter and automation) are not sufficient to invent architecture, deployed outcomes or metrics. They inform the technical direction, not fictional case studies.
- Historical resume Google Drive viewer returns HTTP 200 but freshness is unknown. The site offers an email-based resume request rather than pretending the viewer is a verified current download.

## Security notes on historical repositories
The API repository tracks an .env file; its contents were not copied or printed. Review/rotate any credentials if that file contains secrets. The Java repository tracks a keystore artifact and local data files; verify safety and remove sensitive data before further publication. SQL and API demos have clearly documented security gaps. This modernization does not change those separate repositories or claim to fix them.
