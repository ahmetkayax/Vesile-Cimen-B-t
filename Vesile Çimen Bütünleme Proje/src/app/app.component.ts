import { Uye } from './models/Uye';
import { Router } from '@angular/router';
import { FbservisService } from './services/fbservis.service';
import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  uye = this.fbServis.AktifUyeBilgi;
  user$ = this.usersService.currentUserProfile$;

  constructor(
    public fbServis: FbservisService,
    public router: Router,
    public usersService: UsersService
  ) {

  }

  OturumKapat() {
    this.fbServis.OturumKapat().subscribe(() => {
      this.router.navigate(['login']);
    });
  }
}
