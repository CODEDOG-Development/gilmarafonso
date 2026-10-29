# Gilmar Afonso Company Store — protótipo de e-commerce

## Como executar
1. Extraia o ZIP.
2. Abra `index.html` no navegador. Para melhor compatibilidade, você também pode iniciar um servidor local na pasta:
   - Python: `python -m http.server 8000`
   - Acesse `http://localhost:8000`.

## Funcionalidades incluídas
- Página responsiva baseada na referência visual enviada.
- Catálogo de produtos e filtros por categoria.
- Busca de produtos.
- Carrinho com quantidade, remoção e subtotal.
- Cadastro e login demonstrativos no navegador.
- Checkout com endereço, cálculo ilustrativo de frete e desconto Pix demonstrativo.
- Formas de pagamento selecionáveis e confirmação de pedido de demonstração.
- Newsletter demonstrativa.

## Importante antes de publicar
Este projeto é um protótipo front-end. Cadastro e login usam `localStorage`, portanto **não são seguros para produção**. O checkout não envia o pedido a um servidor e **não processa pagamento real**. Não use dados reais de cartão.

Para um e-commerce de produção, implemente:
- Backend/API (por exemplo, Python + Flask) e banco de dados.
- Autenticação segura, senhas com hash e recuperação de senha.
- Gestão de estoque, pedidos, frete e políticas de troca/devolução.
- Gateway de pagamento (por exemplo, Mercado Pago, PagSeguro ou Stripe), preferencialmente com checkout/tokenização hospedada.
- HTTPS, validação no servidor, proteção contra fraude e adequação à LGPD.

As oito fotos enviadas pelo usuário foram incluídas localmente na pasta `assets/` e associadas às categorias correspondentes. Para substituir uma foto, troque o arquivo na pasta `assets/` ou atualize o caminho em `app.js` e `index.html`.
