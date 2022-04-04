// import * as d3 from "d3";

// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 660 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

function draw_boxchart() {
  let svg = d3.select("#price-boxchart-div")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .attr("style", "padding: 10")

  d3.csv("https://raw.githubusercontent.com/chintseng/my_csv_file/master/wine_under_100.csv")
    .then(function(data) {
      const n = 20

      let bins = d3.bin()
        .thresholds(n)
        .value(d => d.price)
        (data).map(bin => {
          bin.sort((a, b) => a.points - b.points);
          const values = bin.map(d => d.points);
          const min = values[0];
          const max = values[values.length - 1];
          const q1 = d3.quantile(values, 0.25);
          const q2 = d3.quantile(values, 0.50);
          const q3 = d3.quantile(values, 0.75);
          const iqr = q3 - q1;
          const r0 = Math.max(min, q1 - iqr * 1.5);
          const r1 = Math.min(max, q3 + iqr * 1.5);
          bin.quartiles = [q1, q2, q3];
          bin.range = [r0, r1];
          bin.outliers = bin.filter(v => v.points < r0 || v.points > r1);
          return bin
      })

      const g = svg.append("g")
                  .selectAll("g")
                  .data(bins)
                  .join("g");

      const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, "s"))

      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -5)
        .attr("x",0 - (height / 2))
        .attr("style", "padding:4")
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Points");
  

      const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(n).tickSizeOuter(0))

      g.append("text")             
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .text("Price");

      const y = d3.scaleLinear()
        .domain([d3.min(bins, d => d.range[0]), d3.max(bins, d => d.range[1])]).nice()
        .range([height - margin.bottom, margin.top])

      const x = d3.scaleLinear()
        .domain([d3.min(bins, d => d.x0), d3.max(bins, d => d.x1)])
        .rangeRound([margin.left, width - margin.right])

        var tooltip = d3.select("#stack-barchart-div")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("position", "absolute")

      var mouseover = function(event, d) {
        tooltip
        .html("Quartile-3: " + d.quartiles[2] + "<br>" + "Median: " +  d.quartiles[1] + "<br>" + "Quartile-1: " + d.quartiles[0])
        .style("opacity", 1)
      }
      var mousemove = function(event, d) {
        tooltip
        .style("left", (event.x/2+140) + "px")
          .style("top", window.scrollY + (event.y/2) + 100 + "px")
      }
      var mouseleave = function(event, d) {
        tooltip
          .style("opacity", 0)
      }

      g.append("path")
        .attr("stroke", "currentColor")
        .attr("fill", "#311B92")
        .attr("d", d => `
        M${x((d.x0 + d.x1) / 2)},${y(d.range[1])}
        V${y(d.range[0])}
      `);

      g.append("path")
        .attr("fill", "#D1C4E9")
        .attr("d", d => `
        M${x(d.x0) + 1},${y(d.quartiles[2])}
        H${x(d.x1)}
        V${y(d.quartiles[0])}
        H${x(d.x0) + 1}
        Z
      `)        .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

      g.append("path")
        .attr("stroke", "currentColor")
        .attr("fill", "#311B92")
        .attr("stroke-width", 2)
        .attr("d", d => `
        M${x(d.x0) + 1},${y(d.quartiles[1])}
        H${x(d.x1)}
        `);

      svg.append("g")
        .call(xAxis);

      svg.append("g")
        .call(yAxis);

    })
    .catch(function(error) {
      console.log(error)
  });
}



draw_boxchart();
