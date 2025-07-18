export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  FORMS: '/forms',
  FORM_DETAIL: '/forms/:id',
  FORM_UPLOAD: '/forms/upload',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
