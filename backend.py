from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://lina:Aver_1012_root@127.0.0.1/myappdb_webjs'
db = SQLAlchemy(app)


# Опишемо модель для таблиці "ships"
class Ship(db.Model):
    __tablename__ = 'Ships'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    tonnage = db.Column(db.Float, nullable=False)
    number_of_passengers = db.Column(db.Integer, nullable=False)
    tonnage_price = db.Column(db.Float, nullable=False)


@app.route('/get_ships', methods=['GET'])
def get_ships():
    sort_by_price = request.args.get('sort_by_price', type=int, default=0)
    ships = Ship.query.all()
    print(sort_by_price)
    print(ships)
    print(sort_by_price)

    if sort_by_price == 1:
        ships = sorted(ships, key=lambda ship: ship.tonnage_price)

    print(ships)
    data = []
    for ship in ships:
        data.append({
            'id': ship.id,
            'name': ship.name,
            'tonnage': ship.tonnage,
            'number_of_passengers': ship.number_of_passengers,
            'tonnage_price': ship.tonnage_price
        })
    return jsonify(data)


@app.route('/delete_ship/<int:ship_id>', methods=['DELETE'])
def delete_ship(ship_id):
    ship = Ship.query.get(ship_id)
    if ship:
        db.session.delete(ship)
        db.session.commit()
        return jsonify({'message': 'Ship deleted successfully'})
    else:
        return jsonify({'message': 'Ship not found'}), 404


@app.route('/search_ships', methods=['GET'])
def search_ships():
    search_term = request.args.get('search_term', type=str, default='')
    ships = Ship.query.filter(Ship.name.ilike(f"%{search_term}%")).all()
    data = []
    for ship in ships:
        data.append({
            'id': ship.id,
            'name': ship.name,
            'tonnage': ship.tonnage,
            'number_of_passengers': ship.number_of_passengers,
            'tonnage_price': ship.tonnage_price
        })
    return jsonify(data)


@app.route('/create_ship', methods=['POST'])
def create_ship():
    data = request.get_json()

    name = data.get('name')
    tonnage = data.get('tonnage')
    passengers = data.get('number_of_passengers')
    tonnage_price = data.get('tonnage_price')

    if name and tonnage is not None and passengers is not None and tonnage_price is not None:
        new_ship = Ship(name=name, tonnage=tonnage, number_of_passengers=passengers, tonnage_price=tonnage_price)
        db.session.add(new_ship)
        db.session.commit()
        return jsonify({'message': 'Ship created successfully'})
    else:
        return jsonify({'message': 'Invalid ship data'}), 400


@app.route('/edit_ship/<int:id>', methods=['PUT'])
def edit_ship(id):
    ship = Ship.query.get(id)

    if ship is None:
        return jsonify({'message': 'Ship not found'}), 404

    data = request.get_json()

    ship.name = data['name']
    ship.tonnage = data['tonnage']
    ship.number_of_passengers = data['number_of_passengers']
    ship.tonnage_price = data['tonnage_price']

    db.session.commit()

    return jsonify({'message': 'Ship updated successfully'})


@app.route('/get_ship/<int:id>', methods=['GET'])
def get_ship(id):
    ship = Ship.query.get(id)

    if ship is None:
        return jsonify({'message': 'Ship not found'}), 404

    ship_data = {
        'id': ship.id,
        'name': ship.name,
        'tonnage': ship.tonnage,
        'number_of_passengers': ship.number_of_passengers,
        'tonnage_price': ship.tonnage_price,
    }

    return jsonify({'ship': ship_data})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
