import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();

    this._loading = document.querySelector(".progress");

    const box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = this._render({
      name: "Placeholder",
      terrain: "placeholder",
      population: 0,
    });

    document.body.querySelector(".main").appendChild(box);

    this.emit(Application.events.READY);

    const url = "https://swapi.boom.dev/api/planets";
    this.planets = [];

    Application.load(url).then((response) => {
      this.planets = [...this.planets, ...response.results];
      console.log(this.planets);

      Application.load(response.next).then((response) => {
        this.planets = [...this.planets, ...response.results];
        console.log(this.planets);

        Application.load(response.next).then((response) => {
          this.planets = [...this.planets, ...response.results];
          console.log(this.planets);

          Application.load(response.next).then((response) => {
            this.planets = [...this.planets, ...response.results];
            console.log(this.planets);

            Application.load(response.next).then((response) => {
              this.planets = [...this.planets, ...response.results];
              console.log(this.planets);

              Application.load(response.next)
                .then((response) => {
                  this.planets = [...this.planets, ...response.results];
                  console.log(this.planets);
                })
                .then((data) => {
                  this.stopLoading();
                  this._create();
                });
            });
          });
        });
      });
    });
  }

  static async load(url) {
    const response = await fetch(url);
    const data = await response.json();

    return Promise.resolve(data);
  }

  _create() {
    let planetCard = null;
    
    this.planets.forEach((planet) => {
      const { name, terrain, population } = planet;

      planetCard = document.createElement("div");
      planetCard.classList.add("box");
      planetCard.innerHTML = this._render({
        name: name,
        terrain: terrain,
        population: population,
      });

      document.body.querySelector(".main").appendChild(planetCard);
    });
  }

  startLoading() {
    this._loading.style.visibility = "visible";
  }

  stopLoading() {
    this._loading.style.visibility = "hidden";
  }

  _render({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }
}
