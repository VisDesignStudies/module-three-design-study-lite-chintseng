const svg = d3.select("#my_dataviz"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

const projection = d3.geoMercator()
  .scale(450) // This is the zoom
  .translate([1300, 600]); // You have to play with these values to center your map

// Path generator
const path = d3.geoPath()
  .projection(projection)

// Data and color scale
let data = new Map()

Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/us_states_hexgrid.geojson.json"),
    d3.csv("https://raw.githubusercontent.com/chintseng/my_csv_file/master/state_legalization.csv", function(d) {
        data.set(d.iso3166_2, d.legal)
    })
    ]).then(function(loadData){

        const color = d3.scaleOrdinal()
        .domain(['I', 'L', 'M'])
        .range(['#BDBDBD', '#CDDC39', '#29B6F6'])

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
      Tooltip
          .html("State: " +  d.properties.google_name)
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

        // Add legend
        svg.append("circle").attr("cx",200).attr("cy",420).attr("r", 6).style("fill", "#BDBDBD")
        svg.append("circle").attr("cx",200).attr("cy",450).attr("r", 6).style("fill", "#29B6F6")
        svg.append("circle").attr("cx",200).attr("cy",480).attr("r", 6).style("fill", "#CDDC39")
        svg.append("text").attr("x", 220).attr("y", 420).text("Illegal").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 220).attr("y", 450).text("Legal medical marijuana use").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 220).attr("y", 480).text("Legal medical & recreational marijuana use").style("font-size", "15px").attr("alignment-baseline","middle")


        // Draw map
        let topo = loadData[0]
        svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
            .attr("fill", d => color(data.get(d.properties.iso3166_2)))
            .attr("d", path)
            .attr("stroke", "white")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    
        // Add the labels
        svg.append("g")
            .selectAll("labels")
            .data(topo.features)
            .join("text")
            .attr("x", function(d){return path.centroid(d)[0]})
            .attr("y", function(d){return path.centroid(d)[1]})
            .text(function(d){ return d.properties.iso3166_2})
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .style("font-size", 11)
            .style("fill",  '#000')

    })

    // Data source = https://marijuana.procon.org/legal-recreational-marijuana-states-and-dc/