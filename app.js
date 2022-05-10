//@ts-check


const BANDS = {
    B24GHZ: {
        START_GHZ: 2.4,
        STOP_GHZ: 2.5,
        SPACE_GHZ: 0.022,
        GHZ_CHANNEL: {
            [2.412]: 1,
            [2.417]: 2,
            [2.422]: 3,
            [2.427]: 4,
            [2.43]: 5,
            [2.437]: 6,
            [2.442]: 7,
            [2.447]: 8,
            [2.452]: 9,
            [2.457]: 10,
            [2.462]: 11,
            [2.467]: 12,
            [2.472]: 13,
            [2.484]: 14,
        },
        CHANNEL_GHZ: {
            1: 2.412,
            2: 2.417,
            3: 2.422,
            4: 2.427,
            5: 2.432,
            6: 2.437,
            7: 2.442,
            8: 2.447,
            9: 2.452,
            10: 2.457,
            11: 2.462,
            12: 2.467,
            13: 2.472,
            14: 2.484,
        },
    },
    B5GHZ: {
        START_GHZ: 5.1,
        STOP_GHZ: 6.16,
        SPACE_GHZ: 0.020,
        GHZ_CHANNEL: {
            [5.180]: 36,
            [5.200]: 40,
            [5.220]: 44,
            [5.240]: 48,
            [5.260]: 52,
            [5.280]: 56,
            [5.300]: 60,
            [5.320]: 64,
            [5.500]: 100,
            [5.520]: 104,
            [5.540]: 108,
            [5.560]: 112,
            [5.580]: 116,
            [5.600]: 120,
            [5.620]: 124,
            [5.640]: 128,
            [5.660]: 132,
            [5.680]: 136,
            [5.700]: 140,
            [5.745]: 149,
            [5.765]: 153,
            [5.785]: 157,
            [5.805]: 161,
            [5.920]: 184,
            [5.940]: 188,
            [5.960]: 192,
            [5.980]: 196,
            [6.100]: 200,
            [6.020]: 204,
            [6.040]: 208,
            [6.060]: 212,
            [6.080]: 216,
        },
        CHANNEL_GHZ: {
            36: 5.180,
            40: 5.200,
            44: 5.220,
            48: 5.240,
            52: 5.260,
            56: 5.280,
            60: 5.300,
            64: 5.320,
            100: 5.500,
            104: 5.520,
            108: 5.540,
            112: 5.560,
            116: 5.580,
            120: 5.600,
            124: 5.620,
            128: 5.640,
            132: 5.660,
            136: 5.680,
            140: 5.700,
            149: 5.745,
            153: 5.765,
            157: 5.785,
            161: 5.805,
            184: 5.920,
            188: 5.940,
            192: 5.960,
            196: 5.980,
            200: 6.100,
            204: 6.020,
            208: 6.040,
            212: 6.060,
            216: 6.080,
        },
    },
}


///////////////////////
///////////////////////
// Utils function

const aggregator = {};

