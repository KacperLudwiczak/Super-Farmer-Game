# 🐰 Super Farmer – Gra przeglądarkowa

Super Farmer to cyfrowa wersja klasycznej polskiej gry planszowej, w której gracze hodują zwierzęta, handlują i bronią się przed dzikimi drapieżnikami. Celem gry jest zdobycie pełnego stada: królika, owcy, świni, krowy i konia.

## 🎮 Rozgrywka

- Każdy gracz zaczyna z jednym królikiem.
- W swojej turze gracz może:
  - Wykonać **jedną wymianę** (np. królików na owce).
  - Rzucić **dwiema kostkami** – zwierzęta się rozmnażają, lub mogą pojawić się **lis** lub **wilk**, którzy atakują stado.
- Gra kończy się, gdy jeden z graczy skompletuje **pełne stado**.

## ⚙️ Technologie

- **Frontend**: React + TypeScript
- **Backend**: ASP.NET Core Web API (C#)
- **Stylizacja**: CSS

## 🧩 Zasady gry

- Wymiany zwierząt są zgodne z tabelą kursów.
- Każdy gracz może dokonać **tylko jednej wymiany na turę**.
- Drapieżniki:
  - **Lis**: zjada wszystkie króliki oprócz jednego, chyba że gracz ma **małego psa**.
  - **Wilk**: zjada owce, świnie i krowy, chyba że gracz ma **dużego psa**.
- Nowe konie i krowy można zdobyć tylko przez **wymianę**, nie przez rzut.

### Wymiany

Wymiana możliwa raz na turę i tylko według ustalonych kursów:

| Z | Do | Kurs |
|--|----|------|
| 6 królików | 1 owca |
| 2 owce | 1 świnia |
| 3 świnie | 1 krowa |
| 2 krowy | 1 koń |

Wymiany są możliwe również w drugą stronę zgodnie z tą samą logiką.

##  🏆 Warunki zwycięstwa
Aby wygrać, gracz musi posiadać przynajmniej po jednym z następujących zwierząt:

- 🐰 Królik
- 🐑 Owca
- 🐖 Świnia
- 🐄 Krowa
- 🐎 Koń

## 🚀 Uruchomienie projektu

### Backend (ASP.NET Core)

1. Przejdź do katalogu `backend/`
2. Uruchom serwer:
   ```bash
   dotnet run

### Frontend (React)

1. Przejdź do katalogu `frontend/`
2. Zainstaluj:
   ```bash
   npm install
3. Uruchom aplikację:
    ```bash
    npm run dev

## 📜 Licencja
Projekt edukacyjny inspirowany grą planszową Superfarmer.
