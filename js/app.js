/**
 * app.js — Fungsi umum prototype SMA Pencawan.
 * Berisi: proteksi login tiruan, render sidebar/header/bottom-nav,
 * modal, toast, helper tabel & utilitas.
 */

// ============================================================
// Helper dasar
// ============================================================
const $  = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

/** Escape teks agar aman ditampilkan (dummy, tetap diterapkan). */
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/** Format tanggal "2026-10-16" -> "16 Okt 2026". */
function tglIndo(tgl) {
  if (!tgl) return "-";
  const b = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const d = new Date(tgl + "T00:00:00");
  return `${d.getDate()} ${b[d.getMonth()]} ${d.getFullYear()}`;
}

/** Tanggal hari ini "2026-10-20" (lokal, bukan UTC). */
function tglISO(d = new Date()) {
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// ============================================================
// Auth tiruan (localStorage)
// ============================================================
const Auth = {
  get() {
    try { return JSON.parse(localStorage.getItem("sp_auth")); } catch { return null; }
  },
  login(user) { localStorage.setItem("sp_auth", JSON.stringify(user)); },
  logout()    { localStorage.removeItem("sp_auth"); window.location.href = "../login.html"; },

  /** Proteksi halaman: wajib login & sesuai peran. */
  protect(role) {
    const u = this.get();
    if (!u) { window.location.href = "../login.html"; return null; }
    if (role && u.role !== role) {
      // Guru tidak boleh buka halaman admin dan sebaliknya
      window.location.href = u.role === "admin" ? "../admin/dashboard.html" : "../guru/dashboard.html";
      return null;
    }
    return u;
  },
};

// ============================================================
// Toast notifikasi
// ============================================================
function toast(pesan, tipe = "success", judul = "") {
  let stack = $(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  const ikon = { success: "fa-circle-check", error: "fa-circle-xmark", warn: "fa-triangle-exclamation", info: "fa-circle-info" }[tipe] || "fa-circle-info";
  const el = document.createElement("div");
  el.className = `toast ${tipe}`;
  el.innerHTML = `<i class="fa-solid ${ikon}" style="margin-top:2px;color:${
    tipe === "success" ? "#16a34a" : tipe === "error" ? "#dc2626" : tipe === "warn" ? "#d97706" : "#2563eb"}"></i>
    <div>${judul ? `<strong>${esc(judul)}</strong>` : ""}<span>${esc(pesan)}</span></div>`;
  stack.appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 260); }, 3200);
}

// ============================================================
// Modal (fungsional, agar tidak duplikasi markup)
// ============================================================
const Modal = {
  /** Buka modal dari template id tertentu; data diisi lewat callback. */
  buka(id, onOpen) {
    const tpl = document.getElementById(id);
    if (!tpl) return;
    let box = document.getElementById("live-modal");
    if (box) box.remove();
    box = document.createElement("div");
    box.className = "modal-backdrop show";
    box.id = "live-modal";
    box.innerHTML = tpl.innerHTML;
    document.body.appendChild(box);
    box.addEventListener("click", e => { if (e.target === box) Modal.tutup(); });
    $$(".modal-close", box).forEach(b => b.addEventListener("click", Modal.tutup));
    if (typeof onOpen === "function") onOpen(box);
    const f = box.querySelector("input,select,textarea");
    if (f) setTimeout(() => f.focus(), 60);
  },
  tutup() {
    const b = document.getElementById("live-modal");
    if (b) b.remove();
  },
};

// ============================================================
// Komponen berulang: sidebar admin, topbar, bottom nav guru
// ============================================================
const MENU_ADMIN = [
  { href: "dashboard.html",   icon: "fa-gauge-high",      label: "Dashboard" },
  { href: "guru.html",        icon: "fa-chalkboard-user", label: "Manajemen Guru" },
  { href: "qr-absensi.html",  icon: "fa-qrcode",          label: "QR Absensi" },
  { href: "jadwal-guru.html", icon: "fa-calendar-days",   label: "Jadwal Guru" },
  { href: "jadwal-kelas.html",icon: "fa-table-cells",     label: "Jadwal Kelas" },
  { href: "absensi-guru.html",icon: "fa-user-check",      label: "Absensi Guru" },
  { href: "laporan.html",     icon: "fa-chart-column",    label: "Laporan" },
];

const MENU_GURU = [
  { href: "dashboard.html",     icon: "fa-house",              label: "Beranda" },
  { href: "presensi.html",      icon: "fa-qrcode",             label: "Presensi" },
  { href: "jadwal.html",        icon: "fa-calendar-days",      label: "Jadwal" },
  { href: "absensi-siswa.html", icon: "fa-clipboard-user",     label: "Absensi" },
  { href: "nilai.html",         icon: "fa-star",               label: "Nilai" },
  { href: "profil.html",        icon: "fa-user",               label: "Profil" },
];

