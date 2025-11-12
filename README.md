# PokéViewer: Responsive Pokémon Gallery

This is a small React app that fetches **6 random Pokémon** from the public **PokéAPI** and displays them in a responsive card layout. Each Pokémon has:
- Name
- Image (official artwork)
- A few stats (HP, Attack, Defense)

Users can also **star** their favorites, and the app remembers them using cookies.

---


## How to run:

Copy the repo:
https://github.com/Siggyy1/work_requriement5.git

Install dependencies: 
npm run dev

Open the URL shown in the terminal (usually):
http://127.0.0.1:5173 

🧠 How It Works (Brief Explanation)

When the app loads, it generates 6 random Pokémon IDs.

For each ID, the app calls the PokéAPI:

https://pokeapi.co/api/v2/pokemon/{id}


The response includes the Pokémon's:

Name

Official artwork image

Stats (HP / Attack / Defense)

The data is then displayed in a reusable card component, and the layout adapts using React Bootstrap:

1 card per row on small screens

2 per row on medium screens

3 per row on large screens
