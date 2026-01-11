import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, of, throwError, map } from 'rxjs';

// post interfaces
import { Post, PostInput } from '../types/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  // comment here
  private postsUrl = '/api/posts'; // URL to web api

  private http = inject(HttpClient);

  // GET: GET ALL POSTS
  public getPosts(): Observable<Post[]> {
    return this.http.get<{ data: Post[] }>(this.postsUrl).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET: GET POST BY ID
  public getPostById(id: string): Observable<Post> {
    const url = `${this.postsUrl}/${id}`;
    return this.http
      .get<{ success: boolean; message?: string; data: Post }>(url)
      .pipe(
        map((res) => res.data), // unwrap the backend wrapper
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
    return this.http
      .get<{ data: Post[] }>(`${this.postsUrl}/search`, { params })
      .pipe(
        map((res) => res.data),
        catchError((error) => this.handleError(error)),
      );
  }

  // GET: - GET POST COUNT
  public getPostsCount(): Observable<number> {
    return this.http.get<{ data: number }>('/api/posts/count').pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET: GET RECENT CREATED POSTS
  public getRecentlyCreatedPosts(): Observable<Post[]> {
    return this.http.get<{ data: Post[] }>('/api/posts/recent').pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // SAVE METHODS

  // POST: ADD POST
  public addPost(newPost: PostInput): Observable<Post> {
    return this.http
      .post<{ data: Post }>(this.postsUrl, newPost)
      .pipe(
        map((res) => res.data),
        catchError((error) => this.handleError(error)),
      );
  }

  // DELETE: - DELETE POST BY ID
  public deletePostById(id: string): Observable<Post> {
    const url = `${this.postsUrl}/${id}`;
    return this.http.delete<{ data: Post }>(url).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // PUT: - UPDATE POST BY ID
  public updatePostById(id: string, body: Partial<Post>): Observable<Post> {
    const url = `${this.postsUrl}/${id}`;
    return this.http
      .patch<{ data: Post }>(url, body)
      .pipe(
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
