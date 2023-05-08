require('dotenv').config(); 

const {CONNECTION_STRING} = process.env;

const Sequelize = require('sequelize'); 

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    seed: (req, res) => {
        sequelize.query(`
        INSERT INTO cities (name, rating, country_id)
        VALUES ('Detroit', 5, 187),('Kalamazoo', 3, 187),('Ypsilanti', 4, 187);
        `).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))
    }, 
    getCountries: (req, res) => {
            sequelize.query(`
                SELECT *
                FROM countries; 
                `)
                .then(dbRes => res.status(200).send(dbRes[0]))
                .catch(err => console.log(err))
        },

    createCity: (req, res) => {
	const { name, rating, countryId} = req.body; //destructure all the parameters of the object	
    //insert city into table
    sequelize.query(`
        INSERT INTO cities(name, rating, country_id)
        VALUES ('${name}', ${rating}, ${countryId})
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => {res.status(500).send(err)});
    }, 
    getCities: (req, res) => {
        sequelize.query(`
              SELECT
                  c.city_id,
                  c.name AS city_name,
                  c.rating,
                  co.name AS country_name
              FROM cities c
              JOIN countries co
              ON c.country_id = co.country_id
              ORDER BY rating DESC;
          `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => {res.status(500).send(err)});
    }, 
    deleteCity: (req, res) => {
        const { id } = req.params; 
        sequelize.query(`
        DELETE FROM cities
        WHERE city_id = ${id}
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => {res.status(500).send(err)});
    }
    }