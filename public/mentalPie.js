const width = 700,
      height = 500,
      margin = 80;

const radius = Math.min(width, height) / 2 - margin
// https://raw.githubusercontent.com/chintseng/my_csv_file/master/mental.csv
const pie = d3.pie()
              .sort(null)
              .value(d => d.percentage)

let key = function(d){ return d.data.condition; };

const arc = d3.arc()
              .innerRadius(radius * 0.5)
              .outerRadius(radius * 0.8)

const outerArc = d3.arc()
                    .innerRadius(radius * 0.9)
                    .outerRadius(radius * 0.9)

const labels = ["Any mental illness", "Serious mental illness", "No mental illness"]
function randomData (){
    return labels.map(function(label){
        return { label: label, value: Math.random() }
    });
}

 let svg = d3.select("#mental-pie")
          .append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", `translate(${width/2},${height/2})`);

  svg.append("g")
	  .attr("class", "slices");
  svg.append("g")
    .attr("class", "labels");
  svg.append("g")
    .attr("class", "lines");

function updatePie(yearSelect) {
    d3.csv("https://raw.githubusercontent.com/chintseng/my_csv_file/master/mental_marijuna.csv", function(d){
    return { condition: d["mental condition"], percentage: +d[yearSelect] }
  }).then(
    function(data) {


  const color = d3.scaleOrdinal()
                  .domain(labels)
                  .range(d3.schemeDark2);

  let slice = svg.select(".slices").selectAll("path.slice").data(pie(data), key)
    const labelMap = {
      "mental illness": "Any mental illness",
      "serious mental illness": "Serious mental illness",
      "no mental illness": "No mental illness"
    }
  slice
    .enter()
    .insert('path')
    // .attr('d', arc)
    .attr('fill', d => color(labelMap[d.data.condition]))
    .attr("class", "slice")
    .style("opacity", 0.7)
    .attr("d", arc)
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .each(function(d) {
      this._current = d;
    });
  
  slice		
		.transition().duration(1000)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

    let text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	text.enter()
		.append("text")
		// .attr("dy", ".35em")
		.text(function(d) {
			return labelMap[d.data.condition];
		})
    .each(function(d) { this._current = d; });
    // .attr('transform', function(d) {
    //     const pos = outerArc.centroid(d);
    //     const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
    //     pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
    //     return `translate(${pos})`;
    // })
    // .style('text-anchor', function(d) {
    //     const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
    //     return (midangle < Math.PI ? 'start' : 'end')
    // })
	
	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	text.exit()
		.remove();

    var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);
	
	polyline.enter()
		.append("polyline")
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)

	polyline.transition().duration(1000)
		.attrTween("points", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};			
		});
	
	polyline.exit()
		.remove();

    }
    )}

    updatePie('2019')
    updatePie('2019')

$( "#test" ).on( "click", function() {
    updatePie('2019')
  });

$('input[name=mental-pie-radio]').on("change", function() {
  updatePie($(this).val())
})