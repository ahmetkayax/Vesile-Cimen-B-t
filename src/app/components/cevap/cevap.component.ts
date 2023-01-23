import { Soru } from './../../models/Soru';
import { Cevap } from './../../models/Cevap';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { Sonuc } from 'src/app/models/Sonuc';
import { FormControl, FormGroup } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-cevap',
  templateUrl: './cevap.component.html',
  styleUrls: ['./cevap.component.css']
})
export class CevapComponent implements OnInit {
  cevaplar!: Cevap[];
  sorular!: Soru[];
  modal!: Modal;
  modalBaslik: string = "";
  secCevap!: Cevap;
  soruId: number = 0;
  secSoru: Soru = new Soru();
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    cevap: new FormControl(),
    questionId: new FormControl(),
    kaytarih: new FormControl(),
    duztarih: new FormControl(),

  });
  constructor(
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((p: any) => {
      if (p.soruId) {
        this.soruId = p.soruId;
        this.SoruGetir();
      }
    });
    this.SoruListele();
    // this.CevapListele();
  }
  SoruSec(soruId: number) {
    this.soruId = soruId;
    this.SoruGetir();
    // this.CevapListele()

  }


  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.frm.patchValue({});
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = "Cevap Ekle";
    this.modal.show();
  }
  Duzenle(cevap: Cevap, el: HTMLElement) {

    this.frm.patchValue(cevap);
    this.modalBaslik = "Cevap Düzenle";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(cevap: Cevap, el: HTMLElement) {

    this.secCevap = cevap;
    this.modalBaslik = "Cevap Sil";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  CevapListele() {

    this.servis.CevapListeleBySoruId(this.soruId).subscribe(d => {
      this.cevaplar = d;
    });
  }
  SoruListele() {
    this.servis.SoruListele().subscribe(d => {
      this.sorular = d;
    });
  }

  SoruGetir() {
    this.servis.SoruById(this.soruId).subscribe(d => {
      this.secSoru = d;
      this.CevapListele();
    });
  }
  CevapEkleDuzenle() {

    var _cevap: Cevap = this.frm.value
    var tarih = new Date();
    if (!_cevap.id) {

      _cevap.kaytarih = tarih.getTime().toString();
      _cevap.duztarih = tarih.getTime().toString();
      this.servis.CevapEkle(_cevap).subscribe(d => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Cevap Eklendi";
        this.toast.ToastUygula(this.sonuc);
        this.CevapListele();
        this.modal.toggle();
      });
    } else {

      _cevap.duztarih = tarih.getTime().toString();
      this.servis.CevapDuzenle(_cevap).subscribe(d => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Cevap Düzenlendi";
        this.toast.ToastUygula(this.sonuc);
        this.CevapListele();
        this.modal.toggle();
      });
    }

  }
  CevapSil() {

    this.servis.CevapSil(this.secCevap.id).subscribe(d => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = "Cevap Silindi";
      this.toast.ToastUygula(this.sonuc);
      this.CevapListele();
      this.modal.toggle();
    });
  }
}
