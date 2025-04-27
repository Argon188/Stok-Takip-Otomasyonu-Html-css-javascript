class Urun {
    constructor(adi, stokMiktari) {
        this.adi = adi;
        this.stokMiktari = stokMiktari;
    }

    urunEkle(miktar) {
        this.stokMiktari += miktar;
        this.stokGuncelle();
    }

    urunCikar(miktar) {
        if (this.stokMiktari >= miktar) {
            this.stokMiktari -= miktar;
            this.stokGuncelle();
        } else {
            alert("Yeterli stok yok!");
        }
    }

    stokGuncelle() {
        localStorage.setItem(this.adi, JSON.stringify(this.stokMiktari));
    }

    static urunSil(urunAdi) {
        localStorage.removeItem(urunAdi);
    }
}

class Stok {
    constructor() {
        this.urunler = this.yukle();
    }

    urunEkle(urun) {
        this.urunler.push(urun);
        urun.stokGuncelle();
    }

    urunBul(urunAdi) {
        return this.urunler.find(urun => urun.adi === urunAdi);
    }

    stokDurumunuGoruntule() {
        return this.urunler;
    }

    yukle() {
        const urunler = [];
        for (let i = 0; i < localStorage.length; i++) {
            let urunAdi = localStorage.key(i);
            let urunStok = JSON.parse(localStorage.getItem(urunAdi));
            urunler.push(new Urun(urunAdi, urunStok));
        }
        return urunler;
    }
}

class Siparis {
    constructor(siparisNumarasi, urunAdi, miktar) {
        this.siparisNumarasi = siparisNumarasi;
        this.urunAdi = urunAdi;
        this.miktar = miktar;
    }
}

let stok = new Stok();
let siparisListesi = [];

function urunEkle() {
    const urunAdi = document.getElementById("urunAdi").value;
    const urunMiktar = parseInt(document.getElementById("urunMiktar").value);

    if (urunAdi && urunMiktar > 0) {
        let urun = stok.urunBul(urunAdi);
        if (urun) {
            urun.urunEkle(urunMiktar);
        } else {
            urun = new Urun(urunAdi, urunMiktar);
            stok.urunEkle(urun);
        }
        renderStokTablosu();
        document.getElementById("urunAdi").value = '';
        document.getElementById("urunMiktar").value = '';
    }
}

function renderStokTablosu() {
    const stokTablosu = document.getElementById("stokTablosu").getElementsByTagName('tbody')[0];
    stokTablosu.innerHTML = '';
    stok.stokDurumunuGoruntule().forEach(urun => {
        const row = stokTablosu.insertRow();
        row.insertCell(0).textContent = urun.adi;
        row.insertCell(1).textContent = urun.stokMiktari;
        const actionCell = row.insertCell(2);

        const btnGuncelle = document.createElement("button");
        btnGuncelle.textContent = "Güncelle";
        btnGuncelle.onclick = () => {
            const miktar = prompt("Güncellenecek miktarı girin:", 0);
            if (miktar) {
                urun.urunEkle(parseInt(miktar));
                renderStokTablosu();
            }
        };
        actionCell.appendChild(btnGuncelle);

        const btnSil = document.createElement("button");
        btnSil.textContent = "Sil";
        btnSil.style.backgroundColor = "red";
        btnSil.style.marginLeft = "5px";
        btnSil.onclick = () => {
            if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
                Urun.urunSil(urun.adi);
                renderStokTablosu();
            }
        };
        actionCell.appendChild(btnSil);
    });
}

function siparisOlustur() {
    const siparisUrunAdi = document.getElementById("siparisUrunAdi").value;
    const siparisMiktar = parseInt(document.getElementById("siparisMiktar").value);

    let urun = stok.urunBul(siparisUrunAdi);
    if (urun && urun.stokMiktari >= siparisMiktar) {
        urun.urunCikar(siparisMiktar);
        const siparis = new Siparis(Date.now(), siparisUrunAdi, siparisMiktar);
        siparisListesi.push(siparis);
        renderSiparisTablosu();
    } else {
        alert("Ürün stokta yeterli miktarda yok!");
    }
}

function renderSiparisTablosu() {
    const siparislerTablosu = document.getElementById("siparisler").getElementsByTagName('tbody')[0];
    siparislerTablosu.innerHTML = '';
    siparisListesi.forEach(siparis => {
        const row = siparislerTablosu.insertRow();
        row.insertCell(0).textContent = siparis.siparisNumarasi;
        row.insertCell(1).textContent = siparis.urunAdi;
        row.insertCell(2).textContent = siparis.miktar;
    });
}

window.onload = function() {
    renderStokTablosu();
};
