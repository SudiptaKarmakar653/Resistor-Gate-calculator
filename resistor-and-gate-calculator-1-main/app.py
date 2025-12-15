from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Resistor color code data
resistor_data = {
    'digits': {
        'black': {'value': 0, 'multiplier': 1},
        'brown': {'value': 1, 'multiplier': 10, 'tolerance': '±1%'},
        'red': {'value': 2, 'multiplier': 100, 'tolerance': '±2%'},
        'orange': {'value': 3, 'multiplier': 1000},
        'yellow': {'value': 4, 'multiplier': 10000},
        'green': {'value': 5, 'multiplier': 100000, 'tolerance': '±0.5%'},
        'blue': {'value': 6, 'multiplier': 1000000, 'tolerance': '±0.25%'},
        'violet': {'value': 7, 'multiplier': 10000000, 'tolerance': '±0.1%'},
        'gray': {'value': 8, 'multiplier': 100000000, 'tolerance': '±0.05%'},
        'white': {'value': 9, 'multiplier': 1000000000},
        'gold': {'multiplier': 0.1, 'tolerance': '±5%'},
        'silver': {'multiplier': 0.01, 'tolerance': '±10%'}
    },
    'tolerance': {
        'brown': '±1%',
        'red': '±2%',
        'green': '±0.5%',
        'blue': '±0.25%',
        'violet': '±0.1%',
        'gray': '±0.05%',
        'gold': '±5%',
        'silver': '±10%',
        'none': '±20%'
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate_resistance', methods=['POST'])
def calculate_resistance():
    data = request.get_json()
    bands = data['bands']
    
    try:
        # 4-band resistor
        if len(bands) == 4:
            digit1 = resistor_data['digits'][bands[0]]['value']
            digit2 = resistor_data['digits'][bands[1]]['value']
            multiplier = resistor_data['digits'][bands[2]]['multiplier']
            tolerance = resistor_data['digits'].get(bands[3], {}).get('tolerance', '±20%')
            
            resistance = (digit1 * 10 + digit2) * multiplier
            return jsonify({
                'resistance': format_resistance(resistance),
                'tolerance': tolerance
            })
        
        # 5-band resistor
        elif len(bands) == 5:
            digit1 = resistor_data['digits'][bands[0]]['value']
            digit2 = resistor_data['digits'][bands[1]]['value']
            digit3 = resistor_data['digits'][bands[2]]['value']
            multiplier = resistor_data['digits'][bands[3]]['multiplier']
            tolerance = resistor_data['digits'].get(bands[4], {}).get('tolerance', '±20%')
            
            resistance = (digit1 * 100 + digit2 * 10 + digit3) * multiplier
            return jsonify({
                'resistance': format_resistance(resistance),
                'tolerance': tolerance
            })
        
        # 6-band resistor (with temperature coefficient)
        elif len(bands) == 6:
            digit1 = resistor_data['digits'][bands[0]]['value']
            digit2 = resistor_data['digits'][bands[1]]['value']
            digit3 = resistor_data['digits'][bands[2]]['value']
            multiplier = resistor_data['digits'][bands[3]]['multiplier']
            tolerance = resistor_data['digits'].get(bands[4], {}).get('tolerance', '±20%')
            temp_coeff = bands[5]  # Not used in this simplified version
            
            resistance = (digit1 * 100 + digit2 * 10 + digit3) * multiplier
            return jsonify({
                'resistance': format_resistance(resistance),
                'tolerance': tolerance,
                'temp_coeff': temp_coeff
            })
        
        else:
            return jsonify({'error': 'Invalid number of bands'}), 400
    
    except KeyError as e:
        return jsonify({'error': f'Invalid color: {str(e)}'}), 400

def format_resistance(resistance):
    if resistance >= 1000000000:
        return f"{resistance / 1000000000:.2f} GΩ"
    elif resistance >= 1000000:
        return f"{resistance / 1000000:.2f} MΩ"
    elif resistance >= 1000:
        return f"{resistance / 1000:.2f} KΩ"
    else:
        return f"{resistance:.2f} Ω"

@app.route('/calculate_gate', methods=['POST'])
def calculate_gate():
    data = request.get_json()
    gate_type = data['gate']
    inputs = data['inputs']
    
    try:
        if gate_type == 'AND':
            result = all(inputs)
        elif gate_type == 'OR':
            result = any(inputs)
        elif gate_type == 'NOT':
            if len(inputs) != 1:
                return jsonify({'error': 'NOT gate requires exactly 1 input'}), 400
            result = not inputs[0]
        elif gate_type == 'NAND':
            result = not all(inputs)
        elif gate_type == 'NOR':
            result = not any(inputs)
        elif gate_type == 'XOR':
            result = sum(inputs) % 2 == 1
        elif gate_type == 'XNOR':
            result = sum(inputs) % 2 == 0
        else:
            return jsonify({'error': 'Invalid gate type'}), 400
        
        return jsonify({'result': result})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)