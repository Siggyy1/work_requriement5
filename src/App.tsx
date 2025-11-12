import { useEffect, useState } from "react";
import { Container, Row, Col, Navbar, Button, Spinner, Alert } from "react-bootstrap";
import Cookies from "js-cookie";

type Poke = {
  id: number;
  name: string;
  image: string;
  stats: { hp: number; attack: number; defense: number };
};

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function fetchPokemon(id: number): Promise<Poke> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  const hp = data.stats.find((x: any) => x.stat.name === "hp")?.base_stat ?? 0;
  const attack = data.stats.find((x: any) => x.stat.name === "attack")?.base_stat ?? 0;
  const defense = data.stats.find((x: any) => x.stat.name === "defense")?.base_stat ?? 0;

  return {
    id: data.id,
    name: titleCase(data.name),
    image: data.sprites?.other?.["official-artwork"]?.front_default || data.sprites?.front_default,
    stats: { hp, attack, defense },
  };
}

function getRandomIds(count = 6, maxId = 1010) {
  const set = new Set<number>();
  while (set.size < count) set.add(1 + Math.floor(Math.random() * maxId));
  return [...set];
}

function useFavoritesCookie() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const raw = Cookies.get("favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    Cookies.set("favorites", JSON.stringify(favorites), { expires: 365 });
  }, [favorites]);
  const toggle = (id: number) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  return { favorites, toggle };
}

function Card({ poke, starred, onToggle }: { poke: Poke; starred: boolean; onToggle: () => void }) {
  return (
    <div className="card h-100 shadow-sm bg-dark text-light">
      {poke.image && (
        <img
          src={poke.image}
          alt={poke.name}
          className="card-img-top"
          style={{ objectFit: "contain", height: 260, background: "#1e1e1e" }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{poke.name}</h5>
          <Button size="sm" variant={starred ? "warning" : "outline-light"} onClick={onToggle}>
            {starred ? "★ Starred" : "☆ Star"}
          </Button>
        </div>
        <ul className="list-unstyled mb-0 mt-auto">
          <li>HP: {poke.stats.hp}</li>
          <li>Attack: {poke.stats.attack}</li>
          <li>Defense: {poke.stats.defense}</li>
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  const [list, setList] = useState<Poke[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites, toggle } = useFavoritesCookie();

  async function loadRandom() {
    setLoading(true);
    setError(null);
    try {
      const ids = getRandomIds(6);
      const pokes = await Promise.all(ids.map(fetchPokemon));
      setList(pokes);
    } catch (e: any) {
      setError(e?.message || "Failed to load Pokémon");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRandom();
  }, []);

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>PokéViewer: Responsive Pokémon Gallery</Navbar.Brand>
          <Button onClick={loadRandom} disabled={loading} variant="outline-light">
            {loading ? "Loading…" : "Load 6 random"}
          </Button>
        </Container>
      </Navbar>

      <Container className="pb-5">
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" role="status" />
          </div>
        )}

        <Row className="g-4" xs={1} md={2} lg={3}>
          {list.map((p) => (
            <Col key={p.id}>
              <Card poke={p} starred={favorites.includes(p.id)} onToggle={() => toggle(p.id)} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