/** Render sidebar admin. dipanggil dari setiap halaman admin. */
function renderSidebar(halamanAktif) {
  const el = document.createElement("aside");
  el.className = "sidebar";
  el.id = "sidebar";
  el.innerHTML = `
    <div class="sidebar-brand"><span class="logo-box"><img src="../assets/logosekolah.jfif" alt="Logo SMA Pencawan"></span> SMA Pencawan</div>
    <nav>
      ${MENU_ADMIN.map(m => `<a href="${m.href}" class="${m.href === halamanAktif ? "active" : ""}">
        <i class="fa-solid ${m.icon}"></i> ${m.label}</a>`).join("")}
    </nav>
    <div class="sidebar-foot">Prototype • Tanpa database<br>Versi demo 1.0</div>`;
  document.body.prepend(el);

  const backdrop = document.createElement("div");
  backdrop.className = "backdrop";
  backdrop.id = "sidebar-backdrop";
  document.body.appendChild(backdrop);
  backdrop.addEventListener("click", tutupSidebar);

  // Burger toggle untuk tablet/mobile
  document.addEventListener("click", e => {
    const b = e.target.closest("#btn-burger");
    if (b) {
      const sb = $("#sidebar");
      const buka = !sb.classList.contains("open");
      sb.classList.toggle("open", buka);
      backdrop.classList.toggle("show", buka);
    }
  });
}
function tutupSidebar() {
  $("#sidebar")?.classList.remove("open");
  $("#sidebar-backdrop")?.classList.remove("show");
}

/** Render topbar admin. */
function renderTopbar(judul) {
  const user = Auth.get() || { nama: "Admin", role: "admin", foto: "" };
  const bar = document.createElement("header");
  bar.className = "topbar";
  bar.innerHTML = `
    <div class="topbar-left">
      <button class="burger" id="btn-burger"><i class="fa-solid fa-bars"></i></button>
      <h1 class="topbar-title">${esc(judul)}</h1>
    </div>
    <div class="topbar-user">
      <div style="text-align:right">
        <div class="nama">${esc(user.nama)}</div>
        <div class="role">${user.role === "admin" ? "Administrator" : "Guru"}</div>
      </div>
      <img class="avatar" src="${user.foto || "https://i.pravatar.cc/150?img=68"}" alt="avatar">
      <button class="btn btn-outline btn-sm" id="btn-logout"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>
    </div>`;
  // Sisipkan di dalam .main-area agar sejajar dengan sidebar
  (document.querySelector(".main-area") || document.body).prepend(bar);
  $("#btn-logout").addEventListener("click", () => {
    if (confirm("Keluar dari akun demo?")) Auth.logout();
  });
}

/** Render footer logo sekolah (aset gambar). */
function renderFooter(sumber, kelasExtra = "") {
  const f = document.createElement("footer");
  f.className = "page-footer " + kelasExtra;
  f.innerHTML = `<img src="${sumber}" alt="SMA Pencawan">`;
  return f;
}

/** Render shell halaman admin (sidebar + topbar). */
function initAdmin(halaman, judul) {
  const u = Auth.protect("admin");
  if (!u) return null;
  renderSidebar(halaman);
  renderTopbar(judul);
  (document.querySelector(".main-area") || document.body)
    .appendChild(renderFooter("../assets/footer_pendidikan.png"));
  return u;
}

/** Render bottom navigation guru (mobile). */
function renderBottomNav(halamanAktif) {
  const nav = document.createElement("nav");
  nav.className = "bottom-nav";
  nav.innerHTML = MENU_GURU.map(m =>
    `<a href="${m.href}" class="${m.href === halamanAktif ? "active" : ""}">
      <i class="fa-solid ${m.icon}"></i><span>${m.label}</span></a>`).join("");
  document.body.appendChild(nav);
}

