# Production Management System - Frontend

A complete Angular 21 standalone frontend for a Production Management System that connects to a Spring Boot REST API.

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/           # Entity models
│   │   │   ├── produit.model.ts
│   │   │   ├── machine.model.ts
│   │   │   ├── technicien.model.ts
│   │   │   ├── maintenance.model.ts
│   │   │   └── ordre-fabrication.model.ts
│   │   └── services/         # API services
│   │       ├── produit.service.ts
│   │       ├── machine.service.ts
│   │       ├── technicien.service.ts
│   │       ├── maintenance.service.ts
│   │       └── ordre-fabrication.service.ts
│   ├── shared/
│   │   └── material.module.ts  # Material module with all components
│   ├── layout/
│   │   ├── layout.component.ts  # Main layout with sidebar
│   │   └── dashboard.component.ts
│   ├── features/
│   │   ├── produits/
│   │   │   ├── produit-list.component.ts
│   │   │   └── produit-form.component.ts
│   │   ├── machines/
│   │   │   ├── machine-list.component.ts
│   │   │   └── machine-form.component.ts
│   │   ├── techniciens/
│   │   │   ├── technicien-list.component.ts
│   │   │   └── technicien-form.component.ts
│   │   ├── maintenances/
│   │   │   ├── maintenance-list.component.ts
│   │   │   └── maintenance-form.component.ts
│   │   └── ordres-fabrication/
│   │       ├── ordre-fabrication-list.component.ts
│   │       └── ordre-fabrication-form.component.ts
│   ├── app.config.ts        # Application configuration
│   ├── app.routes.ts        # Route definitions
│   ├── app.ts               # Root component
│   └── app.html
├── environments/
│   └── environment.ts       # Environment configuration
└── styles.scss              # Global styles
```

## Key Features

### 1. Core Models
- **Produit**: id, nom, type, stock, fournisseur
- **Machine**: id, nom, etat, maintenanceProchaine
- **Technicien**: id, nom, competences, machineAssignee
- **Maintenance**: id, machine, technicien, date, type
- **OrdreFabrication**: id, produit, quantite, date, machine, statut

### 2. Services
Each entity has a dedicated service with the following methods:
- `getAll()`: Get all records
- `getById(id)`: Get a single record by ID
- `create(obj)`: Create a new record
- `update(id, obj)`: Update an existing record
- `delete(id)`: Delete a record

All services connect to: `http://localhost:8080/api`

### 3. User Interface

#### Layout
- **Sidebar Navigation**: Links to all entity management pages
- **Top Toolbar**: Displays "Gestion de Production" title
- **Main Content Area**: Router outlet for page content

#### Dashboard
Shows count cards for each entity:
- Produits
- Machines
- Techniciens
- Maintenances
- Ordres de Fabrication

#### Entity Management Pages
Each entity has:
- **List Component**: MatTable displaying all records with:
  - All entity properties
  - Edit button
  - Delete button
- **Form Component**: MatDialog with reactive form for:
  - Creating new records
  - Editing existing records

### 4. Angular Material Components
Integrated Material components:
- MatTableModule
- MatButtonModule
- MatIconModule
- MatFormFieldModule
- MatInputModule
- MatDialogModule
- MatSnackBarModule
- MatToolbarModule
- MatSidenavModule
- MatListModule
- MatCardModule
- MatSelectModule
- MatDatepickerModule
- MatNativeDateModule

### 5. Technology Stack
- **Framework**: Angular 21
- **Language**: TypeScript 5.9
- **State Management**: Angular Signals
- **Forms**: Reactive Forms
- **HTTP**: Angular HttpClient
- **UI Components**: Angular Material
- **Styling**: SCSS

## Getting Started

### Prerequisites
- Node.js 18+
- npm 8+
- Spring Boot API running on `http://localhost:8080`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build

# Run tests
npm test
```

The application will be available at `http://localhost:4200`

## API Endpoints

### Base URL
`http://localhost:8080/api`

### Endpoints Used
- `GET/POST /produits` - Product management
- `GET/POST /machines` - Machine management
- `GET/POST /techniciens` - Technician management
- `GET/POST /maintenances` - Maintenance management
- `GET/POST /ordres-fabrication` - Manufacturing orders

### CRUD Operations
Each entity supports standard REST operations:
- `GET /{entity}` - Get all records
- `GET /{entity}/{id}` - Get single record
- `POST /{entity}` - Create new record
- `PUT /{entity}/{id}` - Update record
- `DELETE /{entity}/{id}` - Delete record

## Best Practices Implemented

✅ Standalone Components (no NgModule)
✅ OnPush Change Detection Strategy
✅ Reactive Forms with strong typing
✅ Signals for local state management
✅ Service-based architecture
✅ Proper dependency injection
✅ Error handling with snackbars
✅ Responsive UI with Material Design
✅ Lazy loading of feature routes
✅ Type-safe HTTP requests

## Customization

### Adding New Entity
1. Create model in `src/app/core/models/{entity}.model.ts`
2. Create service in `src/app/core/services/{entity}.service.ts`
3. Create feature components in `src/app/features/{entities}/`
4. Add route in `app.routes.ts`
5. Add navigation link in `layout.component.ts`

### Modifying API URL
Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  apiUrl: 'http://your-api-url/api'
};
```

### Changing Material Theme
Edit `src/styles.scss` to customize Angular Material theme colors.

## Troubleshooting

### CORS Issues
If experiencing CORS errors, configure your Spring Boot API to allow requests from `http://localhost:4200`

### HTTP Interceptor
To add global error handling, create an HTTP interceptor:
1. Create `src/app/core/interceptors/error.interceptor.ts`
2. Provide it in `app.config.ts`

## License
MIT
