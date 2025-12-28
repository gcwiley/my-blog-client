import { inject } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";

// rxjs
import { Observable } from "rxjs";
import { map, take } from 'rxjs/operators';

// firebase auth
import { Auth } from '@angular/fire/auth';
