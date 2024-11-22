# FoCourse Mobile App 📱

## Deskripsi Proyek

FoCourse adalah aplikasi mobile pembelajaran interaktif yang dikembangkan menggunakan React Native dan Expo, dirancang untuk memberikan pengalaman belajar yang menarik dan mudah diakses.

## Fitur Utama

- 🌐 Dukungan multi-bahasa (Indonesia & Inggris)
- 🔍 Pencarian kursus dengan filter
- 📚 Berbagai kategori kursus
- 🏆 Pelacakan kemajuan pembelajaran
- 🌙 Dukungan mode gelap/terang

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- Node.js (versi 16+ recommended)
- npm atau yarn
- Expo CLI
- Android Studio / Xcode (untuk emulator)

Sebelum diinisiasi, push dulu env nya
```bash
eas secret:create --name EXPO_PUBLIC_DB_HOST --value "alamatdb"
eas secret:create --name EXPO_PUBLIC_DB_USER --value "user"
eas secret:create --name EXPO_PUBLIC_DB_PASS --value "passwrd"
```
## Instalasi

1. Clone repositori:
```bash
git clone https://github.com/username/focourse-mobile.git
cd focourse-mobile
npm i
npx expo start
```