const getColor = (name, opacity = 1) => {
    if(aggregator[name]) return aggregator[name];
    
    let color = `rgba(${ randomIntFromInterval(1, 255) },${ randomIntFromInterval(1, 255) },${ randomIntFromInterval(1, 255) },${ opacity })`;

    switch(name) {
        case 'A': color = `rgba(156,39,176,${ opacity })`; break;
        case 'B': color = `rgba(180,12,111,${ opacity })`; break;
        case 'C': color = `rgba(75,39,21,${ opacity })`; break;
        case 'D': color = `rgba(156,200,176,${ opacity })`; break;
        case 'E': color = `rgba(16,39,102,${ opacity })`; break;
        case 'F': color = `rgba(222,222,122,${ opacity })`; break;
        case 'G': color = `rgba(222,111,122,${ opacity })`; break;
        case 'H': color = `rgba(125,95,221,${ opacity })`; break;
        case 'I': color = `rgba(50,225,170,${ opacity })`; break;
        case 'J': color = `rgba(190,156,225,${ opacity })`; break;
        case 'K': color = `rgba(22,98,199,${ opacity })`; break;
        case 'L': color = `rgba(69,156,45,${ opacity })`; break;
    }

    aggregator[name] = color;
    return color;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


class WifiFreqChart {
    // WIDTH;
    // HEIGHT;
    // BORDER;
    
    // START_GHZ;
    // STOP_GHZ;
    // SPACE_GHZ;
    // GHZ_CHANNEL;
    // CHANNEL_GHZ;

    // container;
    // scaleX;
    // scaleY;
    // axisX;
    // axisY;
    // svg;
    // elMain;
    // elContainer;
    // elAxisX;
    // elAxisY;
    
    // lineGenerator;
    // data;
    // selectedEssid;

    constructor(elem, band, data, w, h) {
        this.container = elem;
        this.WIDTH = w;
        this.HEIGHT = h;
        this.BORDER = 50;
        this.durationTransition = 500;
        
        this.START_GHZ = (band === 5) ? BANDS.B5GHZ.START_GHZ :  BANDS.B24GHZ.START_GHZ;
        this.STOP_GHZ = (band === 5) ? BANDS.B5GHZ.STOP_GHZ :  BANDS.B24GHZ.STOP_GHZ;
        this.SPACE_GHZ = (band === 5) ? BANDS.B5GHZ.SPACE_GHZ :  BANDS.B24GHZ.SPACE_GHZ;
        this.GHZ_CHANNEL = (band === 5) ? BANDS.B5GHZ.GHZ_CHANNEL :  BANDS.B24GHZ.GHZ_CHANNEL;
        this.CHANNEL_GHZ = (band === 5) ? BANDS.B5GHZ.CHANNEL_GHZ :  BANDS.B24GHZ.CHANNEL_GHZ;
        this.id = `band-${ band }-${ randomIntFromInterval(1, 1000000) }`;
        
        this.lineGenerator = d3.line().curve(d3.curveMonotoneX);
        this.data = [];
        this.selectedEssid = '';
        
        this.data = data;
        this.maxPower = d3.max(this.data.filter(d => this.CHANNEL_GHZ[d.channel]), d => d.power);

        this.buildDom();
        this.updateData(data);
    }

    buildDom() {
        this.scaleX = d3.scaleLinear()
            .range([0, this.WIDTH-this.BORDER*2])
            .domain([this.START_GHZ, this.STOP_GHZ])
        
        this.scaleY = d3.scaleLinear()
            .range([this.HEIGHT-this.BORDER*2, 0])
            .domain([-110, this.maxPower]);
        
        this.axisX = d3.axisBottom(this.scaleX)
            .tickValues(Object.keys(this.GHZ_CHANNEL).map(k => Number(k)))
            .tickFormat(f => this.GHZ_CHANNEL[f] || f);
    
        this.axisY = d3.axisLeft(this.scaleY);
    
        this.svg = this.container.append('svg')
            .attr('width', this.WIDTH)
            .attr('height', this.HEIGHT);
    
        this.svg.append('defs')
            .append('clipPath')
                .attr('id', `clip-${ this.id }`)
            .append('rect')
                .attr('width', this.WIDTH-this.BORDER*2)
                .attr('height', this.HEIGHT-this.BORDER*2)
                .style('fill', 'red');
    
        this.elMain = this.svg.append('g')
            .attr('class', 'main')
            .attr('transform', 'translate(' + this.BORDER + ',' + this.BORDER + ')');
    
        this.elAxisX = this.elMain.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + (this.HEIGHT-this.BORDER*2) + ')')
            .call(this.axisX);
        
        this.elAxisY = this.elMain.append('g')
            .attr('class', 'axis axis--y')
            .call(this.axisY);
    
        this.elContainer = this.elMain.append('g')
            .attr('class', 'container')
            .attr('clip-path', `url(#clip-${ this.id })`);
        
        // Legend
        
        this.elMain.append('text')
            .attr('class', 'label-x')
            .attr('transform', `translate(${ (this.WIDTH - 2*this.BORDER)/2 } ,${ this.HEIGHT - this.BORDER*1.2 })`)
            .style('text-anchor', 'middle')
            .text('Channel');

        this.elMain.append('text')
            .attr('class', 'label-y')
            .attr('transform', 'rotate(-90)')
            .attr('y', -this.BORDER)
            .attr('x', -(this.HEIGHT - 2*this.BORDER) / 2)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Power'); 
    }

    resize(w, h) {
        this.WIDTH = w;
        this.HEIGHT = h;
        
        // UPDATE UI ELEMS

        this.scaleX.range([0, this.WIDTH-this.BORDER*2]);
        this.scaleY.range([this.HEIGHT-this.BORDER*2, 0]).domain([-110, this.maxPower]);
    
        this.svg.attr('width', this.WIDTH).attr('height', this.HEIGHT);
        this.svg.select('clipPath').select('rect').attr('width', this.WIDTH-this.BORDER*2).attr('height', this.HEIGHT-this.BORDER*2);
    
        this.elMain.attr('transform', 'translate(' + this.BORDER + ',' + this.BORDER + ')');
        this.elAxisX.attr('transform', 'translate(0,' + (this.HEIGHT-this.BORDER*2) + ')').call(this.axisX);
        this.elAxisY.call(this.axisY);
        
        this.elMain.select('.label-x')             
            .attr('transform', `translate(${ (this.WIDTH - 2*this.BORDER)/2 } ,${ this.HEIGHT - this.BORDER*1.2 })`);

        this.elMain.select('.label-y')
            .attr('y', -this.BORDER)
            .attr('x', -(this.HEIGHT - 2*this.BORDER) / 2); 

        // UPDATE DATA ELEMS

        const allEssids = this.elContainer.selectAll('.essid').data(this.data, d => d.essid);
        
        allEssids.attr('transform', d => `translate(${ this.scaleX(this.CHANNEL_GHZ[d.channel]) }, 0)`);
        allEssids.select('.pathClickable').attr('d', d => this.buildCurvePoints(d));
        allEssids.select('.pathVisual').attr('d', d => this.buildCurvePoints(d));
        allEssids.select('text').attr('y', d => this.setTextPosition(d));
    }
    
    updateData(data) {
        this.data = data;
        
        const newMaxPower = d3.max(this.data.filter(d => this.CHANNEL_GHZ[d.channel]), d => d.power);

        if(newMaxPower > this.maxPower) {
            this.maxPower = newMaxPower;
            this.resize(this.WIDTH, this.HEIGHT);
        }

        const essids = this.elContainer.selectAll('.essid').data(this.data, d => d.essid);
    
        const exitEssids = essids.exit()
            .transition()
            .duration(this.durationTransition).remove();
        
        exitEssids.select('path.pathVisual')
            .attr('d', d => this.buildCurvePoints(d, true));
        
        exitEssids.select('text')
            .attr('opacity', 0);
            

        const enterEssids = essids.enter()
            .filter(d => this.CHANNEL_GHZ[d.channel])
            .append('g')
                .attr('class', 'essid')
                .attr('essid', d => d.essid)
                .attr('transform', d => `translate(${ this.scaleX(this.CHANNEL_GHZ[d.channel]) }, 0)`);
    
        enterEssids.append('path')
            .attr('class', 'pathClickable')
            .style('stroke', 'transparent')
            .style('stroke-width', 14)
            .style('fill', 'none')
            .style('cursor','pointer')
            .attr('d', d => this.buildCurvePoints(d))
            .on('click', d => this.selectEssid(d));
        
        enterEssids.append('path')
            .style('pointer-events', 'none')
            .attr('class', 'pathVisual')
            .style('stroke', d => getColor(d.essid))
            .style('fill', d => getColor(d.essid))
            .style('fill-opacity', .1)
            .attr('d', d => this.buildCurvePoints(d, true))
            .transition()
            .duration(this.durationTransition)
            .attr('d', d => this.buildCurvePoints(d));
    
        enterEssids.append('text')
            .style('text-anchor','middle')
            .style('cursor','pointer')
            .style('fill', d => getColor(d.essid))
            .text(d => d.essid)
            .attr('y', d => this.setTextPosition(d))
            .attr('opacity', 0)
            .on('click', d => this.selectEssid(d))
            .transition()
            .duration(this.durationTransition)
            .attr('opacity', 1);
    
        essids
            .transition()
            .duration(this.durationTransition)
            .selectAll('path')
            .attr('d', d => this.buildCurvePoints(d));
    
        essids
            .transition()
            .duration(this.durationTransition)
            .select('text')
            .attr('y', d => this.setTextPosition(d));
        
    }
    
    buildCurvePoints(d, isAddedOrRemoved = false) {
        const xChannel = this.scaleX(this.CHANNEL_GHZ[d.channel]);
        const xChannelPlus = this.scaleX(this.CHANNEL_GHZ[d.channel] + this.SPACE_GHZ/2);
        const xDiff = xChannelPlus - xChannel;

        return this.lineGenerator([
            [-xDiff, this.HEIGHT-this.BORDER*2+2], 
            [0, (isAddedOrRemoved === true) ? this.HEIGHT-this.BORDER*2+2 : this.scaleY(d.power)],   
            [xDiff, this.HEIGHT-this.BORDER*2+2]
        ]);
    }

    setTextPosition(d) {
        return this.scaleY(d.power) - 5;
    }
    
    selectEssid(d) {
        this.selectedEssid = d.essid;
    
        this.elContainer.selectAll('.essid')
            .select('path.pathVisual')
            .style('stroke-width', d => d.essid === this.selectedEssid ? 5 : 1);
    }
}


