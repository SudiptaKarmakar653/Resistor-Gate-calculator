document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Resistor Calculator
    const bandCountSelect = document.getElementById('band-count');
    const bandsContainer = document.querySelector('.bands-container');
    const resistorBands = [
        document.getElementById('band1'),
        document.getElementById('band2'),
        document.getElementById('band3'),
        document.getElementById('band4'),
        document.getElementById('band5'),
        document.getElementById('band6')
    ];
    
    const colorOptions = [
        {name: 'Black', value: 'black', hex: '#000000'},
        {name: 'Brown', value: 'brown', hex: '#964B00'},
        {name: 'Red', value: 'red', hex: '#FF0000'},
        {name: 'Orange', value: 'orange', hex: '#FFA500'},
        {name: 'Yellow', value: 'yellow', hex: '#FFFF00'},
        {name: 'Green', value: 'green', hex: '#00FF00'},
        {name: 'Blue', value: 'blue', hex: '#0000FF'},
        {name: 'Violet', value: 'violet', hex: '#EE82EE'},
        {name: 'Gray', value: 'gray', hex: '#808080'},
        {name: 'White', value: 'white', hex: '#FFFFFF'},
        {name: 'Gold', value: 'gold', hex: '#FFD700'},
        {name: 'Silver', value: 'silver', hex: '#C0C0C0'}
    ];
    
    // Generate band selectors based on band count
    function generateBandSelectors(count) {
        bandsContainer.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const bandDiv = document.createElement('div');
            bandDiv.className = 'band-option';
            
            const label = document.createElement('label');
            label.textContent = `Band ${i + 1}:`;
            
            const select = document.createElement('select');
            select.className = 'band-select';
            select.dataset.band = i + 1;
            
            // Add color options
            colorOptions.forEach(color => {
                const option = document.createElement('option');
                option.value = color.value;
                option.textContent = color.name;
                select.appendChild(option);
            });
            
            // Add event listener to update resistor visual
            select.addEventListener('change', function() {
                const bandIndex = parseInt(this.dataset.band) - 1;
                const color = colorOptions.find(c => c.value === this.value);
                resistorBands[bandIndex].style.backgroundColor = color.hex;
                resistorBands[bandIndex].style.display = 'block';
            });
            
            bandDiv.appendChild(label);
            bandDiv.appendChild(select);
            bandsContainer.appendChild(bandDiv);
        }
        
        // Hide unused bands in visual
        for (let i = 0; i < resistorBands.length; i++) {
            if (i < count) {
                resistorBands[i].style.display = 'block';
            } else {
                resistorBands[i].style.display = 'none';
            }
        }
    }
    
    // Initial setup
    generateBandSelectors(4);
    
    // Handle band count change
    bandCountSelect.addEventListener('change', function() {
        generateBandSelectors(parseInt(this.value));
    });
    
    // Calculate resistance
    document.getElementById('calculate-resistance').addEventListener('click', function() {
        const bandCount = parseInt(bandCountSelect.value);
        const bandSelects = document.querySelectorAll('.band-select');
        const bands = Array.from(bandSelects).map(select => select.value);
        
        if (bands.length !== bandCount) {
            alert('Please select colors for all bands');
            return;
        }
        
        fetch('/calculate_resistance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({bands: bands})
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.getElementById('resistance-value').textContent = data.resistance;
                document.getElementById('tolerance-value').textContent = data.tolerance;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while calculating resistance');
        });
    });
    
    // Logic Gate Simulator
    const gateTypeSelect = document.getElementById('gate-type');
    const inputsContainer = document.querySelector('.inputs');
    const addInputBtn = document.querySelector('.add-input');
    const removeInputBtn = document.querySelector('.remove-input');
    const gateSymbol = document.querySelector('.gate-symbol');
    
    let inputCount = 2;
    
    // Generate input selectors
    function generateInputs(count) {
        inputsContainer.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'input-item';
            
            const label = document.createElement('label');
            label.textContent = `Input ${i + 1}:`;
            
            const select = document.createElement('select');
            select.className = 'gate-input';
            
            const option0 = document.createElement('option');
            option0.value = '0';
            option0.textContent = '0 (Low)';
            
            const option1 = document.createElement('option');
            option1.value = '1';
            option1.textContent = '1 (High)';
            
            select.appendChild(option0);
            select.appendChild(option1);
            
            inputDiv.appendChild(label);
            inputDiv.appendChild(select);
            inputsContainer.appendChild(inputDiv);
        }
        
        updateGateSymbol();
    }
    
    // Update gate symbol display
    function updateGateSymbol() {
        const gateType = gateTypeSelect.value;
        let symbol = '';
        
        switch (gateType) {
            case 'AND':
                symbol = 'AND';
                break;
            case 'OR':
                symbol = 'OR';
                break;
            case 'NOT':
                symbol = 'NOT';
                break;
            case 'NAND':
                symbol = 'NAND';
                break;
            case 'NOR':
                symbol = 'NOR';
                break;
            case 'XOR':
                symbol = 'XOR';
                break;
            case 'XNOR':
                symbol = 'XNOR';
                break;
        }
        
        gateSymbol.textContent = symbol;
    }
    
    // Initial setup
    generateInputs(2);
    
    // Add input button
    addInputBtn.addEventListener('click', function() {
        if (inputCount < 8) {
            inputCount++;
            generateInputs(inputCount);
        } else {
            alert('Maximum 8 inputs allowed');
        }
    });
    
    // Remove input button
    removeInputBtn.addEventListener('click', function() {
        if (inputCount > 1) {
            inputCount--;
            generateInputs(inputCount);
        } else {
            alert('Minimum 1 input required');
        }
    });
    
    // Gate type change
    gateTypeSelect.addEventListener('change', function() {
        // NOT gate only needs 1 input
        if (this.value === 'NOT') {
            inputCount = 1;
            generateInputs(1);
        } else if (inputCount === 1) {
            // If switching from NOT to another gate, set to 2 inputs
            inputCount = 2;
            generateInputs(2);
        }
        
        updateGateSymbol();
    });
    
    // Calculate gate output
    document.getElementById('calculate-gate').addEventListener('click', function() {
        const gateType = gateTypeSelect.value;
        const inputSelects = document.querySelectorAll('.gate-input');
        const inputs = Array.from(inputSelects).map(select => select.value === '1');
        
        fetch('/calculate_gate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                gate: gateType,
                inputs: inputs
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                const output = data.result ? '1 (High)' : '0 (Low)';
                document.getElementById('gate-output').textContent = output;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while calculating gate output');
        });
    });
});