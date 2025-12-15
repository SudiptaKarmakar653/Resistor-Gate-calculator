function updateTruthTable() {
    const gateType = document.getElementById('gate-type').value;
    const inputCount = document.querySelectorAll('.input-switch').length;
    const combinations = generateCombinations(inputCount);
    
    let tableHTML = `
        <h4>Truth Table (${gateType})</h4>
        <table>
            <thead>
                <tr>
    `;
    
    // হেডার তৈরি (A, B, C...)
    for (let i = 0; i < inputCount; i++) {
        tableHTML += `<th>Input ${String.fromCharCode(65 + i)}</th>`;
    }
    tableHTML += `<th>Output</th></tr></thead><tbody>`;
    
    // টেবিল ডেটা যোগ করুন
    combinations.forEach(comb => {
        tableHTML += '<tr>';
        comb.forEach(bit => tableHTML += `<td>${bit}</td>`);
        tableHTML += `<td>${calculateGateOutput(gateType, comb)}</td></tr>`;
    });
    
    tableHTML += '</tbody></table>';
    document.getElementById('truth-table-container').innerHTML = tableHTML;
}

// কম্বিনেশন জেনারেটর
function generateCombinations(inputCount) {
    const total = Math.pow(2, inputCount);
    return Array.from({ length: total }, (_, i) =>
        i.toString(2).padStart(inputCount, '0').split('').map(Number)
    );
}

// গেট আউটপুট ক্যালকুলেটর
function calculateGateOutput(gateType, inputs) {
    switch (gateType) {
        case 'AND': return inputs.every(i => i) ? 1 : 0;
        case 'OR': return inputs.some(i => i) ? 1 : 0;
        case 'NOT': return inputs[0] ? 0 : 1;
        case 'XOR': return inputs.filter(i => i).length % 2 ? 1 : 0;
        default: return 0;
    }
}