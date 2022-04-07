const margin = {top: 10, right: 30, bottom: 60, left: 50},
    width = 500 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_lollipop")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv("https://raw.githubusercontent.com/chintseng/my_csv_file/master/enrgy_data/draft_price_compare_permile_fix.csv").then( function(data) {


  // Add X axis
  const x = d3.scaleLinear()
    .domain([0.01, 0.18])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))

  // Y axis
  const y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.year; }))
    .padding(1);
  svg.append("g")
    .call(d3.axisLeft(y))


    const Tooltip = d3.select("#support-line-chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "#F5F5F5")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("position", "absolute")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(event, d) {
        console.log(d)
      Tooltip
          .html("Year: " +  d.year + "<br/>EV per mile cost: $" + parseFloat(d.evcar_dollerpermile).toFixed(5) + "<br/>Conventional car per mile cost: $" + parseFloat(d.conventionalcar_dollerpermile).toFixed(5))
          .style("opacity", 1)
    }
    var mousemove = function(event, d) {
      Tooltip
      .style("left", (event.x/2+400) + "px")
        .style("top", window.scrollY + (event.y/2) + 100 + "px")
    }
    var mouseleave = function(event, d) {
      Tooltip
        .style("opacity", 0)
    }

  // Lines
  svg.selectAll("myline")
    .data(data)
    .join("line")
      .attr("x1", function(d) { return x(d.evcar_dollerpermile); })
      .attr("x2", function(d) { return x(d.conventionalcar_dollerpermile); })
      .attr("y1", function(d) { return y(d.year); })
      .attr("y2", function(d) { return y(d.year); })
      .attr("stroke", "grey")
      .attr("stroke-width", "1px")

  // Circles of variable 1
  svg.selectAll("mycircle")
    .data(data)
    .join("circle")
      .attr("cx", function(d) { return x(d.evcar_dollerpermile); })
      .attr("cy", function(d) { return y(d.year); })
      .attr("r", "6")
      .style("fill", "#66BB6A")
      .on("mouseover", mouseover)
              .on("mousemove", mousemove)
              .on("mouseleave", mouseleave)

  // Circles of variable 2
  svg.selectAll("mycircle")
    .data(data)
    .join("circle")
      .attr("cx", function(d) { return x(d.conventionalcar_dollerpermile); })
      .attr("cy", function(d) { return y(d.year); })
      .attr("r", "6")
      .style("fill", "#039BE5")
      .on("mouseover", mouseover)
              .on("mousemove", mousemove)
              .on("mouseleave", mouseleave)

// Add legend
          svg.append("circle").attr("cx",0).attr("cy", 670).attr("r", 6).style("fill", "#66BB6A")
          svg.append("circle").attr("cx",100).attr("cy",670).attr("r", 6).style("fill", "#29B6F6")
          svg.append("text").attr("x", 20).attr("y", 670).text("EV Cars").style("font-size", "15px").attr("alignment-baseline", "middle")
          svg.append("text").attr("x", 120).attr("y", 670).text("Conventional Cars").style("font-size", "15px").attr("alignment-baseline","middle")
})