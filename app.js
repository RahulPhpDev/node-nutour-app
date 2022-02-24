const fs = require('fs');
const express = require('express');

const app = express();
// middleware for get object
app.use( express.json() )


const port = 3002
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v/tours', (req, res) => {
    
    res.status(200)
      .json({
        status: 'success',
        result: tours.length,
        data: {
            tours: tours.reverse()
        }   
      })
});


app.get('/api/v/tour/:id', (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(tour => tour.id === id);
    if (!tour) {
        return res.status(404)
        .json({
          status: 'fail'
        })
    }
        res.status(200)
        .json({
          status: 'success',
          data: {
              tour
          }   
        })
   
});


//by defualt req.body dont get
// we need to add middleware
app.post('/api/v/tours', (req, res) => {
    const lastTourId = tours[ tours.length - 1].id + 1;

    const requestParms = {
        id: lastTourId,
        ...req.body
    };

    tours.push( requestParms );

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, 
            JSON.stringify(tours),
            err => {
                res.status(201).json({
                    status: 'success',
                    data: {
                        msg: 'crated',
                        record: requestParms
                    }
                })
            }
        )
})



app.put('/api/v/tour/:id', (req, res) => {
    const id = req.params.id * 1;
    
    let tourObject;
    let tourIndex;

    tours.map((value, key) => {
        if ( value.id === id ) {
            tourIndex = key;
            tourObject = value;
            return ;
        }
    })

    const requestParms = {
        ...tourObject,
        ...req.body
    };
//     const fruits = ["Banana", "Orange", "Apple", "Mango"];
// 
// // At position 2, add 2 elements: 
// fruits.splice(2, 0, "Lemon", "Kiwi");
tours.splice(tourIndex, 1,requestParms );

//    console.log(tourObject)
//    console.log(tourIndex)

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, 
            JSON.stringify(tours),
            err => {
                res.status(201).json({
                    status: 'updated',
                    data: {
                        msg: 'Updated',
                        record: requestParms
                    }
                })
            }
        )
})




app.get('/', (req, res) => {
    res
        .status(200)
        .send("Hello from the server");
})


app.get('/json', (req, res) => {
    res
        .status(200)
        .json( {message: 'Hello from server',
        app: 'Natours   '
    });
})


app.listen( port , () => {
    console.log(`App Running on port ${port}`)
});