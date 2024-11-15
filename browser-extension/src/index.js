import axios from 'axios';

// form fields
const form = document.querySelector('.form-data');
const region1 = document.querySelector('.region-name');
const region2 = document.querySelector('.region-name1');
const region3 = document.querySelector('.region-name2');
const apiKey = document.querySelector('.api-key');

// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const myregion1 = document.querySelector('.my-region1');
const myregion2 = document.querySelector('.my-region2');
const clearBtn = document.querySelector('.clear-btn');

const calculateColor = async (value) => {
    let co2Scale = [0, 150, 600, 750, 800];
    let colors = ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02'];
    let closestNum = co2Scale.sort((a, b) => {
        return Math.abs(a - value) - Math.abs(b - value);
    })[0];
    console.log(value + ' is closest to ' + closestNum);
    let num = (element) => element > closestNum;
    let scaleIndex = co2Scale.findIndex(num);                   
    let closestColor = colors[scaleIndex];
    console.log(scaleIndex, closestColor);
    chrome.runtime.sendMessage({ action: 'updateIcon', value: { color: closestColor } });
};

const displayCarbonUsage = async (apiKey, region1, region2, region3) => {
    try {
        // 각 지역에 대해 데이터를 가져오기
        const regions = [region1, region2, region3];
        for (const region of regions) {
            const response = await axios.get('https://api.co2signal.com/v1/latest', {
                params: {
                    countryCode: region,
                },
                headers: {
                    'auth-token': apiKey,
                },
            });

            const data = response.data.data;
            const CO2 = Math.floor(data.carbonIntensity);
            await calculateColor(CO2);

            // 각 지역의 결과 표시
            if (region === region1) {
                myregion.textContent = region;
            } else if (region === region2) {
                myregion1.textContent = region;
            } else if (region === region3) {
                myregion2.textContent = region;
            }

            usage.textContent =
                Math.round(data.carbonIntensity) + ' grams (grams CO2 emitted per kilowatt hour)';
            fossilfuel.textContent =
                data.fossilFuelPercentage.toFixed(2) +
                '% (percentage of fossil fuels used to generate electricity)';

            results.style.display = 'block';
        }
        
        loading.style.display = 'none';
        form.style.display = 'none';
        clearBtn.style.display = 'block';
    } catch (error) {
        console.log(error);
        loading.style.display = 'none';
        results.style.display = 'none';
        errors.textContent = 'Sorry, we have no data for the regions you have requested.';
    }
};

function setUpUser(apiKey, regionName1, regionName2, regionName3) {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionName', JSON.stringify([regionName1, regionName2, regionName3]));
    loading.style.display = 'block';
    errors.textContent = '';
    clearBtn.style.display = 'block';
    displayCarbonUsage(apiKey, regionName1, regionName2, regionName3);
}

function handleSubmit(e) {
    e.preventDefault();
    setUpUser(apiKey.value, region1.value, region2.value, region3.value);
}

function init() {
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegion = localStorage.getItem('regionName');
    
    if (storedApiKey === null || storedRegion === null) {
        form.style.display = 'block';
        results.style.display = 'none';
        loading.style.display = 'none';
        clearBtn.style.display = 'none';
        errors.textContent = '';
    } else {
        const [region1, region2, region3] = JSON.parse(storedRegion);
        displayCarbonUsage(storedApiKey, region1, region2, region3);
        results.style.display = 'none';
        form.style.display = 'none';
        clearBtn.style.display = 'block';
    }
};

function reset(e) {
    e.preventDefault();
    localStorage.removeItem('regionName');
    init();
}

form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));    

//start app
init();