let lastHSLColorSelected = {
    h: 0,
    s: 0,
    l: 0
};
let lastHEXColorSelected = '';
let lastRGBColorSelected = {
    r: 0,
    g: 0,
    b: 0,
};

// Source: https://stackoverflow.com/questions/57319394/how-to-automatically-change-text-color-base-on-background-color-in-angularjs
function convertHexToRGB(colour) {
    let r,g,b;
    if ( colour.charAt(0) === '#' ) {
        colour = colour.substr(1);
    }
    if ( colour.length === 3 ) {
        colour = colour.substr(0,1)
            + colour.substr(0,1)
            + colour.substr(1,2)
            + colour.substr(1,2)
            + colour.substr(2,3)
            + colour.substr(2,3);
    }
    r = colour.charAt(0) + '' + colour.charAt(1);
    g = colour.charAt(2) + '' + colour.charAt(3);
    b = colour.charAt(4) + '' + colour.charAt(5);
    r = parseInt( r,16 );
    g = parseInt( g,16 );
    b = parseInt( b ,16);
    document.getElementById('rgbColor').children[0].textContent = 'rgb(' + r + ',' + g + ',' + b + ')';
    lastRGBColorSelected = {
        r: r,
        g: g,
        b: b,
    }
}

// source rgb to hsl https://github.com/JuhQ/rgb-to-hsl/blob/master/src/index.coffee
function convertRGBToHSL(r, g, b){
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    lastHSLColorSelected = {
        h: Math.floor(h * 360),
        s: Math.floor(s * 100),
        l: Math.floor(l * 100),
    };
    document.getElementById('hslColor').children[0].textContent = `hsl(${lastHSLColorSelected.h}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`
}

function convertRgbToHex(colour) {
    // convert RGB to HEX
    let RGBArray = colour.match(/\d+/g); //Source: https://stackoverflow.com/questions/9585973/javascript-regular-expression-for-rgb-values
    const rgbToHex = function (rgb) { // Source: https://campushippo.com/lessons/how-to-convert-rgb-colors-to-hexadecimal-with-javascript-78219fdb
        let hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };

    lastHEXColorSelected = "#" + rgbToHex(RGBArray[0]) + rgbToHex(RGBArray[1]) + rgbToHex(RGBArray[2]);

}

// function display color values
function doSetNewColor(newColor) {
    if(newColor) {
        convertHexToRGB(newColor);
        document.getElementById('hexColor').children[0].textContent = newColor;
        document.getElementById('demoColor').style.background = newColor;
        convertRGBToHSL(lastRGBColorSelected.r, lastRGBColorSelected.g, lastRGBColorSelected.b);
    }
}

// function display color values on hover
function doSetNewColorHover(newColor) {
        if(newColor) {
            convertRgbToHex(newColor);
            convertRGBToHSL(lastRGBColorSelected.r, lastRGBColorSelected.g, lastRGBColorSelected.b);
            convertHexToRGB(lastHEXColorSelected);
            document.getElementById('hexColor').children[0].textContent = lastHEXColorSelected;
    }
}
// functions blend steps from max color value to the lowest one
let blendHue = (step) => {
    let newColor = lastHSLColorSelected.h - step;

    if (newColor < 0) {
        return 360 - step;
    } if(newColor > 360) {
        return step;
    } else return lastHSLColorSelected.h - step;
};

let blendSaturation = (step) => {
    let newColor = lastHSLColorSelected.s - step;

    if (newColor < 0) {
        return 100 - step;
    } if(newColor > 100) {
        return step;
    } else return lastHSLColorSelected.s - step;
};

let blendLight = (step) => {
    let newColor = lastHSLColorSelected.l - step;

    if (newColor < 0) {
        return 100 - step;
    } if(newColor > 100) {
        return step;
    } else return lastHSLColorSelected.l - step;
};

// functions display color schemes
const doSetColorScheme = (typeOfColorShift) => {
    switch (typeOfColorShift) {
        case 'Analogous': {
            const colorBlocks = document.querySelectorAll('.swatch');

            colorBlocks[0].style.background = `hsl(${blendHue(40)}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[1].style.background = `hsl(${blendHue(20)}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[2].style.background = `hsl(${lastHSLColorSelected.h}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[3].style.background = `hsl(${blendHue(-20)}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[4].style.background = `hsl(${blendHue(-40)}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            break;
        } case 'Monochromatic': {
            const colorBlocks = document.querySelectorAll('.swatch');

            colorBlocks[0].style.background = `hsl(${lastHSLColorSelected.h}, ${(lastHSLColorSelected.s)}%, ${blendLight(30)}%)`;
            colorBlocks[1].style.background = `hsl(${lastHSLColorSelected.h}, ${(lastHSLColorSelected.s)}%, ${blendLight(15)}%)`;
            colorBlocks[2].style.background = `hsl(${lastHSLColorSelected.h}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[3].style.background = `hsl(${lastHSLColorSelected.h}, ${(lastHSLColorSelected.s)}%, ${blendLight(-15)}%)`;
            colorBlocks[4].style.background = `hsl(${lastHSLColorSelected.h}, ${(lastHSLColorSelected.s)}%, ${blendLight(-30)}%)`;
            break;
        } case 'Triad': {
            const colorBlocks = document.querySelectorAll('.swatch');

            colorBlocks[0].style.background = `hsl(${blendHue(120)}, ${(lastHSLColorSelected.s)}%, ${blendLight(10)}%)`;
            colorBlocks[1].style.background = `hsl(${blendHue(120)}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[2].style.background = `hsl(${lastHSLColorSelected.h}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[3].style.background = `hsl(${blendHue(240)}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[4].style.background = `hsl(${blendHue(240)}, ${(lastHSLColorSelected.s)}%, ${blendLight(-10)}%)`;
            break;
        } case 'Complementary': {
            const colorBlocks = document.querySelectorAll('.swatch');

            colorBlocks[0].style.background = `hsl(${blendHue(120)}, ${blendSaturation(5)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[1].style.background = `hsl(${blendHue(180)}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[2].style.background = `hsl(${lastHSLColorSelected.h}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[3].style.background = `hsl(${lastHSLColorSelected.h}, ${blendSaturation(20)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[4].style.background = `hsl(${lastHSLColorSelected.h}, ${blendSaturation(40)}%, ${(lastHSLColorSelected.l)}%)`;
            break;
        } case 'Compound': {
            const colorBlocks = document.querySelectorAll('.swatch');

            colorBlocks[0].style.background = `hsl(${blendHue(160)}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[1].style.background = `hsl(${blendHue(180)}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[2].style.background = `hsl(${lastHSLColorSelected.h}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[3].style.background = `hsl(${blendHue(-20)}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[4].style.background = `hsl(${blendHue(-20)}, ${(lastHSLColorSelected.s)}%, ${blendLight(-10)}%)`;
            break;
        } case 'Shades': {
            const colorBlocks = document.querySelectorAll('.swatch');

            colorBlocks[0].style.background = `hsl(${lastHSLColorSelected.h}, ${blendSaturation(30)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[1].style.background = `hsl(${lastHSLColorSelected.h}, ${blendSaturation(15)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[2].style.background = `hsl(${lastHSLColorSelected.h}, ${(lastHSLColorSelected.s)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[3].style.background = `hsl(${lastHSLColorSelected.h}, ${blendSaturation(70)}%, ${(lastHSLColorSelected.l)}%)`;
            colorBlocks[4].style.background = `hsl(${lastHSLColorSelected.h}, ${blendSaturation(95)}%, ${(lastHSLColorSelected.l)}%)`;
            break;
        }
        default: {
            return;
        }
    }
};
