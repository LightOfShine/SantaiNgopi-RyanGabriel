document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      {
        id: 6,
        name: "Kopi Luwak",
        img: "6.jpg",
        price: 20000,
      },
      {
        id: 5,
        name: "Kopi Arabika Lampung",
        img: "5.jpg",
        price: 30000,
      },
      {
        id: 4,
        name: "Kopi Toraja",
        img: "4.jpg",
        price: 40000,
      },
      {
        id: 3,
        name: "Kopi Kintamani Bali",
        img: "3.jpg",
        price: 50000,
      },
      {
        id: 2,
        name: "Kopi Gayo Aceh",
        img: "2.jpeg",
        price: 60000,
      },
      {
        id: 1,
        name: "Kopi Arabika Mandailing",
        img: "1.jpg",
        price: 80000,
      },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      //   cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      //   Jika Belum ada /cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barang sudah ada ,cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada , tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },

    remove(id) {
      // ambil item yang mau di remove berdasarkan idnya
      const cartItem = this.items.find((item) => item.id === id);

      //   Jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // Telusuri satu satu
        this.items = this.items.map((item) => {
          //  jika bukan barang yang di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// Kirim data ketika tombol check out diklik
checkoutButton.addEventListener("click", function (e) {
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open("http://wa.me/6281262773946?text=" + encodeURIComponent(message));
});

// Format Pesan Whatsapp
const formatMessage = (obj) => {
  return `Data Pelanggan
  Nama : ${obj.name}
  Email : ${obj.email}
  No HP : ${obj.phone}
  
  Data Pesanan
  ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
  Total : ${rupiah(obj.total)}
  Terima Kasih Sudah Memesan Produk Kami.`;
};

// Konversi Ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
