window.ws = new WebSocket("wss://ws-feed.gdax.com");

const numberWithCommas = (x) => {
  x = parseFloat(x).toFixed(2);
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return parts.join('.');
}

Vue.filter('dollar', function(el) {
  return numberWithCommas(el);
});

Vue.filter('nameify', function(el) {
  el = el.split('-')[0];
  switch(el) {
    case 'BTC':
      el = 'Bitcoin'
      break;
    case 'ETH':
      el = 'Ethereum'
      break;
    case 'LTC':
      el = 'Litecoin'
      break;
  }
  return el;
});

var app = new Vue({
  el: '#app',
  data: {
    coins: {
      btc: {product_id: 'BTC-USD'},
      eth: {product_id: 'ETH-USD'},
      ltc: {product_id: 'LTC-USD'}
    }
  },
  mounted() {

    var params = {
      "type": "subscribe",
      "channels": [{
          "name": "ticker",
          "product_ids": [
            "ETH-USD",
            "BTC-USD",
            "LTC-USD"
          ]
        }
      ]
    }

    window.ws.onopen = () => {
      window.ws.send(JSON.stringify(params));
    }

    window.ws.onmessage = (msg) => {
      var data = JSON.parse(msg.data);
      if(data.type === 'ticker') {
        var product = data.product_id;

        switch(product) {
          case 'BTC-USD':
            this.coins.btc = data;
            break;
          case 'ETH-USD':
            this.coins.eth = data;
            break;
          case 'LTC-USD':
            this.coins.ltc = data;
            break;
        }
      }
    }
  }
})
