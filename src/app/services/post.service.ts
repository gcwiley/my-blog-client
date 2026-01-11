import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, of, throwError, map } from 'rxjs';

// post interfaces
import { Post, PostInput } from '../types/post.interface';

// define a standard wrapper for your backend response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  // ideally, move this to environment.apiUrl
  private readonly API_URL = '/api/posts';

  private http = inject(HttpClient);

  // GET: GET ALL POSTS
  public getPosts(): Observable<Post[]> {
    return this.http.get<ApiResponse<Post[]>>(this.API_URL).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET: - GET POST BY ID
  public getPostById(id: string): Observable<Post> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<ApiResponse<Post>>(url).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET - SEARCH POSTS
  public searchPosts(term: string): Observable<Post[]> {
    if (!term.trim()) {
      // if no search term, return an empty post array
      return of([]);
    }
    const params = new HttpParams().set('query', term);
    return this.http.get<ApiResponse<Post[]>>(this.API_URL, { params }).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET: - GET POST COUNT
  public getPostsCount(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.API_URL}`).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET: GET RECENT CREATED POSTS
  public getRecentlyCreatedPosts(): Observable<Post[]> {
    return this.http.get<ApiResponse<Post[]>>(`${this.API_URL}/recent`).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // SAVE METHODS

  // POST: - NEW POST
  public addPost(newPost: PostInput): Observable<Post> {
    return this.http.post<ApiResponse<Post>>(this.API_URL, newPost).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // DELETE: - DELETE POST BY ID
  public deletePostById(id: string): Observable<Post> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<ApiResponse<Post>>(url).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // PUT: - UPDATE POST BY ID
  public updatePostById(id: string, body: Partial<Post>): Observable<Post> {
    const url = `${this.API_URL}/${id}`;
    return this.http.patch<ApiResponse<Post>>(url, body).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // HANDLE ERROR
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // client-side/network error
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    } else {
      // backend error
      errorMessage = `Backend returned code ${
        error.status
      }, body was ${JSON.stringify(error.error)}`;
    }
    console.error('There was an error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
