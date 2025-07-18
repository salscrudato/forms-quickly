# Forms Quickly - AI Documentation

## Application Overview
React/Vite web app for rapid form creation and management. Firebase backend with modern UI/UX focus.

## Tech Stack
- **Frontend**: React 19.1.0, Vite 7.0.4, Chakra UI
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **Routing**: React Router DOM 7.7.0
- **Styling**: Chakra UI component library

## Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── contexts/           # React contexts
├── firebase.js         # Firebase configuration
├── App.jsx            # Main app component
└── main.jsx           # Entry point
```

## Architecture Patterns
- **Component-based**: Modular, reusable components
- **Context API**: Global state management
- **Custom hooks**: Business logic abstraction
- **Route protection**: Auth-based navigation guards

## Design System
### Colors
- Primary: Blue scale (50-900)
- Gray: Neutral scale (50-900)
- Semantic: Success, warning, error states

### Components
- `.btn-primary`: Primary action buttons
- `.btn-secondary`: Secondary action buttons
- `.input-field`: Form input styling
- `.card`: Content containers
- `.form-container`: Form wrappers

### Animations
- `fade-in`: 0.5s ease-in-out
- `slide-up`: 0.3s ease-out
- `bounce-subtle`: 0.6s ease-in-out

## Routing Structure
- `/` - Landing page
- `/login` - Authentication
- `/register` - User registration
- `/dashboard` - Main app interface
- `/forms` - Form management
- `/forms/:id` - Individual form

## Firebase Configuration
- Auth: Email/password authentication
- Firestore: Document database
- Storage: File uploads
- Functions: Server-side logic

## Development Guidelines
### Component Creation
1. Use functional components with hooks
2. Implement proper TypeScript (when added)
3. Follow naming conventions: PascalCase for components
4. Include PropTypes or TypeScript interfaces

### Styling
1. Use Tailwind utility classes
2. Custom components in @layer components
3. Responsive design mobile-first
4. Consistent spacing scale

### State Management
1. Local state: useState for component-specific
2. Global state: Context API for app-wide
3. Server state: React Query (when added)

## Common Patterns
### Form Handling
```jsx
const [formData, setFormData] = useState({});
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

### Firebase Operations
```jsx
import { auth, db } from '../firebase';
// Use try/catch for all Firebase operations
```

### Navigation
```jsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
```

## Performance Optimizations
- Lazy loading for routes
- Image optimization
- Bundle splitting
- Memoization for expensive operations

## Testing Strategy
- Unit tests: Component logic
- Integration tests: User flows
- E2E tests: Critical paths

## Deployment
- Build: `npm run build`
- Preview: `npm run preview`
- Firebase hosting for production

## Security Considerations
- Firebase security rules
- Input validation
- XSS prevention
- CSRF protection

## Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

## Browser Support
- Modern browsers (ES2020+)
- Mobile responsive
- Progressive enhancement

## Environment Variables
- Firebase config in environment files
- Development vs production settings

## Changelog
### v0.1.0 (Current)
- Initial setup with React/Vite
- Firebase integration
- Tailwind CSS design system
- Login page with modern UI
- Basic routing structure

## Next Steps
1. Complete authentication flow
2. Dashboard implementation
3. Form builder interface
4. Data persistence
5. User management
6. Advanced form features

## AI Assistant Notes
- Prioritize UI/UX in all implementations
- Use Tailwind utility classes consistently
- Implement proper error handling
- Follow React best practices
- Maintain component modularity
- Focus on accessibility
- Keep code clean and well-commented
