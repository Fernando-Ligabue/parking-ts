(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTime(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor(mil % 60000);
        return `${min}m e ${sec}s`;
    }
    function patio() {
        function read() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function save(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar(veiculo, salvo) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
            <td class="item">${veiculo.nome}</td>
            <td class="item">${veiculo.placa}</td>
            <td class="item">${veiculo.entrada}</td>
            <td class="delete" data-placa="${veiculo.placa}"><button> X </button></td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                remover(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salvo)
                save([...read(), veiculo]);
        }
        function remover(placa) {
            const { entrada, nome } = read().find(veiculo => veiculo.placa);
            const time = calcTime(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veiculo ${nome} permaneceu por ${time}. Deseja encerrar?`))
                return;
            save(read().filter(veiculo => veiculo.placa !== placa));
            render();
        }
        function render() {
            $("#patio").innerHTML = "";
            const patio = read();
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        return { read, adicionar, remover, save, render };
    }
    patio().render();
    (_a = $('#cadastrar')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert("Ambos os campos são obrigatórios!");
            return;
        }
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();
