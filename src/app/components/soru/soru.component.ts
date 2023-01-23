import { Soru } from './../../models/Soru';
import { Component, OnInit } from '@angular/core';
import { Kategori } from 'src/app/models/Kategori';
import { Modal } from 'bootstrap';
import { Sonuc } from 'src/app/models/Sonuc';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { FbservisService } from 'src/app/services/fbservis.service';

@Component({
  selector: 'app-soru',
  templateUrl: './soru.component.html',
  styleUrls: ['./soru.component.css']
})
export class SoruComponent implements OnInit {
  sorular!: Soru[];
  kategoriler!: Kategori[];
  modal!: Modal;
  modalBaslik: string = "";
  secSoru!: Soru;
  katId: number = 0;
  secKat: Kategori = new Kategori();
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    soru: new FormControl(),
    categoryId: new FormControl(),
    kaytarih: new FormControl(),
    duztarih: new FormControl(),

  });
  fbservis: any;
  constructor(
    public fbservis : FbservisService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((p: any) => {
      if (p.katId) {
        this.katId = p.katId;
        this.KategoriGetir();
      }
    });
    this.KategoriListele();
  }
  KatSec(katId: number) {
    this.katId = katId;
    this.KategoriGetir();

  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.frm.patchValue({
      categoryId: this.katId
    });
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = "Soru Ekle";
    this.modal.show();
  }
  Duzenle(soru: Soru, el: HTMLElement) {
    this.frm.patchValue(soru);
    this.modalBaslik = "Soru Düzenle";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(soru: Soru, el: HTMLElement) {
    this.secSoru = soru;
    this.modalBaslik = "Soru Sil";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  SoruListele() {
    this.fbservis.SoruListeleByKatId(this.katId).subscribe(d => {
      this.sorular = d;
    });
  }
  KategoriListele() {
    this.fbservis.KategoriListele().subscribe(d => {
      this.kategoriler = d;
    });
  }
  KategoriGetir() {
    this.fbservis.KategoriById(this.katId).subscribe(d => {
      this.secKat = d;
      this.SoruListele();
    });
  }
  SoruEkleDuzenle() {
    var soru: Soru = this.frm.value
    var tarih = new Date();
    if (!soru.id) {
      var filtre = this.sorular.filter(s => s.soru == soru.soru);
      if (filtre.length > 0) {
        this.sonuc.islem = false;
        this.sonuc.mesaj = "Girilen Soru Adı Kayıtlıdır!";
       
      } else {
        soru.kaytarih = tarih.getTime().toString();
        soru.duztarih = tarih.getTime().toString();
        this.fbservis.SoruEkle(soru).subscribe(d => {
          this.sonuc.islem = true;
          this.sonuc.mesaj = "Soru Eklendi";
        
          this.SoruListele();
          this.modal.toggle();
        });
      }
    } else {
      soru.duztarih = tarih.getTime().toString();
      this.fbservis.SoruDuzenle(soru).subscribe(d => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Soru Düzenlendi";
        this.SoruListele();
        this.modal.toggle();
      });
    }

  }
  SoruSil() {
    this.fbservis.SoruSil(this.secSoru.id).subscribe(d => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = "Soru Silindi";
      this.SoruListele();
      this.modal.toggle();
    });
  }
}
