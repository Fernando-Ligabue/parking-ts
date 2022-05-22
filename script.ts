interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
    clientId?: string;
}

interface Pessoa{
    nome: string;
    cpf: string;
}

interface Cliente extends Pessoa{
    veiculos: Veiculo[];
}

(function() {
    const $ = (query : string): HTMLInputElement | null => document.querySelector(query);

    function calcTime(mil : number){
        const min = Math.floor(mil / 60000);
        const sec = Math.floor(mil % 60000);

        return `${min}m e ${sec}s`;
    }

    function patio(){
        function read() : Veiculo []{
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function save( veiculos : Veiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }

        function adicionar(veiculo : Veiculo & { cupom?: string }, salvo?: boolean){
            const row = document.createElement("tr");

            row.innerHTML= `
            <td class="item">${veiculo.nome}</td>
            <td class="item">${veiculo.placa}</td>
            <td class="item">${veiculo.entrada}</td>
            <td class="delete" data-placa="${veiculo.placa}"><button> X </button></td>
            `;

            row.querySelector(".delete")?.addEventListener('click', function(){
                remover(this.dataset.placa);
            });

            $("#patio")?.appendChild(row);

            if(salvo) save([...read(), veiculo])
        }

        function remover(placa: string){
            const {entrada, nome} = read().find(veiculo => veiculo.placa);

            const time = calcTime(new Date().getTime() - new Date(entrada).getTime());

            if(!confirm(`O veiculo ${nome} permaneceu por ${time}. Deseja encerrar?`)) return;

            save(read().filter(veiculo => veiculo.placa !== placa));
            render();
        }

        function render(){
            $("#patio")!.innerHTML = "";
            const patio = read();

            if(patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }


        return {read, adicionar, remover, save, render};
    }

    patio().render();

    $('#cadastrar')?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        if(!nome || !placa){
            alert("Ambos os campos são obrigatórios!");
            return;
        }

        patio().adicionar({nome, placa, entrada: new Date().toISOString()}, true)
    });
})();