/** Render topbar guru. */
function renderTopbarGuru(judul) {
  const user = Auth.get() || {};
  const bar = document.createElement("header");
  bar.className = "guru-topbar";
  bar.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;min-width:0">
      <img class="tb-logo" src="../assets/logosekolah.jfif" alt="Logo SMA Pencawan">
      <div>
        <p class="judul">${esc(judul)}</p>
        <div class="sub">SMA Pencawan • ${esc(user.nama || "Guru")}</div>
      </div>
    </div>
    <button class="btn btn-emas btn-sm" id="btn-logout"><i class="fa-solid fa-right-from-bracket"></i></button>`;
  // Sisipkan di dalam .guru-shell agar sejajar dengan konten (max-width 640px)
  (document.querySelector(".guru-shell") || document.body).prepend(bar);
  $("#btn-logout").addEventListener("click", () => {
    if (confirm("Keluar dari akun demo?")) Auth.logout();
  });
}

/** Render shell halaman guru. */
function initGuru(halaman, judul) {
  const u = Auth.protect("guru");
  if (!u) return null;
  renderTopbarGuru(judul);
  renderBottomNav(halaman);
  (document.querySelector(".guru-content") || document.body)
    .appendChild(renderFooter("../assets/footer_ramah.png", "guru-footer"));
  return u;
}

// ============================================================
// Utilitas tabel: search + filter + pagination (dummy)
// ============================================================
class TabelDemo {
  /**
   * @param {Object} o - { tbody, data, render, searchEl, filterEl, perPage, paginationEl, onEmpty }
   */
  constructor(o) {
    this.tbody = o.tbody;
    this.data = o.data;
    this.render = o.render;
    this.searchEl = o.searchEl;
    this.filterEl = o.filterEl;
    this.perPage = o.perPage || 8;
    this.page = 1;
    this.paginationEl = o.paginationEl;
    this.kata = "";
    this.filter = "";

    if (this.searchEl) this.searchEl.addEventListener("input", e => { this.kata = e.target.value.toLowerCase(); this.page = 1; this.draw(); });
    if (this.filterEl) this.filterEl.addEventListener("change", e => { this.filter = e.target.value; this.page = 1; this.draw(); });
    this.draw();
  }
  setData(d) { this.data = d; this.page = 1; this.draw(); }
  get terfilter() {
    return this.data.filter(r => {
      const cocokFilter = !this.filter || String(r.status ?? r.kelas ?? "") === this.filter;
      const cocokCari = !this.kata || JSON.stringify(r).toLowerCase().includes(this.kata);
      return cocokFilter && cocokCari;
    });
  }
  draw() {
    const rows = this.terfilter;
    const totalHal = Math.max(1, Math.ceil(rows.length / this.perPage));
    if (this.page > totalHal) this.page = totalHal;
    const mulai = (this.page - 1) * this.perPage;
    const potong = rows.slice(mulai, mulai + this.perPage);

    this.tbody.innerHTML = potong.length
      ? potong.map((r, i) => this.render(r, mulai + i)).join("")
      : `<tr><td colspan="99" style="text-align:center;color:#94a3b8;padding:22px">Tidak ada data</td></tr>`;

    if (this.paginationEl) {
      this.paginationEl.innerHTML = `
        <button ${this.page === 1 ? "disabled" : ""} data-p="${this.page - 1}">‹</button>
        ${Array.from({ length: totalHal }, (_, i) =>
          `<button class="${i + 1 === this.page ? "active" : ""}" data-p="${i + 1}">${i + 1}</button>`).join("")}
        <button ${this.page === totalHal ? "disabled" : ""} data-p="${this.page + 1}">›</button>
        <span style="margin-left:6px">${rows.length} data</span>`;
      $$("button[data-p]", this.paginationEl).forEach(b =>
        b.addEventListener("click", () => { this.page = +b.dataset.p; this.draw(); }));
    }
  }
}

// ============================================================
// Helper bersama
// ============================================================
/** Daftar guru: gabungan data dummy + perubahan admin (localStorage). */
function daftarGuru() {
  try {
    const s = JSON.parse(localStorage.getItem("sp_guru") || "null");
    if (Array.isArray(s) && s.length) return s;
  } catch {}
  return GURU;
}

/** Cari objek guru berdasar id. */
function cariGuru(id) { return daftarGuru().find(g => g.id === id); }

/** Data jadwal: gabungan data dummy + perubahan admin (localStorage). */
function dataJadwal() {
  try {
    const s = JSON.parse(localStorage.getItem("sp_jadwal") || "null");
    if (Array.isArray(s) && s.length) return s;
  } catch {}
  return JADWAL_GURU;
}

/** Badge status absensi -> HTML. */
function badgeStatus(s) {
  const kelas = {
    Hadir: "hadir", Terlambat: "terlambat", Izin: "izin", Sakit: "sakit",
    Alpa: "alpa", Mencurigakan: "mencurigakan", "Belum Absen": "netral",
    Disetujui: "disetujui", Menunggu: "menunggu", Ditolak: "ditolak",
    Aktif: "aktif", Nonaktif: "nonaktif",
  }[s] || "netral";
  return `<span class="badge badge-${kelas}">${esc(s)}</span>`;
}

/** Jam sekarang (HH:MM). */
function jamSekarang() {
  return new Date().toTimeString().slice(0, 5);
}

/** Hari ini (Senin..Sabtu; Minggu dianggap Senin untuk demo). */
function hariIni() {
  const d = new Date().getDay(); // 0 Min .. 6 Sab
  return HARI[Math.min(Math.max(d - 1, 0), 5)];
}
