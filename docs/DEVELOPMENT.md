# Development Workflow Kryzna Learn

**Tanggal dokumen:** 18 September 2026  
**Branch saat dokumen ini diperbarui:** `18-Sep-2026`

## Aturan branch dinamis

Branch pengembangan Kryzna Learn **tidak permanen** dan dapat berganti berdasarkan tanggal atau checkpoint update proyek.

- Jangan mengunci nama branch tertentu di instruksi proyek atau dokumentasi umum.
- Sebelum setiap pekerjaan, verifikasi branch pengembangan yang aktif di GitHub.
- Baca `docs/PROJECT-STATUS.md` pada branch yang telah diverifikasi.
- Gunakan branch yang tercatat sebagai branch aktif/current pada `PROJECT-STATUS.md`.
- Jika branch berbeda dari sesi sebelumnya, ikuti branch terbaru yang telah diverifikasi; jangan berasumsi branch lama masih aktif.
- Jika pengguna secara eksplisit menentukan branch, gunakan branch tersebut.
- Setelah checkpoint/perubahan signifikan, catat branch aktif terbaru di `docs/PROJECT-STATUS.md`.
- Pola tanggal adalah konvensi pengelolaan branch, bukan nama branch yang harus dianggap permanen.

Contoh:

```text
17-Sep-2026
18-Sep-2026
19-Sep-2026
```

Contoh di atas hanya menggambarkan pola; branch aktual harus selalu diverifikasi dari repository.

## Aturan wajib perubahan

Setiap perubahan kode, konfigurasi, database, RBAC, security, atau deployment harus mengikuti urutan:

```text
ubah
 ↓
commit
 ↓
verifikasi hasil
 ↓
update dokumentasi & progres
 ↓
verifikasi dokumentasi
 ↓
lanjut
```

### Documentation-after-commit rule

**Setelah setiap commit, dokumentasi dan progres wajib diperbarui.**

Minimal:

1. Update dokumentasi teknis yang terdampak.
2. Update `docs/PROJECT-STATUS.md`.
3. Catat perubahan, hasil verifikasi, commit/checkpoint, dan pekerjaan berikutnya bila relevan.
4. Jika perubahan menyentuh arsitektur, security, RBAC, database, workflow, atau deployment, update dokumen khusus terkait.
5. Verifikasi file dokumentasi setelah update sebelum pekerjaan dianggap selesai.

## Repository

- Kerjakan pada branch yang telah diverifikasi sebagai branch aktif.
- Fetch file dan SHA terbaru sebelum update.
- Jangan menimpa perubahan yang lebih baru.
- Commit message harus menjelaskan perubahan secara ringkas.
- Untuk formatting-only, jangan mengubah behavior.

## Supabase

- Baca dokumentasi/skill Supabase yang relevan sebelum pekerjaan Supabase.
- Schema change menggunakan migration.
- Verifikasi migration dengan query setelah diterapkan.
- Review RLS, RPC, SECURITY DEFINER, Storage policy, dan privilege setiap kali terdampak.
- Jangan pernah memasukkan service-role/secret key ke source browser.

## Edge Functions

- Source repo dan deployment harus dibandingkan.
- Setelah deploy, verifikasi version/status dan source parity.
- Catat parity di `docs/EDGE-FUNCTIONS.md` dan checkpoint proyek.

## Security

Frontend guard hanya untuk UX. Security enforcement harus berada pada RLS/RPC/Edge Function sesuai kebutuhan. Temuan Security Advisor tidak boleh dianggap selesai tanpa verifikasi ulang.

## Penyelesaian pekerjaan

Pekerjaan hanya dianggap selesai jika:
- perubahan berhasil ditulis/di-commit;
- hasil diverifikasi;
- dokumentasi diperbarui;
- `PROJECT-STATUS.md` mencatat checkpoint bila perubahan signifikan;
- pekerjaan berikutnya jelas bila sesi dihentikan.
