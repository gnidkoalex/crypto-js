class ChartData{
    constructor(_code,_value,_time){
        this.dataPoints= [{x:_time,y:_value}];
        this.chartData={
        type: "spline",
        name:_code,
        showInLegend: true,  
        xValueFormatString:"HH:mm:ss",
        yValueFormatString:"$#,##0.#",
        dataPoints:this.dataPoints
        }
    }
    
}








