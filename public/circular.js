// set the dimensions and margins of the graph
const width = 500
const height = 400


function draw_circles(country) {
  const svg = d3.select("#circular-div")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "circular-svg")

  let country_csv_url = "https://raw.githubusercontent.com/chintseng/my_csv_file/master/province_points/" + country + ".csv"
  d3.csv(country_csv_url, function(d) {
    return {
      province: d["province"],
      points: +d["points"],
      percentage: +d["percentage"],
    } 
  }).then( function(data) {
  
  
     const color =  d3.scaleSequential()
                          .domain([80, 100])
                          .interpolator(d3.interpolatePuRd)
  
    // Size scale for countries
    const size = d3.scaleLinear()
      .domain([0, 67])
      .range([20,70])  // circle will be between 7 and 55 px wide
  
    // create a tooltip
    const Tooltip = d3.select("#circular-div")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute")
  
    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event, d) {
      Tooltip
        .style("opacity", 1)
    }
    
    const mousemove = function(event, d) {
      Tooltip
        .html("Province: " + d.province + "<br>" + "Average Points: " + d.points.toFixed(2) + "<br>" + "Wine percentage in " + country + ": " + d.percentage.toFixed(5) + "%")
        .style("left", (event.x/2+140) + "px")
        .style("top", window.scrollY + (event.y/2) + 100 + "px")
    }
    var mouseleave = function(event, d) {
      Tooltip
        .style("opacity", 0)
    }
  
    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
        .attr("class", "node")
        .attr("r", d => size(d.percentage))
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", d => color(d.points))
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .call(d3.drag() // call specific function when circle is dragged
             .on("start", dragstarted)
             .on("drag", dragged)
             .on("end", dragended));
  
    // Features of the forces applied to the nodes:
    const simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.percentage)+3) }).iterations(1)) // Force that avoids circle overlapping
  
    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
          node
              .attr("cx", d => d.x)
              .attr("cy", d => d.y)
        });
  
    // What happens when a circle is dragged?
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(.03);
      d.fx = null;
      d.fy = null;
    }
  
  })
}

draw_circles('USA')

$('#country-select').on('change', function(e){
  d3.select("#circular-svg").remove()
  console.log(this.value)
  draw_circles(this.value)
});