const data = [
    {essid: 'A', channel: 1, power: -40},
    {essid: 'B', channel: 3, power: -55},
    {essid: 'C', channel: 153, power: -66},
    {essid: 'D', channel: 1, power: -46},
    {essid: 'E', channel: 9, power: -81},
    {essid: 'F', channel: 12, power: -92},
    {essid: 'G', channel: 14, power: -71},
    {essid: 'H', channel: 52, power: -55},
    {essid: 'I', channel: 128, power: -41},
    {essid: 'J', channel: 192, power: -95},
    {essid: 'K', channel: 208, power: -28},
    {essid: 'L', channel: 216, power: -28},
];

const graph24ghz = new WifiFreqChart(d3.select('#chart1'), 2.4, data, 600, 500);
const graph5ghz = new WifiFreqChart(d3.select('#chart2'), 5, data, 900, 500);



///////////////////////
///////////////////////
// Actions

function updateValues() {
    data.forEach(d => {
        d.power = randomIntFromInterval(-110, -30)
    });
    
    console.table(data);
    graph24ghz.updateData(data);
    graph5ghz.updateData(data);
}

function removeLast() {
    data.pop();
    
    console.table(data);
    graph24ghz.updateData(data);
    graph5ghz.updateData(data);
}

function addOne() {
    const allChannels = [...Object.keys(BANDS.B24GHZ.CHANNEL_GHZ), ...Object.keys(BANDS.B24GHZ.CHANNEL_GHZ), ...Object.keys(BANDS.B5GHZ.CHANNEL_GHZ)];

    data.push({
        essid: `RDN ${ randomIntFromInterval(1, 1000000) }`,
        channel: allChannels[randomIntFromInterval(0, allChannels.length)],
        power: randomIntFromInterval(-50, 100),
    });
    
    console.table(data);
    graph24ghz.updateData(data);
    graph5ghz.updateData(data);
}

function resizeBig() {
    graph24ghz.resize(800, 700);
    graph5ghz.resize(1100, 700);
}

function resizeMedium() {
    graph24ghz.resize(600, 500);
    graph5ghz.resize(900, 500);
}

function resizeSmall() {
    graph24ghz.resize(300, 250);
    graph5ghz.resize(450, 250);
}
