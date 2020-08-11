module.exports.listAllticker = async () => {
    try {
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        //Seta o tamanho da página
        await page.setViewport({ width: 1900, height: 1080 });
        //Vai para o site
        await page.goto(
            'https://statusinvest.com.br/acoes/busca-avancada',
            { waitUntil : ['load', 'domcontentloaded']
        });
        //Clica no botão de pesquisar os ativos
        await page.click('.find');
        //Espera a lista ser carregada
        await page.waitForFunction(
            text => document.querySelector('body').innerText.includes(text), {}, "RESULTADO DA BUSCA"
        );
        //Seleciona a opção de buscar todos ativos de uma vez
        await page.select("select.small", "-1")

        //Delay para carregar a tela com todos os ativos
        await page.waitFor(5000)

        //Transforma a tabela de ativos em JSON
        const data = await page.evaluate(
            () => Array.from(
            document.querySelectorAll('table > tbody > tr'),
            row =>{
                let arr = Array.from(row.querySelectorAll('th, td'), cell => cell.innerText);
                return {
                ticket: arr[0].replace("\narrow_forward", ""),
                preco: arr[1],
                p_l: arr[2],
                dy: arr[3],
                p_vp: arr[4],
                p_ebit: arr[5],
                p_ativos: arr[6],
                ev_ebit: arr[7],
                margemBruta: arr[8],
                margemEbit: arr[9],
                margemLiquida: arr[10],
                psr: arr[11],
                p_capGiro: arr[12],
                p_ativoCircLiq: arr[13],
                giroAtivos: arr[14],
                roe: arr[15],
                roa: arr[16],
                roic: arr[17],
                dividaLiquida_patrimonio: arr[18],
                dividaLiquida_ebit: arr[19],
                patrimonio_ativos: arr[20],
                passivos_ativos: arr[21],
                liquidezCorrente: arr[22],
                receita5Anos: arr[23],
                lucro5Anos: arr[24],
                liquidezMediaDiaria: arr[25],
                }
            }
            )
        );
        //Fecha a conexão
        await browser.close();
        return data
    } catch (err) {
        return err;
    }
}