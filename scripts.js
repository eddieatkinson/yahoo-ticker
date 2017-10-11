// 1. Give the user the ability to send a stock symbol.
// 2. Get the symbol.
// 3. Once submitted, make AJAX request to yahoo.
// 4. Get the response from Yahoo and update the DOM.

$(document).ready(()=>{
	var firstView = true;
	$('.yahoo-finance-form').submit((event)=>{
		// Stop the browser from sending the page on...we will handle it
		event.preventDefault();
		var stockSymbol = $('#ticker').val();
		var url = `http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22${stockSymbol}%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json`;
		$.getJSON(url, (theDataJSFound)=>{
			console.log(theDataJSFound);
			var numFound = theDataJSFound.query.count
			var newRow = '';
			if(numFound > 1){
				// We have multiples
				theDataJSFound.query.results.quote.map((stock)=>{
					newRow += buildRow(stock);
				})
			}else{
				var stockInfo = theDataJSFound.query.results.quote;
				newRow = buildRow(stockInfo);
			}
			
			if(firstView){
				$('#stock-table-body').html(newRow);
				firstView = false;
			}else{
				$('#stock-table-body').append(newRow);
			}
		})
	})
	function buildRow(stockInfo){
		if(stockInfo.Change.indexOf('+') > -1){
				// The stock is up!
				var classChange = "success";
			}else{
				var classChange = "danger";
			}
			var newRow = '';
			newRow += `<tr>`;
				newRow += `<td>${stockInfo.Symbol}</td>`;
				newRow += `<td>${stockInfo.Name}</td>`;
				newRow += `<td>$ ${stockInfo.Ask}</td>`;
				newRow += `<td>$ ${stockInfo.Bid}</td>`;
				newRow += `<td class="bg-${classChange}">${stockInfo.Change}</td>`;
			newRow += `</tr>`;
			return newRow;
	}	
})