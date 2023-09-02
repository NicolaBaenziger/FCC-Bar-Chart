// Define chart dimensions
const width = 800;
const height = 400;
const margin = { top: 20, right: 20, bottom: 50, left: 50 };

// Create an SVG element
const svg = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);

// Load the data from the JSON file
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(data => {
        // Parse date strings into Date objects
        const dateFormat = d3.timeFormat("%Y-%m-%d");

        data.data.forEach(item => {
          item[0] = new Date(item[0]);
          item[2] = dateFormat(item[0]); // Add the correctly formatted date as the third element
      });

        // Create scales for x and y axes
        const xScale = d3.scaleTime()
            .domain([d3.min(data.data, d => d[0]), d3.max(data.data, d => d[0])])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data.data, d => d[1])])
            .range([height - margin.bottom, margin.top]);

        // Create and append the x-axis
        const xAxis = d3.axisBottom(xScale);
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);

        // Create and append the y-axis
        const yAxis = d3.axisLeft(yScale);
        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);

        // Create and append the bars
        svg.selectAll(".bar")
          .data(data.data)
          .enter()
          .append("rect")
          .attr("data-date", d => d[2]) // Use the correctly formatted date
          .attr("data-gdp", d => d[1])
          .attr("x", d => xScale(d[0]))
          .attr("y", d => yScale(d[1]))
          .attr("width", (width - margin.left - margin.right) / data.data.length)
          .attr("height", d => height - margin.bottom - yScale(d[1]))
          .attr("class", "bar")
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut);
    });

// Tooltip handling functions
function handleMouseOver(event, d) {
    const tooltip = d3.select("#tooltip");
    tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
    
    // Format the date to match '1957-04-01'
    const dateFormat = d3.timeFormat("%Y-%m-%d");
    const formattedDate = dateFormat(d[0]);

    tooltip.html(`${formattedDate}<br>$${d[1].toFixed(1)} Billion`)
        .attr("data-date", formattedDate) // Use the correctly formatted date
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 30 + "px");
}

function handleMouseOut() {
    const tooltip = d3.select("#tooltip");
    tooltip.transition()
        .duration(200)
        .style("opacity", 0);
}