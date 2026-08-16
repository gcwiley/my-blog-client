import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

// import auth service
import { AuthService } from './auth.service';

// --- helpers ---

function makeMockJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

const FUTURE_EXP = Math.floor(Date.now() / 1000) + 3600;
const PAST_EXP = Math.floor(Date.now() / 1000) - 3600;

const MOCK_USER = { email: 'test@example.com', username: 'testuser' };
const VALID_TOKEN = makeMockJwt({ ...MOCK_USER, exp: FUTURE_EXP });
const EXPIRED_TOKEN = makeMockJwt({ ...MOCK_USER, exp: PAST_EXP });

const TOKEN_KEY = 'my_blog_jwt_token';
const USERNAME_KEY = 'my_blog_username';

// --- suite ---

describe('AuthService', () => {
  let httpTesting: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    // AuthService is injected per-test so localStorage state is read at construction time
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  // --- initialization ---

  describe('initialization', () => {
    it('is unauthenticated when no token exists', () => {
      const service = TestBed.inject(AuthService);
      let isAuth: boolean | undefined;
      service.isAuthenticated$.subscribe((v) => (isAuth = v));
      expect(isAuth).toBe(false);
    });

    it('is unauthenticated when token is expired', () => {
      localStorage.setItem(TOKEN_KEY, EXPIRED_TOKEN);
      const service = TestBed.inject(AuthService);
      let isAuth: boolean | undefined;
      service.isAuthenticated$.subscribe((v) => (isAuth = v));
      expect(isAuth).toBe(false);
    });

    it('is authenticated when a valid token exists', () => {
      localStorage.setItem(TOKEN_KEY, VALID_TOKEN);
      const service = TestBed.inject(AuthService);
      let isAuth: boolean | undefined;
      service.isAuthenticated$.subscribe((v) => (isAuth = v));
      expect(isAuth).toBe(true);
    });

    it('emits null for userEmail$ when no valid token', () => {
      const service = TestBed.inject(AuthService);
      let email: string | null | undefined;
      service.userEmail$.subscribe((v) => (email = v));
      expect(email).toBeNull();
    });

    it('emits email from token on userEmail$', () => {
      localStorage.setItem(TOKEN_KEY, VALID_TOKEN);
      const service = TestBed.inject(AuthService);
      let email: string | null | undefined;
      service.userEmail$.subscribe((v) => (email = v));
      expect(email).toBe(MOCK_USER.email);
    });

    it('emits username from token on username$', () => {
      localStorage.setItem(TOKEN_KEY, VALID_TOKEN);
      const service = TestBed.inject(AuthService);
      let username: string | null | undefined;
      service.username$.subscribe((v) => (username = v));
      expect(username).toBe(MOCK_USER.username);
    });
  });

  // --- getToken ---

  describe('getToken()', () => {
    it('returns null when no token is stored', () => {
      const service = TestBed.inject(AuthService);
      expect(service.getToken()).toBeNull();
    });

    it('returns the stored token', () => {
      localStorage.setItem(TOKEN_KEY, VALID_TOKEN);
      const service = TestBed.inject(AuthService);
      expect(service.getToken()).toBe(VALID_TOKEN);
    });
  });

  // --- signInUser ---

  describe('signInUser()', () => {
    it('POSTs to /api/auth/signin with credentials', () => {
      const service = TestBed.inject(AuthService);
      service.signInUser('testuser', 'password').subscribe();

      const req = httpTesting.expectOne('/api/auth/signin');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        username: 'testuser',
        password: 'password',
      });
      req.flush({ token: VALID_TOKEN, user: MOCK_USER });
    });

    it('stores the token in localStorage on success', () => {
      const service = TestBed.inject(AuthService);
      service.signInUser('testuser', 'password').subscribe();

      httpTesting
        .expectOne('/api/auth/signin')
        .flush({ token: VALID_TOKEN, user: MOCK_USER });
      expect(localStorage.getItem(TOKEN_KEY)).toBe(VALID_TOKEN);
    });

    it('stores the username in localStorage on success', () => {
      const service = TestBed.inject(AuthService);
      service.signInUser('testuser', 'password').subscribe();

      httpTesting
        .expectOne('/api/auth/signin')
        .flush({ token: VALID_TOKEN, user: MOCK_USER });
      expect(localStorage.getItem(USERNAME_KEY)).toBe(MOCK_USER.username);
    });

    it('emits true on isAuthenticated$ after sign in', () => {
      const service = TestBed.inject(AuthService);
      let isAuth: boolean | undefined;
      service.isAuthenticated$.subscribe((v) => (isAuth = v));

      service.signInUser('testuser', 'password').subscribe();
      httpTesting
        .expectOne('/api/auth/signin')
        .flush({ token: VALID_TOKEN, user: MOCK_USER });

      expect(isAuth).toBe(true);
    });

    it('emits the user email on userEmail$ after sign in', () => {
      const service = TestBed.inject(AuthService);
      let email: string | null | undefined;
      service.userEmail$.subscribe((v) => (email = v));

      service.signInUser('testuser', 'password').subscribe();
      httpTesting
        .expectOne('/api/auth/signin')
        .flush({ token: VALID_TOKEN, user: MOCK_USER });

      expect(email).toBe(MOCK_USER.email);
    });
  });

  // --- registerNewUser ---

  describe('registerNewUser()', () => {
    it('POSTs to /api/auth/register with credentials', () => {
      const service = TestBed.inject(AuthService);
      service
        .registerNewUser('testuser', 'test@example.com', 'password')
        .subscribe();

      const req = httpTesting.expectOne('/api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      });
      req.flush({ token: VALID_TOKEN, user: MOCK_USER });
    });

    it('stores token and emits authenticated state on success', () => {
      const service = TestBed.inject(AuthService);
      let isAuth: boolean | undefined;
      service.isAuthenticated$.subscribe((v) => (isAuth = v));

      service
        .registerNewUser('testuser', 'test@example.com', 'password')
        .subscribe();
      httpTesting
        .expectOne('/api/auth/register')
        .flush({ token: VALID_TOKEN, user: MOCK_USER });

      expect(localStorage.getItem(TOKEN_KEY)).toBe(VALID_TOKEN);
      expect(isAuth).toBe(true);
    });
  });

  // --- forgotPassword ---

  describe('forgotPassword()', () => {
    it('POSTs to /api/auth/forgot-password with email', () => {
      const service = TestBed.inject(AuthService);
      service.forgotPassword('test@example.com').subscribe();

      const req = httpTesting.expectOne('/api/auth/forgot-password');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'test@example.com' });
      req.flush(null);
    });
  });

  // --- resetPassword ---

  describe('resetPassword()', () => {
    it('POSTs to /api/auth/reset-password with token and new password', () => {
      const service = TestBed.inject(AuthService);
      service.resetPassword('reset-token-abc', 'newpassword').subscribe();

      const req = httpTesting.expectOne('/api/auth/reset-password');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        token: 'reset-token-abc',
        password: 'newpassword',
      });
      req.flush(null);
    });
  });

  // --- signOutUser ---

  describe('signOutUser()', () => {
    it('removes the token from localStorage', () => {
      localStorage.setItem(TOKEN_KEY, VALID_TOKEN);
      const service = TestBed.inject(AuthService);
      service.signOutUser();
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    });

    it('removes the username from localStorage', () => {
      localStorage.setItem(TOKEN_KEY, VALID_TOKEN);
      localStorage.setItem(USERNAME_KEY, MOCK_USER.username);
      const service = TestBed.inject(AuthService);
      service.signOutUser();
      expect(localStorage.getItem(USERNAME_KEY)).toBeNull();
    });

    it('emits false on isAuthenticated$', () => {
      localStorage.setItem(TOKEN_KEY, VALID_TOKEN);
      const service = TestBed.inject(AuthService);
      let isAuth: boolean | undefined;
      service.isAuthenticated$.subscribe((v) => (isAuth = v));

      service.signOutUser();
      expect(isAuth).toBe(false);
    });

    it('emits null on userEmail$', () => {
      localStorage.setItem(TOKEN_KEY, VALID_TOKEN);
      const service = TestBed.inject(AuthService);
      let email: string | null | undefined;
      service.userEmail$.subscribe((v) => (email = v));

      service.signOutUser();
      expect(email).toBeNull();
    });

    it('navigates to /signin', () => {
      localStorage.setItem(TOKEN_KEY, VALID_TOKEN);
      const service = TestBed.inject(AuthService);
      const navigateSpy = vi.spyOn(router, 'navigate');

      service.signOutUser();
      expect(navigateSpy).toHaveBeenCalledWith(['/signin']);
    });
  });
});
