var canvas = document.getElementById("canvas");
var permaCanvas = document.getElementById("imageView");
var pencilButton = document.getElementById("pencil");
var newButton = document.getElementById("new");
var lineButton = document.getElementById("line");
var rectangleButton = document.getElementById("rectangle");
var circleButton = document.getElementById("circle");
var eraserButton = document.getElementById("eraser");
var context = canvas.getContext("2d");
var permaContext = permaCanvas.getContext("2d");
var lineWidth = 2;
var lineColour = "#000000";


var Tool = {
    LINE : 0,
    PENCIL : 1,
    RECTANGLE : 2,
    CIRCLE : 3,
    ERASER : 4
};

var currentTool = Tool.LINE;
var x, y;


var widthOffset = getOffset( document.getElementById('canvas') ).left;
var heightOffset = getOffset( document.getElementById('canvas') ).top;
var mouseDown = false;



var MouseStart = {
    X : 0,
    Y : 0
};

var MouseEnd = {
    X : 0,
    Y : 0
};


newButton.onclick = function ( event ) {
    clearCanvas(permaContext, permaCanvas);
    clearCanvas(context, canvas);
};


pencilButton.onclick = function ( event ) {
    currentTool = Tool.PENCIL;
};

lineButton.onclick = function ( event ) {
    currentTool = Tool.LINE;
};

rectangleButton.onclick = function ( event ) {
    currentTool = Tool.RECTANGLE;
};

circleButton.onclick = function ( event ) {
    currentTool = Tool.CIRCLE;
};

eraserButton.onclick = function ( event ) {
    currentTool = Tool.ERASER;
};

canvas.onmousedown = function( event ) {

    MouseStart.X = event.pageX - widthOffset;
    MouseStart.Y = event.pageY - heightOffset;
    mouseDown = true;
    context.lineWidth = lineWidth;
    context.strokeStyle = lineColour;

    console.log(MouseStart);

    switch (currentTool) {
        case Tool.LINE:
            Line.Preview();
            break;
        case Tool.PENCIL:
            if(!Pencil.Started)
                Pencil.Begin();
            Pencil.Draw();
            break;
        case Tool.RECTANGLE:
            Rectangle.Draw();
            break;
        case Tool.CIRCLE:
            Circle.Draw();
            break;
        case Tool.ERASER:
            if(!Eraser.Started)
                Eraser.Begin();
            Eraser.Draw();
            break;
        default:
            throw RangeException;
    }
};

canvas.onmouseup = function(event)
{
    mouseDown = false;

    switch (currentTool) {
        case Tool.LINE:
            Line.EndPreview();
            break;
        case Tool.PENCIL:
            Pencil.End();
            break;
        case Tool.RECTANGLE:
            break;
        case Tool.CIRCLE:
            break;
        case Tool.ERASER:
            Eraser.End();
            break;
        default:
            throw RangeException;
    }

    permaContext.drawImage(canvas, 0 ,0);
};


var Eraser =
{
    Started : false,

    Begin : function()
    {
        context.beginPath();
        context.moveTo(MouseStart.X, MouseStart.Y);
        this.Started = true;
    },

    Draw : function()
    {
        canvas.onmousemove = function (ev) {
            if(mouseDown)
            {

                MouseEnd.X = ev.x - widthOffset;
                MouseEnd.Y = ev.y - heightOffset;

                context.lineWidth = 20;
                context.strokeStyle = "#FFFFFF";
                context.lineTo(MouseEnd.X, MouseEnd.Y);
                context.stroke();

            }
        };
    },

    End : function()
    {
        context.closePath();
        this.Started = false;
    }
};

var Pencil =
{
    Started : false,

    Begin : function()
    {
        context.beginPath();
        context.moveTo(MouseStart.X, MouseStart.Y);
        this.Started = true;
    },

    Draw : function()
    {
        canvas.onmousemove = function (ev) {
            if(mouseDown)
            {

                MouseEnd.X = ev.x - widthOffset;
                MouseEnd.Y = ev.y - heightOffset;


                context.lineTo(MouseEnd.X, MouseEnd.Y);
                context.stroke();

            }
        };
    },

    End : function()
    {
        context.closePath();
        this.Started = false;
    }

};

var Circle =
{
    Draw : function()
    {

        canvas.onmousemove = function (ev) {
            if(mouseDown)
            {
                MouseEnd.X = ev.x - widthOffset;
                MouseEnd.Y = ev.y - heightOffset;

                var x = MouseEnd.X - MouseStart.X;
                var y = MouseEnd.Y - MouseStart.Y;
                var radius = Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));

                var circumference = Math.max(x, y);
                var scaleX = x / circumference;
                var scaleY = y / circumference;

                context.save();
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.translate(x, y);
                context.scale(scaleX, scaleY);
                context.beginPath();
                context.arc(MouseStart.X, MouseStart.Y, radius, 0, 360);
                context.stroke();
                context.closePath();
                context.restore();
            }
        };
    }
};

var Rectangle =
{
    Draw : function()
    {
        canvas.onmousemove = function (ev) {
            if(mouseDown)
            {
                MouseEnd.X = ev.x - widthOffset;
                MouseEnd.Y = ev.y - heightOffset;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.strokeStyle = "#000000";
                context.strokeRect(MouseStart.X, MouseStart.Y, MouseEnd.X - MouseStart.X, MouseEnd.Y - MouseStart.Y);
            }
        };
    }
};


var Line =
{
    Preview : function()
    {
        canvas.onmousemove = function (ev) {
            if(mouseDown)
            {
                MouseEnd.X = ev.x - widthOffset;
                MouseEnd.Y = ev.y - heightOffset;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                context.moveTo(MouseStart.X, MouseStart.Y);
                context.lineTo(MouseEnd.X, MouseEnd.Y);
                context.stroke();
                context.closePath();
            }
        };
    },

    EndPreview : function()
    {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.moveTo(MouseStart.X, MouseStart.Y);
        context.lineTo(MouseEnd.X, MouseEnd.Y);
        context.stroke();
        context.closePath();
    }
};


function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}


function clearCanvas(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    var w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
}
