$(document).ready(function(){

var drawCharts = function (){
	this.data = [];
	this.chartData = [];
}

drawCharts.prototype.getData = function (){

	 var callBackFunction = function (responses) {
		var items = responses['data'].reverse();
		for (var i = 0; i < items.length; i++) {
			this.data.push({
				x: new Date(items[i][0]),
				y: items[i][1]
			})
		}
		var weeklyAve = this.fixData(this.data, 1)
		var monthlyAve = this.fixData(this.data, 4);
		var quarterlyAve = this.fixData(this.data, 12);
		var yearlyAve = this.fixData(this.data, 48);
		this.chartData.push({
				name: "weekly average",
				data: weeklyAve
			},{
				name: "monthly average",
				data: monthlyAve
			},{
				name: "quarterly average",
				data: quarterlyAve
			},{
				name: "yearly average",
				data: yearlyAve
			}
		);
		this.drawChart();
	}

	$.ajax({
		context: this,
		type: "GET",
		url: 'https://www.quandl.com/api/v1/datasets/BTS_MM/RETAILGAS.json?trim_start=1995-01-02&trim_end=2012-10-15&auth_token=E6kNzExHjay2DNP8pKvB',
		success: callBackFunction
	})
}

drawCharts.prototype.fixData = function (data, week){
	var fixedData = [];
	for (var a = week; a <= data.length; a++) {
		var sum = 0;
		var stop = a - 1 - week;
		for (var b = (a - 1); b > stop; b--) {
			sum += data[b].y
		}
		var average = sum/week;
		fixedData.push({
			x: data[a - 1].x,
			y: average
		})
	}
	return fixedData;
}

drawCharts.prototype.drawChart = function (){
	$('#chart').highcharts({
		title: {
			text: "Historical Gas Prices"
		},
		subtitle: {
			text: "quandl"
		},
		xAxis: {
			type: "datetime"
		},
		yAxis: {
			title: {
				text: "dollar(maybe?)"
			}
		},
		legend: {
			align: "right",
			layout: "vertical",
			verticalAlign: "top",
			y: 160
		},
		series: this.chartData
	})

}

var drawcharts = new drawCharts;
drawcharts.getData();

});