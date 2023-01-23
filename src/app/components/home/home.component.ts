import { Kategori } from './../../models/Kategori';
import { MytoastService } from './../../services/mytoast.service';
import { Sonuc } from './../../models/Sonuc';
import { FormGroup, FormControl } from '@angular/forms';
import { Cevap } from './../../models/Cevap';
import { DataService } from './../../services/data.service';
import { Soru } from './../../models/Soru';
import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sorular!: Soru[]
  kategoriler!: Kategori[]
  sonuc: Sonuc = new Sonuc;
  modalBaslik: String = "";
  modal!: Modal;
  frmcevap: FormGroup = new FormGroup({
    id: new FormControl(),
    cevap: new FormControl(),
    questionId: new FormControl(),
    kaytarih: new FormControl(),
    duztarih: new FormControl()
  });

  frmsoru: FormGroup = new FormGroup({
    id: new FormControl(),
    soru: new FormControl(),
    categoryId: new FormControl(),
    kaytarih: new FormControl(),
    duztarih: new FormControl()
  });
  constructor(public servis: DataService, public toast: MytoastService) { }

  ngOnInit() {
    this.SoruListele();
    this.KategoriListele();
    console.log("sayfa çalıştı")
  }

  EkleCevap(el: HTMLElement) {
    this.frmcevap.reset();
    this.frmcevap.patchValue({});
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = "Cevapla";
    this.modal.show();
  }

  EkleSoru(el: HTMLElement) {
    this.frmsoru.reset();
    this.frmsoru.patchValue({});
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = "Soru Sor";
    this.modal.show();
  }


  SoruListele() {
    var tarih = new Date()
    this.servis.SoruListele().subscribe(d => {
      this.sorular = d;
      console.log(this.sorular)
    });
  }


  KategoriListele() {
    var tarih = new Date()
    this.servis.KategoriListele().subscribe(d => {
      this.kategoriler = d;
      console.log(this.sorular)
    });
  }

  CevapEkle() {
    var cevap: Cevap = this.frmcevap.value;
    var tarih = new Date();
    cevap.kaytarih = tarih.getTime().toString();
    cevap.duztarih = tarih.getTime().toString();
    this.servis.CevapEkle(cevap).subscribe(d => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = "Cevabınız Başarıyla Eklendi";
      this.toast.ToastUygula(this.sonuc);
      this.modal.toggle();
    })
  }

  SoruEkle() {
    var soru: Soru = this.frmsoru.value;
    var tarih = new Date();
    var filtre = this.sorular.filter(s => s.soru == soru.soru);
    if (filtre.length > 0) {
      this.sonuc.islem = false;
      this.sonuc.mesaj = "Girilen Soru Mevcuttur";
      this.toast.ToastUygula(this.sonuc);
    } else {
      soru.kaytarih = tarih.getTime().toString();
      soru.duztarih = tarih.getTime().toString();
      this.servis.SoruEkle(soru).subscribe(d => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Soru Eklendi";
        this.toast.ToastUygula(this.sonuc);
        this.modal.toggle();
        this.SoruListele();
      })
    }
  }
}
