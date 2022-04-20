# Design study for energy

## Our Website

[https://design-study-energy.web.app/](https://design-study-energy.web.app/)

(Sorry about forgotting to include the web url when first submiited!)

(Feel free to route to our vis dashboard in the website)

## Precondition
 1. **Learning**
At the 2018 United Nations Climate Change Conference, 15 year old climate change activist Greta Thunberg sent shockwaves around the world through her striking and scathing speech criticising the leaders of the world for their inaction towards global warming. Although global warming has been increasingly calamitous for the past few decades, Thunberg’s speech pushed us to evaluate our carbon footprint. In contemporary society, energy consumption is integrated into every mechanism of our lives: transportation, shelter, communication, commerce, and more, are all heavily influenced by our demand for energy.
In this study, we’ll be investigating one component of energy demand: transportation. This sector accounts for over 7 billion metric tons of CO2 emissions each year. To that end, the advent of electric modes of transportation over the last decade has challenged the foothold that conventional cars have in the energy sector. The dichotomy between EV’s and conventional cars is of great concern for how individuals directly drive global energy consumption.
 2. **Winnowing**
 We consulted statistics from the CORGIS Dataset to understand the cost per kWH in the US on a state by state level. This informs us on the relative stability of electricity and the cost for EV users. In addition, we consulted outside sources such as the Department of Energy, the Environmental Protection Agency, and more to confer time series data about the price of gasoline over time, the average fuel economy of conventional vehicles, and other statistics inherent to conventional driving.
## Core
 3.  **Discover**
 - Task 1
	 - Why is a task pursued?
		 -  To get a baseline about gas costs.	
    -   What does a task seek to learn about the data?
	    -   To understand the overarching landscape of gasoline since it’s a major component of the transportation sector and also has numerous flaws.
    -   Where does the task operate?
	    -   Cost data over time in addition to historical records of price-changing events.
    -   When is the task performed?
	    -   Beginning.
    -   Who is executing the task?
-  Task 2: Electric Cost over Time (Stability)
    -   Why is a task pursued?
	    -   Understand an alternative to gasoline.
    -   What does a task seek to learn about the data?
	    -   See if the features of gasoline are also evident in the sales of electricity.
    -   Where does the task operate?
	    -   CORDIS dataset for electricity price.
    -   When is the task performed?
	    -   After, or in parallel to, Task 1
    -   Who is executing the task?
-  Task 3: Car Sales over Time (EV and Conventional)
    -   Why is a task pursued?
	    -   Understand the car sector.
    -   What does a task seek to learn about the data?
	    -   The task is looking to understand trends in adoption rates for new modes of transportation. An alternative exists, are people accordingly switching over?
    -   Where does the task operate?
	    -   Car sales data.
    -   When is the task performed?
	    -   After Tasks 1 and 2.
    -   Who is executing the task?
-  Task 4: Current Cost of Car Usage per Mile by State for EV and Conventional
    -   Why is a task pursued?
	    -   The overarching capstone, to understand how energy relates to our modes of transportation. To understand how we, the individual, impact energy consumption with driving.
    -   What does a task seek to learn about the data?
	    -   Is it more price efficient and environmentally efficient to drive EV?
    -   Where does the task operate?
	    -   EPA data for Fuel Economy.
    -   When is the task performed?
	    -   At the end.
    -   Who is executing the task?
4. **Design**
![enter image description here](https://raw.githubusercontent.com/VisDesignStudies/module-three-design-study-lite-chintseng/main/public/asset/image/1.png)
![enter image description here](https://github.com/VisDesignStudies/module-three-design-study-lite-chintseng/blob/main/public/asset/image/2.png?raw=true)
![enter image description here](https://github.com/VisDesignStudies/module-three-design-study-lite-chintseng/blob/main/public/asset/image/3.png?raw=true)
![enter image description here](https://github.com/VisDesignStudies/module-three-design-study-lite-chintseng/blob/main/public/asset/image/4.png?raw=true)

5. **Implement**
We decided to use D3.js as our data visualization tool because it provides the flexibility to provide dynamic properties for most of its functions and a very variable Interaction for users. Furthermore, we can embed visualization made by D3.js on web pages, which facilitates our use of real-time data and maintenance and update.
6. **Deploy**
For the visualization, we first present the line chart of commercial sector energy price and expenditure estimates for task 1. After understanding the commercial energy price, we build the bar chart for U.S. average retail price per kilowatt-hour in task 2. Task 3 shows the car sales by size and powertrain by using the pie chart and percent stacked column chart. We use map charts to show the electricity profiles in each state between 2019 and 2020. By knowing further the price difference between gasoline and electric cost for the car, we also applied the lollipop chart to show dollars cost per mile for electric vehicles and conventional cars.
7. **Iterate**
Building on what we accomplished with the visualizations we’ve already created, we can go further by factoring in the MSRP and variable maintenance costs of conventional versus electric vehicles. For instance, the MSRP of the 2022 Camry is $25,395 and the 2022 Camry Hybrid is $27,480. Nevertheless, while there is a tangible difference in this case, it is difficult to find a comparable alternative to a given EV or conventional car.
## Analysis
8. **Reflect, Pt 1**
Supporting EV ventures for the future is a good path forward, due to the relatively low price per mile of driving. Car sales are trending in this direction, since EV sales are making up an increasingly larger portion of the marketshare. Moreover, volatility in the economy of gas prices can be explained by various events and milestones, such as the 2008 recession in particular. Nevertheless, regardless of inflection points in the past, it is evident that electric vehicles will provide a stable mode of transportation going forward.
9. **Reflect, Pt2**
Since our target problem is the transportation sector, it’s important to present the problem as a dichotomy. For our domain of interest, there are two different choices that car drivers can take (EV and Conventional) and we have to orient the kinds of data visualizations we use to reflect that. Although there are holistic aspects of the driving experience that cannot or should not extend the aforementioned dichotomy, the crux of the consumer transportation sector is between combustion engines (gasoline or diesel) and electric ones.  