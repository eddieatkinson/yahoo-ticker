// 1. Give the user the ability to send a stock symbol.
// 2. Get the symbol.
// 3. Once submitted, make AJAX request to yahoo.
// 4. Get the response from Yahoo and update the DOM.

$(document).ready(()=>{

	// setItem takes 2 args:
	// 1. Name of the var
	// 2. Value to set
	// var watchList = [
	// 	"goog",
	// 	"msft",
	// 	"tsla",
	// 	"tata",
	// 	"race"
	// ];
	// // Localstorage, like web servers, can only take strings
	// // Enter...JSON stringify
	// var watchListAsString = JSON.stringify(watchList);

	// console.log(typeof(watchList));
	// console.log(typeof(watchListAsString));

	// console.log(watchList);
	// console.log(watchListAsString);

	// // How do we get it back into an object?
	// // Enter...JSON parse
	// var watchListAsAnObjectAgain = JSON.parse(watchListAsString);
	// console.log(watchListAsAnObjectAgain);

	// localStorage.setItem('watchList', 'race');
	// var watchList = localStorage.getItem('watchList');
	// console.log(watchList); // 'race'


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
			$('td button').click(function(){
				// Add a click listener to all the buttons in the tables.
				// When clicked on, save the symbol to localStorage.
				var stockToSave = $(this).attr('symbol'); // Get the saved stock symbol (an array).
				var oldWatchList = localStorage.getItem('watchList'); // Get the old list (a string, because it's in storage).
				// oldWatchList just came out of localStorage. Like Christmas lights,
				// they come out tangled and must be dealt with --> JSON.parse().
				var oldAsJSON = JSON.parse(oldWatchList); // Turn the old list into an array.
				// JSON.parse() has just untangled our lights. We have an object/array.

				// If the user has never saved anything, there will be nothing
				// to parse. This will return null in JSON.
				if(oldAsJSON === null){ // If the old list is empty...
					oldAsJSON = [];
				}
				oldAsJSON.push(stockToSave); // Add the new stock symbol to the old list (an array).
				// console.log(oldAsJSON); // 
				var newWatchListAsString = JSON.stringify(oldAsJSON); // Turn the appended list (array) into a string for storage.
				localStorage.setItem('watchList', newWatchListAsString); // Put the new list (now a string) into localStorage.
			})
		})
	})
	function buildRow(stockInfo){
		if(stockInfo.Change === null){
			stockInfo.Change = 'MARKET CLOSED';
			var classChange = "warning";
		}else{
			if(stockInfo.Change.indexOf('+') > -1){
				// The stock is up!
				var classChange = "success";
			}else{
				var classChange = "danger";
			}
		}
		var newRow = '';
		newRow += `<tr>`;
			newRow += `<td>${stockInfo.Symbol}</td>`;
			newRow += `<td>${stockInfo.Name}</td>`;
			newRow += `<td>$ ${stockInfo.Ask}</td>`;
			newRow += `<td>$ ${stockInfo.Bid}</td>`;
			newRow += `<td class="bg-${classChange}">${stockInfo.Change}</td>`;
			newRow += `<td><button symbol=${stockInfo.Symbol} class="btn btn-success">Save</button></td>`
			newRow += `<td><button symbol=${stockInfo.Symbol} class="btn btn-danger">Delete</button></td>`
		newRow += `</tr>`;
		return newRow;
	}	
})