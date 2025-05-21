function Roles() {

return (
    <div className="rules" style={{ textAlign: 'left', background: '#fffaf0', padding: '1rem', marginTop: '1rem', borderRadius: '8px' }}>
        <h2>Zasady gry</h2>
        <p><strong>Zawartość pudełka:</strong><br/>
        128 kartoników z obrazkami zwierząt:<br/>
        60 królików, 24 owce, 20 świń, 12 krów, 6 koni, 4 małe psy, 2 duże psy,<br/>
        2 różne dwunastościenne kostki</p>

        <p><strong>Cel gry:</strong> Uzyskaj stado zawierające co najmniej: konia, krowę, świnię, owcę i królika.</p>

        <p><strong>Rozmnażanie zwierząt:</strong><br/>
        Rzucasz dwiema kostkami. Jeśli wyrzucisz parę – otrzymujesz to zwierzę.<br/>
        Inaczej – otrzymujesz tyle sztuk ile masz pełnych par danego gatunku (łącznie z kostkami).</p>

        <p><strong>Uwaga:</strong> Nie możesz zdobyć konia ani krowy przez rzut, dopóki ich nie masz – musisz je najpierw zdobyć przez wymianę.</p>

        <p><strong>Wymiany:</strong> Raz na turę możesz wymienić zwierzęta wg tabeli kursów, np.:<br/>
        6 królików = 1 owca, 2 owce = 1 świnia, 3 świnie = 1 krowa, 2 krowy = 1 koń</p>

        <p><strong>Lis i wilk:</strong><br/>
        Lis – zabiera wszystkie króliki oprócz jednego (chyba że masz małego psa).<br/>
        Wilk – zabiera wszystkie zwierzęta oprócz konia, królików i małego psa (chyba że masz dużego psa).</p>

        <p><strong>Koniec gry:</strong> Wygrywa gracz, który pierwszy uzyska stado z królikiem, owcą, świnią, krową i koniem.</p>
    </div>
);
}

export default Roles;
