var dataColors = ["#FF8000", "#00FF80", "#0080FF", "#FF8080", "#FFFF00", "#00FFFF", "#FF00FF"];
var dataPoints = {"Eating": 10, "Sleeping": 20, "Playing Games": 25, "YouTube": 10, "CMS": 10, "Complaining": 25};
var Colors;

function convertToHex(arrColor) {
    var hex = "0123456789ABCDEF";
    var hexp = (num) => hex[Math.floor(num / 16) % 16] + hex[num % 16]
    return '#' + hexp(arrColor[0]) + hexp(arrColor[1]) + hexp(arrColor[2]);
}

function returnColors () {
    var pie = document.getElementById("pie");

    radius = 150;
    
    pie.width = 400;
    pie.height = 400;
    /** @type {CanvasRenderingContext2D} */
    var c = pie.getContext("2d");

    window.Colors = drawPieChart(c, dataPoints);

    var c1 = document.getElementById("val");
    /** @type {CanvasRenderingContext2D} */
    var c2 = c1.getContext("2d");
    c1.width = 200;
    c1.height = 30;
    
    var offset = pie.getBoundingClientRect();

    pie.onmousemove = function(e) {
        var x = parseInt(e.clientX - offset.x), y = parseInt(e.clientY - offset.y);
        var img = c.getImageData(x, y, 1, 1);
        c1.style.top = e.clientY - 40;
        c1.style.left = e.clientX - 50;
        
        c1.style.background = "#0000";
        c1.style.border = "0";

        var val = convertToHex([img.data[0], img.data[1], img.data[2]]);

        var index = CheckColor(val);
        if(index !== null) {
            c1.style.background = "#FFFFFF45";
            c1.style.border = "2px solid #FFFFFF88";

            c2.clearRect(0, 0, 200, 30);
            c2.font = "20px Bahnschrift, sans-serif";
            c2.fillText(String(dataPoints[index])+"%: "+index, 20, 20, 150);
            // console.log("Hovered on", dataPoints[index], index);

        } else {
            c1.style.background = "#0000";
            c2.clearRect(0, 0, 200, 30);
            c1.style.border = "0";
        }

    }
    c1.onmousemove = function(e) {
        var offset = pie.getBoundingClientRect();
        if(e.clientX > offset.x && e.clientX < offset.x + pie.width &&
            e.clientY > offset.y && e.clientY < offset.y + pie.height) {
            c1.style.top = e.clientY - 40;
            c1.style.left = e.clientX - 50;
        } else {
            c1.style.background = "#0000";
            c2.clearRect(0, 0, 150, 30);
            c1.style.border = "0";
        }
    }
    return window.Colors;
}

function CheckColor(val) {
    for(let activities in Colors) {
        if(Colors[activities] == val) {
            return activities;
        }
    }
    return null;
}

function TotalSum(dataPoints) {
    var sum = parseInt(0);
    for(let data in dataPoints) {
        sum += dataPoints[data];
    }
    return sum;
}

function drawPieChart(context, dataPoints) {
    var TotalDataValues = TotalSum(dataPoints);
    var CumulativeValue = 0;
    var i = 0;
    Colors = {};
    for(let data in dataPoints) {
        var angle = (dataPoints[data] / TotalDataValues) * 2 * Math.PI;
        drawPieSlice(context, pie.width / 2, pie.height / 2, radius, CumulativeValue, CumulativeValue + angle, dataColors[i]);
        CumulativeValue += angle;
        Colors[data] = dataColors[i];
        ++i;
    }
    return Colors;
}

function drawPieSlice(context, centerX, centerY, radius, AngleStart, AngleEnd, color) {
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.fillStyle = color;
    context.arc(centerX, centerY, radius, AngleStart, AngleEnd);
    context.closePath();
    context.fill();
}
