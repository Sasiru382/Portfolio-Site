export type Project = {
  slug: string; title: string; category: string; summary: string; scope: string;
  stack: string[]; flow: string[]; problem: string; architecture: string; built: string;
  challenges: string; security: string; result: string; repo: string;
  sources: { label: string; url: string }[];
};
const backend = 'https://github.com/Sasiru382/form-demo-backend/blob/e60d98c260113422b218145d1957adcdd40768bf/';
const sql = 'https://github.com/Sasiru382/SQL_Plus_Python_Project/blob/e2c2fd52819ffe55a73a6f21a41500927befde1f/';
const java = 'https://github.com/Sasiru382/OOP_CW_Java/blob/3fc3b009ef35e2e9b4a8cf1d0f9595cf103c0d0c/w1899317/Project%20Folder/Application/';
export const projects: Project[] = [
  {
    slug: 'api-delivery-workflow', title: 'From API to Azure deployment', category: 'APPLICATION / DELIVERY',
    summary: 'A Node.js data API paired with a GitHub Actions workflow targeting Azure App Service. Connecting application code to delivery infrastructure.',
    scope: 'Independent demo · source and workflow reviewed; live deployment not verified',
    stack: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'GitHub Actions', 'Azure App Service'],
    flow: ['GitHub source', 'Build artifact', 'Azure Web App'],
    problem: 'Expose student records through HTTP operations and define a repeatable path from source changes to an Azure-hosted application.',
    architecture: 'Express routes handle reads, inserts, updates and deletes. Mongoose models connect the API to MongoDB. A separate two-job GitHub Actions workflow installs the Node application, uploads an artifact and uses azure/webapps-deploy to target Azure App Service.',
    built: 'The repository contains the CRUD routes, student model, environment-based database configuration and a build/deploy workflow. This case study describes the checked-in implementation—not a claim of production operation or a successful deployment run.',
    challenges: 'The API and deployment have different failure boundaries: invalid record identifiers, database connectivity, artifact packaging and publish-profile configuration. The source has explicit handling for several database operations, but insertion errors and consistent update-result handling remain improvement areas.',
    security: 'The demo uses permissive CORS and has no authentication or authorization layer. The schema includes a Password field without evidenced hashing. These are limitations, not secure production features. Before reuse: remove inappropriate password storage, validate inputs, restrict origins, rotate any exposed credentials, isolate database access and replace long-lived deployment credentials with workload identity where supported.',
    result: 'A concrete application-to-cloud delivery example is present in source. The workflow illustrates build/deploy separation and artifact handoff; repository configuration alone does not verify uptime, production use or a completed deployment. The next step would be integration tests and a hardened identity/network configuration.',
    repo: 'https://github.com/Sasiru382/form-demo-backend',
    sources: [{ label: 'API routes', url: backend + 'index.js' }, { label: 'Data model', url: backend + 'schema.js' }, { label: 'Azure deployment workflow', url: backend + '.github/workflows/main_demo-backend-form.yml' }],
  },
  {
    slug: 'student-data-system', title: 'Relational data, practical automation', category: 'PYTHON / DATA SYSTEMS',
    summary: 'A command-line student and attendance system backed by MySQL. An early exploration of persistent data, record relationships and operational assumptions.',
    scope: 'Learning project · Python implementation reviewed',
    stack: ['Python', 'MySQL', 'mysql-connector'], flow: ['CLI input', 'Python operations', 'MySQL tables'],
    problem: 'Maintain student details and dated attendance records in a persistent store, instead of losing state when a command-line session ends.',
    architecture: 'A Python command loop opens a local MySQL connection, creates the database/tables when needed and performs CRUD operations. Student records use a primary identifier; attendance uses the combination of student identifier and date as a composite key.',
    built: 'Implemented console-driven student entry, updates, deletion, attendance entry and record lookup. The program reads the existing student count on startup, commits changes and closes the cursor on exit. The source documents its dependency on a running local database.',
    challenges: 'Keeping related records consistent matters when changing an identifier or deleting a student. The implementation manually updates both tables. Its small-record limit, broad exception handling and string-based dates make it a learning tool rather than a general-purpose service.',
    security: 'Queries interpolate user input and the connection assumes a local root account with an empty password. The source therefore does not demonstrate SQL-injection resistance or least privilege. A production redesign should use parameterized queries, a scoped database user, secret configuration and transactional relationship handling. No public network deployment is evidenced.',
    result: 'The repository demonstrates Python-to-database integration, persistence and relational keys. Reviewing the implementation exposes why parameterization, schema constraints and explicit connection management matter. No adoption or performance metrics are claimed.',
    repo: 'https://github.com/Sasiru382/SQL_Plus_Python_Project',
    sources: [{ label: 'Student and attendance implementation', url: sql + 'StudentDataSystem.py' }, { label: 'Project scope', url: sql + 'README.md' }],
  },
  {
    slug: 'consultation-management', title: 'Modeling a consultation workflow', category: 'JAVA / SOFTWARE FOUNDATIONS',
    summary: 'A desktop consultation-management coursework project with object-oriented entities, Swing table models and an included JUnit test suite.',
    scope: 'Academic project · implementation inspected; tests not executed in this review',
    stack: ['Java', 'Swing', 'JUnit'], flow: ['Swing interface', 'Domain objects', 'Local application state'],
    problem: 'Represent doctors, patients and consultations in an application with a usable appointment-booking interface.',
    architecture: 'Doctor and Patient inherit shared personal attributes from a base class. Consultation objects represent bookings. Swing table-model adapters expose domain data to the interface, and a manager interface separates management operations from the entity model.',
    built: 'The checked-in project includes domain classes, doctor/patient tables, a desktop driver with consultation-booking controls and an accompanying manager test file. The interface provides sorting and an availability-check action. This is coursework, not a deployed clinical platform.',
    challenges: 'Booking requires coordination between a selected doctor, date/time validation and existing consultations. Table models translate domain objects into presentation without requiring the entities themselves to be UI components. A future refactor should further separate event handling from booking rules.',
    security: 'Doctor/patient data and a keystore artifact are present in the original repository. Their presence does not establish safe key management or regulatory compliance. Sensitive data should not be checked into source control; production handling would need verified storage protection, access controls, retention policy and reviewed cryptography. No clinical deployment or cloud network is claimed.',
    result: 'A tangible object-oriented desktop application illustrates modeling and presentation boundaries. A JUnit test suite is included in the source, but this portfolio review did not execute it or establish its coverage. The enduring lesson is to make domain rules independently testable.',
    repo: 'https://github.com/Sasiru382/OOP_CW_Java',
    sources: [{ label: 'Consultation model', url: java + 'src/Consultation.java' }, { label: 'Desktop workflow', url: java + 'src/Driver.java' }, { label: 'Doctor table adapter', url: java + 'src/DoctorTableModel.java' }, { label: 'Included tests', url: java + 'Test/WestminsterSkinConsultationManagerTest.java' }],
  },
];
