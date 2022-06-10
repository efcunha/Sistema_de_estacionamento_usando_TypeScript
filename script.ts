// interface - tipico typescript, similar a uma classe
// esse codigo interface nao entra no javascript, serve apenas para auxiliar
interface Veiculo {
  name?: string;
  plate?: string;
  entrance: Date | string;
}

// função anônima
(function () {
  const $ = (query: string): HTMLInputElement | null =>
    document.querySelector(query);

  const calcTime = (milliseconds: number) => {
    // console.log(mil, "mil");
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const min = Math.floor(milliseconds / (1000 * 60));
    const sec = Math.floor((milliseconds % 60000) / 1000);
    return `${hours}h, ${min}m e ${sec}s`;
  };

  const garage = () => {
    const read = (): Veiculo[] => {
      return localStorage.garage ? JSON.parse(localStorage.garage) : [];
    };

    const save = (Veiculos: Veiculo[]) => {
      localStorage.setItem("garage", JSON.stringify(Veiculos));
    };

    const add = (Veiculo: Veiculo, saveIt?: boolean) => {
      //saveit parametro opcional
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${Veiculo.name}</td>
        <td>${Veiculo.plate}</td>
        <td>${Veiculo.entrance}</td>
        <td>
          <button class="delete btn btn-danger" data-plate=${Veiculo.plate}>X</button>
        </td>
      `;

      row
        .querySelector(".delete")
        ?.addEventListener("click", function (this: any) {
          // this marcado, foi retirado o "strict" de tsconfig.json
          remove(this.dataset.plate);
        });

      $("#garage")?.appendChild(row);
      if (saveIt) save([...read(), Veiculo]);
    };

    const remove = (plate: string) => {
      const Veiculo = read().find((Veiculo) => Veiculo.plate === plate);
      // console.log(Veiculo!.name);
      const time = calcTime(
        new Date().getTime() - new Date(Veiculo!.entrance).getTime()
      );
      if (
        !confirm(
          `The Veiculo ${
            Veiculo!.name
          } has been parked for ${time}.\n Do you wish to close it?`
        )
      )
        return;
      save(read().filter((Veiculo) => Veiculo.plate !== plate));
      $("#garage")!.innerHTML = "";
      render();
    };

    const render = () => {
      // por padrao coloca ? , mas da erro, o sinal de ! força o reconhecimento do elemento
      // $("#garage")!.innerHTML = "";

      const garage = read();
      // console.log(garage, "garage");
      if (garage.length) {
        garage.forEach((Veiculo) => add(Veiculo));
      }
    };

    return { read, add, remove, save, render };
  };

  garage().render();

  $("#register")?.addEventListener("click", () => {
    const name = $("#name")?.value;
    const plate = $("#plate")?.value;

    if (!name || !plate) alert("The name and plate are required");

    garage().add({ name, plate, entrance: new Date().toISOString() }, true);
  });
})();
